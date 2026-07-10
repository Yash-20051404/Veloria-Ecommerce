// Run this ONCE against your real database if the "duplicate slug/name"
// error still appears after updating the code:
//   cd backend
//   node fix-product-indexes.js
//
// It requires MONGODB_URI to be set (reads from your existing .env).

require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.collection('products');

  console.log('Current indexes on products collection:');
  const indexes = await collection.indexes();
  console.log(indexes);

  // Find any product documents that DON'T have a unique slug (e.g. old rows
  // with slug: null, left over from before slug generation existed).
  const nullSlugs = await collection.countDocuments({ slug: { $in: [null] } });
  console.log(`\nProducts with slug === null: ${nullSlugs}`);

  const dupes = await collection.aggregate([
    { $group: { _id: '$slug', count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();
  console.log(`Duplicate slug groups found: ${dupes.length}`);
  if (dupes.length) console.log(JSON.stringify(dupes, null, 2));

  // Drop and let Mongoose recreate the slug index correctly (sparse: true)
  // next time the server starts, in case an old non-sparse version is stuck.
  try {
    await collection.dropIndex('slug_1');
    console.log('\nDropped old slug_1 index. It will be recreated correctly the next time your server starts.');
  } catch (e) {
    console.log('\nNo slug_1 index to drop (or already fine):', e.message);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
