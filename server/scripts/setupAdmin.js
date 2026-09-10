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
    console.error('❌ [Setup Admin]: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ [Setup Admin]: Connected to MongoDB.');

    const cleanEmail = adminEmail.toLowerCase().trim();
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      existingAdmin.email = cleanEmail;
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log(`✅ [Setup Admin]: Admin account updated successfully for ${cleanEmail}.`);
    } else {
      await Admin.create({
        email: cleanEmail,
        password: adminPassword
      });
      console.log(`✅ [Setup Admin]: Admin account created successfully for ${cleanEmail}.`);
    }

    await mongoose.disconnect();
    console.log('🔒 [Setup Admin]: Disconnected cleanly from database.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Setup Admin]: Error during admin setup - ${error.message}`);
    process.exit(1);
  }
};

setupAdmin();
