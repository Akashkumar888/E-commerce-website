
import { v2 as cloudinary } from 'cloudinary';

const uploadImageCloudinary = async (image) => {
  const buffer =image?.buffer ||  Buffer.from(await image.arrayBuffer());

  const uploadedImage = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'E-commerce' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);  // ✅ Correct: resolve the result
      }
    );
    stream.end(buffer);
  });

  return uploadedImage;   // ✅ Contains URL, public_id, etc.
};

export default uploadImageCloudinary;

