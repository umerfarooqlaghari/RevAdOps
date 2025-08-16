import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary credentials are properly configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_actual_cloud_name_here' &&
  process.env.CLOUDINARY_API_KEY !== 'your_actual_api_key_here' &&
  process.env.CLOUDINARY_API_SECRET !== 'your_actual_api_secret_here';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.log('⚠️  Cloudinary not configured - using local file storage fallback');
}

export default cloudinary;
export { isCloudinaryConfigured };
