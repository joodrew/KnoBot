import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const defaultCollectionName = 'groupedSubject';

export async function crud(input, collectionOverride) {
  if (!uri) {
    throw new Error('MONGODBDUMP_URI não está definido nas variáveis de ambiente');
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
      const { subject, desc, id, conversations } = ticket;

      // Verifica se já existe um ticket com mesmo subject e desc
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
        // Atualiza o ticket existente adicionando novos IDs e conversas
        await collection.updateOne(
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
        results.push({ group: normalizedGroupName, subject, desc, action: 'merged into existing ticket' });
      } else {
        // Cria novo grupo ou adiciona novo ticket ao grupo existente
        const groupExists = await collection.findOne({ group: normalizedGroupName });

        if (groupExists) {
          await collection.updateOne(
            { group: normalizedGroupName },
            {
              $push: {
                tickets: ticket
              }
            }
          );
          results.push({ group: normalizedGroupName, subject, desc, action: 'new ticket added to existing group' });
        } else {
          await collection.insertOne({
            group: normalizedGroupName,
            tickets: [ticket]
          });
          results.push({ group: normalizedGroupName, subject, desc, action: 'new group created with ticket' });
        }
      }
    }
  }

  await client.close();
  return results;
}