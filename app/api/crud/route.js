import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const client = new MongoClient(uri);
const dbName = 'dify';
const collectionName = 'groupedSub';

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = body;

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

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('CRUD error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
