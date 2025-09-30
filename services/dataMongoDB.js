const { MongoClient } = require('mongodb');

const uriMain = process.env.MONGODB_URI;
const uriDump = process.env.MONGODBDUMP_URI;

const clients = {
  main: new MongoClient(uriMain),
  dump: new MongoClient(uriDump),
};

const clientPromises = {
  main: clients.main.connect(),
  dump: clients.dump.connect(),
};

async function dataMongoDB({
  dbName,
  collectionName,
  keys,
  limit = 100,
  skip = 0,
  useDumpCluster = false,
  filterField,
  filterValue,
}) {
  const clusterKey = useDumpCluster ? 'dump' : 'main';
  const clientPromise = clientPromises[clusterKey];

  if (!clientPromise) {
    throw new Error(`❌ Cluster "${clusterKey}" não está disponível.`);
  }

  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const projection = keys.reduce((acc, key) => {
    acc[key] = 1;
    return acc;
  }, { _id: 0 });

  // 🔍 Filtro genérico com conversão de tipo
  let query = {};

if (filterField && filterValue !== undefined) {
  if (Array.isArray(filterValue)) {
    query = { [filterField]: { $in: filterValue } };
  } else {
    const parsedValue = !isNaN(filterValue) ? Number(filterValue) : filterValue;
    query = { [filterField]: parsedValue };
  }}


  const data = await collection.find(query, { projection }).skip(skip).limit(limit).toArray();

  return data;
}

module.exports = { dataMongoDB };