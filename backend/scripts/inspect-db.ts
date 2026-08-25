import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to DB:', mongoose.connection.name);

  const collections = await mongoose.connection.db!.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  for (const col of collections) {
    const data = await mongoose.connection.db!.collection(col.name).find({}).toArray();
    console.log(`\n=== Collection: ${col.name} (Count: ${data.length}) ===`);
    data.forEach((item, i) => {
      const summary: Record<string, any> = { _id: item._id };
      if (item.name) summary.name = item.name;
      if (item.title) summary.title = item.title;
      if (item.year) summary.year = item.year;
      if (item.stepNo !== undefined) summary.stepNo = item.stepNo;
      if (item.order !== undefined) summary.order = item.order;
      if (item.position) summary.position = item.position;
      if (item.category) summary.category = item.category;
      if (item.createdAt) summary.createdAt = item.createdAt;
      console.log(`  [${i}]`, JSON.stringify(summary));
    });
  }

  await mongoose.disconnect();
}

inspect().catch(console.error);
