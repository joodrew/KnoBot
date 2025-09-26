const { MongoClient } = require('mongodb');

// MongoDB config
const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'groupedSub';

// Função principal para POST
async function handlePost(req) {
  const { NextResponse } = await import('next/server');

  try {
    const body = await req.json();
    const { data } = body;

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
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('CRUD error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Exporta como rota do Next.js
module.exports = {
  POST: handlePost
};
