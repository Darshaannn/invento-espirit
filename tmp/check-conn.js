const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://darshangadhave10_db_user:i3d5MhxIuCLf0aQr@cluster0.p0vt4ii.mongodb.net/dementia_ai?retryWrites=true&w=majority&appName=Cluster0";

async function checkConnection() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("SUCCESS!");
        const db = client.db('dementia_ai');
        const count = await db.collection('questions').countDocuments();
        console.log("Question count:", count);
    } catch (err) {
        console.error("FAILED:", err.message);
    } finally {
        await client.close();
    }
}

checkConnection();
