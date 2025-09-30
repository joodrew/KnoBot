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

  let items = [];

  // Se for uma string JSON (como vem da LLM), faz o parse
  if (typeof input === 'string') {
    try {
      items = JSON.parse(input);
    } catch (err) {
      throw new Error('❌ Erro ao fazer parse do JSON retornado pela LLM');
    }
  } else if (Array.isArray(input)) {
    items = input;
  } else {
    items = [input];
  }

  for (const item of items) {
    const { subject, desc, tickets } = item;

    if (!subject || !desc || typeof tickets !== 'object') {
      results.push({
        subject: subject || 'undefined',
        desc: desc || 'undefined',
        action: 'skipped',
        reason: 'Formato inválido: "subject", "desc" e "tickets" são obrigatórios'
      });
      continue;
    }

    const existing = await collection.findOne({ subject, desc });

    if (existing) {
      const updatedTickets = { ...existing.tickets };

      for (const id in tickets) {
        const newConvs = tickets[id];
        const existingConvs = updatedTickets[id] || [];
        updatedTickets[id] = Array.from(new Set([...existingConvs, ...newConvs]));
      }

      const updateResult = await collection.updateOne(
        { subject, desc },
        { $set: { tickets: updatedTickets } }
      );

      console.log('📌 Ticket existente atualizado:', updateResult);
      results.push({ subject, desc, action: 'merged into existing ticket' });
    } else {
      const insertResult = await collection.insertOne({ subject, desc, tickets });

      console.log('📌 Novo ticket criado:', insertResult);
      results.push({ subject, desc, action: 'new ticket created' });
    }
  }

  await client.close();
  return results;
}