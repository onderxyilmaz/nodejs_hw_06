const cloudinary = require('cloudinary').v2;
const createHttpError = require('http-errors');

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  async uploadImage(file, folder = 'contacts') {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto'
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw createHttpError(500, 'Failed to upload image');
    }
  }

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw createHttpError(500, 'Failed to delete image');
    }
  }
}

module.exports = new CloudinaryService(); 