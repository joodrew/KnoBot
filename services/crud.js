import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'groupedSubject';

export async function crud(input) {
  if (!uri) {
    throw new Error('MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  const data = Array.isArray(input) ? input : [input];
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
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

    // Normaliza o nome do grupo para minúsculas
    const normalizedGroupName = group.group.toLowerCase();

    const existing = await collection.findOne({ group: normalizedGroupName });

    if (existing) {
      await collection.updateOne(
        { group: normalizedGroupName },
        {
          $addToSet: {
            tickets: { $each: group.tickets }
          }
        }
      );
      results.push({ group: normalizedGroupName, action: 'updated' });
    } else {
      await collection.insertOne({
        group: normalizedGroupName,
        tickets: group.tickets
      });
      results.push({ group: normalizedGroupName, action: 'created' });
    }
  }

  await client.close();
  return results;
}
