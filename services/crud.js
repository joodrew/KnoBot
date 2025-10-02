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

 for (const group of items) {
  const groupName = group.group?.toUpperCase(); // "TRATADO" ou "RETRATAR"
  const collectionName = collectionOverride || (groupName === 'RETRATAR' ? 'groupedRetratar' : 'groupedSubject');
  const collection = db.collection(collectionName);

  if (!group.tickets || !Array.isArray(group.tickets)) continue;

  for (const ticket of group.tickets) {
    const { subject, desc, id, conversations } = ticket;

    if (!subject || !desc || !id || !conversations) {
      results.push({
        subject: subject || 'undefined',
        desc: desc || 'undefined',
        action: 'skipped',
        reason: 'Formato inválido: "subject", "desc", "id" e "conversations" são obrigatórios'
      });
      continue;
    }

    const tickets = {};
    for (let i = 0; i < id.length; i++) {
      tickets[id[i]] = i === 0 ? conversations : [];
    }

    const existing = await collection.findOne({ subject, desc });

    if (existing) {
      const updatedTickets = { ...existing.tickets };
      for (const ticketId in tickets) {
        const newConvs = tickets[ticketId];
        const existingConvs = updatedTickets[ticketId] || [];
        updatedTickets[ticketId] = Array.from(new Set([...existingConvs, ...newConvs]));
      }

      await collection.updateOne(
        { subject, desc },
        { $set: { tickets: updatedTickets } }
      );

      results.push({ subject, desc, action: 'merged into existing ticket', group: groupName });
    } else {
      await collection.insertOne({ subject, desc, tickets });
      results.push({ subject, desc, action: 'new ticket created', group: groupName });
    }
  }
}

  await client.close();
  return results;
}