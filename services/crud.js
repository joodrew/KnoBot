import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const defaultCollectionName = 'groupedSubject';

export async function crud(input, collectionOverride) {
  if (!uri) {
    throw new Error('MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collectionName = collectionOverride || defaultCollectionName;
  const collection = db.collection(collectionName);

  const results = [];

  const data = Array.isArray(input) ? input : [input];

  for (const item of data) {
    // Detecta se é uma resolução técnica (nova LLM)
    const isResolucao =
      item &&
      typeof item === 'object' &&
      item.resolução &&
      Array.isArray(item.tags) &&
      typeof item.subject === 'string';

    if (isResolucao) {
      try {
        await collection.insertOne(item);
        results.push({ subject: item.subject, action: 'resolução inserida' });
      } catch (err) {
        results.push({ subject: item.subject, action: 'erro', error: err.message });
      }
      continue;
    }

    // Mantém a lógica original para agrupamento de tickets
    if (!item.group || !Array.isArray(item.tickets)) {
      results.push({
        group: item.group || 'undefined',
        action: 'skipped',
        reason: 'Formato inválido: "group" deve ser string e "tickets" deve ser array'
      });
      continue;
    }

    const normalizedGroupName = item.group.toLowerCase();
    const existing = await collection.findOne({ group: normalizedGroupName });

    if (existing) {
      await collection.updateOne(
        { group: normalizedGroupName },
        {
          $addToSet: {
            tickets: { $each: item.tickets }
          }
        }
      );
      results.push({ group: normalizedGroupName, action: 'updated' });
    } else {
      await collection.insertOne({
        group: normalizedGroupName,
        tickets: item.tickets
      });
      results.push({ group: normalizedGroupName, action: 'created' });
    }
  }

  await client.close();
  return results;
}