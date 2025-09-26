import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'groupedSub';

export async function crud(input) {
  // Se for um único objeto, transforma em array
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

    const existing = await collection.findOne({ group: group.group });

    if (existing) {
      await collection.updateOne(
        { group: group.group },
        {
          $addToSet: {
            tickets: { $each: group.tickets }
          }
        }
      );
      results.push({ group: group.group, action: 'updated' });
    } else {
      await collection.insertOne(group);
      results.push({ group: group.group, action: 'created' });
    }
  }

  await client.close();
  return results;
}
