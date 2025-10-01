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

  const projection = Array.isArray(keys) && keys.length > 0
  ? keys.reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, { _id: 0 })
  : undefined;

  

  // ✅ Filtro com suporte a array e conversão de tipos
  let query = {};
  if (filterField && filterValue !== undefined) {
    if (Array.isArray(filterValue)) {
      // Converte todos os valores para número, se possível
      const parsedArray = filterValue.map(val => {
        return !isNaN(val) ? Number(val) : val;
      });
      query = { [filterField]: { $in: parsedArray } };
    } else {
      const parsedValue = !isNaN(filterValue) ? Number(filterValue) : filterValue;
      query = { [filterField]: parsedValue };
    }
  }

  const data = await collection.find(query, { projection }).skip(skip).limit(limit).toArray();

  return data;
}

module.exports = { dataMongoDB };