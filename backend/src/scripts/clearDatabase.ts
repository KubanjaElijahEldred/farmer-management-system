import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'fmis';

async function clearDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // List of all collections to clear
    const collections = [
      'users',
      'farmers',
      'fields',
      'harvests',
      'payments',
      'reports'
    ];

    console.log('\n🗑️  Starting database cleanup...\n');

    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`✅ Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
      } catch (error) {
        console.log(`⚠️  Collection ${collectionName} does not exist or error occurred`);
      }
    }

    console.log('\n✨ Database cleanup completed!\n');

  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
clearDatabase();
