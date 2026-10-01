require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);

async function test() {
  try {
    await client.db("admin").command({ ping: 1 });

    console.log("✅ MongoDB connection successful!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  } finally {
    await client.close();
  }
}

test();