const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('❌ MONGODB_URI não está definida em .env.local');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function dataMongoDB({ dbName, collectionName, keys, limit = 100, skip = 0 }) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const projection = keys.reduce((acc, key) => {
    acc[key] = 1;
    return acc;
  }, { _id: 0 });

  const data = await collection.find({}, { projection }).skip(skip).limit(limit).toArray();

  return data;
}


module.exports = { dataMongoDB };
