const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('./slugify');

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  var db = mongoose.connection.db;

  // 1. Update users: derive tenant from university
  var users = await db.collection('users').find({ university: { $ne: '' } }).toArray();
  var userBulk = [];
  var tenantMap = {};

  users.forEach(function(u) {
    var tenant = slugify(u.university || '');
    tenantMap[u._id.toString()] = tenant;
    if (u.tenant !== tenant) {
      userBulk.push({
        updateOne: {
          filter: { _id: u._id },
          update: { $set: { tenant: tenant } }
        }
      });
    }
  });

  if (userBulk.length) {
    var ur = await db.collection('users').bulkWrite(userBulk);
    console.log('Users updated:', ur.modifiedCount);
  } else {
    console.log('Users: no updates needed');
  }

  // Also get users without university for the map
  var allUsers = await db.collection('users').find({}, { projection: { _id: 1, tenant: 1 } }).toArray();
  allUsers.forEach(function(u) {
    tenantMap[u._id.toString()] = u.tenant || '';
  });

  // 2. Update resources: set tenant from owner
  var resources = await db.collection('resources').find({}).toArray();
  var resBulk = [];
  resources.forEach(function(r) {
    var ownerTenant = tenantMap[r.user.toString()] || '';
    if (r.tenant !== ownerTenant) {
      resBulk.push({
        updateOne: {
          filter: { _id: r._id },
          update: { $set: { tenant: ownerTenant } }
        }
      });
    }
  });

  if (resBulk.length) {
    var rr = await db.collection('resources').bulkWrite(resBulk);
    console.log('Resources updated:', rr.modifiedCount);
  } else {
    console.log('Resources: no updates needed');
  }

  // 3. Update channels: set tenant from creator
  var channels = await db.collection('channels').find({}).toArray();
  var chBulk = [];
  channels.forEach(function(c) {
    var creatorTenant = tenantMap[c.creator.toString()] || '';
    if (c.tenant !== creatorTenant) {
      chBulk.push({
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { tenant: creatorTenant } }
        }
      });
    }
  });

  if (chBulk.length) {
    var cr = await db.collection('channels').bulkWrite(chBulk);
    console.log('Channels updated:', cr.modifiedCount);
  } else {
    console.log('Channels: no updates needed');
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(function(e) {
  console.error('Migration failed:', e);
  process.exit(1);
});
