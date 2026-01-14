import { v2 as cloudinary } from 'cloudinary';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = 'cloudcart/products'
} = process.env;

export const cloudinaryFolder = CLOUDINARY_FOLDER;

export function assertCloudinaryConfigured() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary env vars missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
    );
  }
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

export function uploadImageBuffer(buffer, options = {}) {
  assertCloudinaryConfigured();

  const uploadOptions = {
    folder: cloudinaryFolder,
    resource_type: 'image',
    ...options
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    stream.end(buffer);
  });
}

export async function deleteImageByPublicId(publicId) {
  assertCloudinaryConfigured();
  if (!publicId) return null;
  return await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

export default cloudinary;


