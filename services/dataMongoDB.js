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
  includeId = false,        // ✅ novo
  limit = 100,
  skip = 0,
  useDumpCluster = false,
  filterField,
  filterValue,
  regex = false,            // ✅ novo
  regexOptions = 'i',       // ✅ novo
  search = '',              // ✅ novo
  searchFields = [],        // ✅ novo
  escapeRegex = (s) => s,   // ✅ novo (fallback)
}) {
  const clusterKey = useDumpCluster ? 'dump' : 'main';
  const clientPromise = clientPromises[clusterKey];

  if (!clientPromise) {
    throw new Error(`❌ Cluster "${clusterKey}" não está disponível.`);
  }

  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // ✅ projeção com controle de _id
  let projection;
  if (Array.isArray(keys) && keys.length > 0) {
    projection = keys.reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {});
    if (includeId) projection._id = 1; else projection._id = 0;
  }

  // ✅ Query
  let query = {};

  // 1) Busca multi-campos com regex: /search/i em cada campo da lista
  if (search && Array.isArray(searchFields) && searchFields.length > 0) {
    const safe = escapeRegex(search);
    query = {
      $or: searchFields.map((f) => ({
        [f]: { $regex: safe, $options: regexOptions },
      })),
    };
  }
  // 2) Busca regex em um único campo
  else if (regex && filterField && typeof filterValue === 'string') {
    const safe = escapeRegex(filterValue);
    query = { [filterField]: { $regex: safe, $options: regexOptions } };
  }
  // 3) Igualdade / $in (seu comportamento atual)
  else if (filterField && filterValue !== undefined) {
    if (Array.isArray(filterValue)) {
      const parsedArray = filterValue.map(val => (!isNaN(val) ? Number(val) : val));
      query = { [filterField]: { $in: parsedArray } };
    } else {
      const parsedValue = !isNaN(filterValue) ? Number(filterValue) : filterValue;
      query = { [filterField]: parsedValue };
    }
  }

  const data = await collection
    .find(query, { projection })
    .skip(skip)
    .limit(limit)
    .toArray();

  return data;
}

module.exports = { dataMongoDB };