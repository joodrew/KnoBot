import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'groupedSub';

export async function crud(data) {
  if (!Array.isArray(data)) {
    throw new Error('"data" deve ser um array');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const results = [];

  for (const group of data) {
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
