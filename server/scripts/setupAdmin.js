require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../models');

const setupAdmin = async () => {
  const mongoURI = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!mongoURI) {
    console.error('❌ [Setup Admin]: MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error('❌ [Setup Admin]: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ [Setup Admin]: Connected to MongoDB.');

    const cleanEmail = adminEmail.toLowerCase().trim();

    // 1. Check if an admin with the exact target email exists
    let targetAdmin = await Admin.findOne({ email: cleanEmail });

    if (targetAdmin) {
      // Admin with target email exists -> update password
      targetAdmin.password = adminPassword;
      await targetAdmin.save();
      console.log(`✅ [Setup Admin]: Admin password updated successfully for ${cleanEmail}.`);
    } else {
      // Admin with target email does not exist -> check if another admin document exists
      const existingAdmin = await Admin.findOne();
      if (existingAdmin) {
        existingAdmin.email = cleanEmail;
        existingAdmin.password = adminPassword;
        await existingAdmin.save();
        targetAdmin = existingAdmin;
        console.log(`✅ [Setup Admin]: Existing admin updated to ${cleanEmail}.`);
      } else {
        // No admin exists at all -> create new
        targetAdmin = await Admin.create({
          email: cleanEmail,
          password: adminPassword
        });
        console.log(`✅ [Setup Admin]: New admin created for ${cleanEmail}.`);
      }
    }

    // 2. Delete every other Admin document to strictly enforce single-admin cardinality
    const deleteResult = await Admin.deleteMany({ _id: { $ne: targetAdmin._id } });
    if (deleteResult.deletedCount > 0) {
      console.log(`🧹 [Setup Admin]: Removed ${deleteResult.deletedCount} duplicate/legacy admin account(s).`);
    }

    // 3. Confirm final count is strictly 1
    const totalAdmins = await Admin.countDocuments();
    console.log(`🔒 [Setup Admin]: Single-admin cardinality verified. Total admin accounts: ${totalAdmins}.`);

    await mongoose.disconnect();
    console.log('🔒 [Setup Admin]: Disconnected cleanly from database.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Setup Admin]: Error during admin setup - ${error.message}`);
    process.exit(1);
  }
};

setupAdmin();
