// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadImageToCloudinary = (buffer) => {
//     console.log('uploadImageToCloudinary called');
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder: 'loan_app_images' },
//             (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result.secure_url);
//             }
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//     });
// };



// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Change this to default export
export default async function cloudinaryUpload(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'loan-app' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}