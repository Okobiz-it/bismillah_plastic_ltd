import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const envPathBackend = path.resolve(process.cwd(), '.env');
const envPathScripts = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(envPathBackend)) {
  dotenv.config({ path: envPathBackend });
} else if (fs.existsSync(envPathScripts)) {
  dotenv.config({ path: envPathScripts });
} else {
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testCloudinary = async () => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'}`);
    console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'}`);

    // 1. Test API Ping
    const pingResult = await cloudinary.api.ping();
    console.log('Cloudinary Ping Result:', pingResult);

    // 2. Test Image Upload (1x1 pixel base64 image)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    console.log('Attempting test upload to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'maple_ag_global_test',
      publicId: `test_upload_${Date.now()}`,
    });

    console.log('Upload Successful!');
    console.log(`Public ID: ${uploadResult.public_id}`);
    console.log(`URL: ${uploadResult.secure_url}`);

    // 3. Clean up test image
    console.log('Cleaning up test image...');
    const destroyResult = await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('Cleanup Result:', destroyResult);

    console.log('\n✅ Cloudinary is working perfectly!');
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
  }
};

testCloudinary();
