const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Darshan/Innvento/frontend/.env.local' });

const uri = process.env.MONGODB_URI;
console.log("Testing URI:", uri ? "URI Found" : "URI Missing");

async function testNative() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting with Native Driver...");
        await client.connect();
        console.log("Native Connection Successful!");
        const db = client.db('dementia_ai');
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    } catch (err) {
        console.error("Native Driver Connection Failed:", err.message);
    } finally {
        await client.close();
    }
}

testNative();
