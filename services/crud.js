import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const defaultCollectionName = 'groupedSubject';

export async function crud(input, collectionOverride) {
  if (!uri) {
    throw new Error('❌ MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collectionName = collectionOverride || defaultCollectionName;
  const collection = db.collection(collectionName);

  const results = [];

  // Detecta se é formato antigo (array de agrupamentos com tickets por ID)
  let tickets = [];

  if (Array.isArray(input) && input.every(item => item.subject && item.desc && item.tickets)) {
    console.warn('⚠️ Requisição antiga detectada. Adaptando...');

    for (const item of input) {
      const ids = Object.keys(item.tickets);
      const conversations = ids.flatMap(id => item.tickets[id]);

      tickets.push({
        subject: item.subject,
        desc: item.desc,
        id: ids,
        conversations
      });
    }
  } else if (Array.isArray(input)) {
    tickets = input;
  } else if (input && input.tickets) {
    tickets = input.tickets;
  } else {
    tickets = [input];
  }

  for (const ticket of tickets) {
    const { subject, desc, id = [], conversations = [] } = ticket;

    const existing = await collection.findOne({
      subject,
      desc
    });

    if (existing) {
      const updateResult = await collection.updateOne(
        { subject, desc },
        {
          $addToSet: {
            id: { $each: id },
            conversations: { $each: conversations }
          }
        }
      );

      console.log('📌 Ticket existente atualizado:', updateResult);
      results.push({ subject, desc, action: 'merged into existing ticket' });
    } else {
      const insertResult = await collection.insertOne({
        subject,
        desc,
        id,
        conversations
      });

      console.log('📌 Novo ticket criado:', insertResult);
      results.push({ subject, desc, action: 'new ticket created' });
    }
  }

  await client.close();
  return results;
}