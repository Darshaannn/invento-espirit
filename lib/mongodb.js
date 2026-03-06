import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;


if (process.env.NODE_ENV === 'development') {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please add your Mongo URI to .env.local');
    }
    // In development mode, use a global variable so that the value
    // is preserved across module reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, check for URI but don't crash whole build if missing
    // Vercel/Production will show error at runtime if ENV is missing
    if (uri) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    } else {
        clientPromise = Promise.reject(new Error("MONGODB_URI is not defined in production environment variables."));
    }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
