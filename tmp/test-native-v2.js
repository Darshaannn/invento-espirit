const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://darshangadhave10_db_user:i3d5MhxIuCLf0aQr@cluster0.p0vt4ii.mongodb.net/dementia_ai?retryWrites=true&w=majority&appName=Cluster0";

async function testNative() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting with Native Driver (Hardcoded)...");
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
