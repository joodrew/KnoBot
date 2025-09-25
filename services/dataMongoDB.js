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

async function dataMongoDB({ dbName, collectionName, key }) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const projection = { [key]: 1, _id: 0 };
  const data = await collection.find({}, { projection }).toArray();

  return data;
}

module.exports = { dataMongoDB };
