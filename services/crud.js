// services/crud.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const defaultCollectionName = 'groupedSubject';

export async function crud(input, collectionOverride) {
  if (!uri) {
    throw new Error('❌ MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  // Compatibilidade com chamadas antigas que enviavam diretamente um array de tickets
  if (Array.isArray(input) && input.every(item => item.subject && item.desc)) {
    console.warn('⚠️ Requisição antiga detectada. Adaptando...');
    input = { group: 'legacy', tickets: input };
  }

  const data = Array.isArray(input) ? input : [input];
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collectionName = collectionOverride || defaultCollectionName;
  const collection = db.collection(collectionName);

  const results = [];

  for (const group of data) {
    if (!group.group || !Array.isArray(group.tickets)) {
      results.push({
        group: group.group || 'undefined',
        action: 'skipped',
        reason: 'Formato inválido: "group" deve ser string e "tickets" deve ser array'
      });
      continue;
    }

    const normalizedGroupName = group.group.toLowerCase();

    for (const ticket of group.tickets) {
      const { subject, desc, id = [], conversations = [] } = ticket;

      const existing = await collection.findOne({
        group: normalizedGroupName,
        tickets: {
          $elemMatch: {
            subject,
            desc
          }
        }
      });

      if (existing) {
        const updateResult = await collection.updateOne(
          {
            group: normalizedGroupName,
            "tickets.subject": subject,
            "tickets.desc": desc
          },
          {
            $addToSet: {
              "tickets.$.id": { $each: id },
              "tickets.$.conversations": { $each: conversations }
            }
          }
        );

        console.log('📌 Ticket existente atualizado:', updateResult);
        results.push({ group: normalizedGroupName, subject, desc, action: 'merged into existing ticket' });
      } else {
        const groupExists = await collection.findOne({ group: normalizedGroupName });

        if (groupExists) {
          const pushResult = await collection.updateOne(
            { group: normalizedGroupName },
            {
              $push: {
                tickets: ticket
              }
            }
          );

          console.log('📌 Novo ticket adicionado ao grupo existente:', pushResult);
          results.push({ group: normalizedGroupName, subject, desc, action: 'new ticket added to existing group' });
        } else {
          const insertResult = await collection.insertOne({
            group: normalizedGroupName,
            tickets: [ticket]
          });

          console.log('📌 Novo grupo criado com ticket:', insertResult);
          results.push({ group: normalizedGroupName, subject, desc, action: 'new group created with ticket' });
        }
      }
    }
  }

  await client.close();
  return results;
}