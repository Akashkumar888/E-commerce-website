
// multer.middleware.js     ✅ Multer goes here
// ✅ Correct Multer Setup (middlewares/multer.middleware.js)
// Single-file upload (for profile, product image, etc.)

// ✅ 1. Memory Storage (Recommended for Cloudinary / S3 / Firebase)
// Use When:
// Uploading to Cloudinary
// Uploading to AWS S3
// Uploading to Firebase Storage
// You don’t want to store images on your own server
// Microservices / scalable environments
// ✅ Industry standard for MERN + Cloudinary
// ✅ Fast
// ✅ No local file handling
// ✅ Best for production
// ✅ Upload stored in RAM → req.file.buffer → Directly upload to Cloudinary
// ✅ No temporary files
// ✅ Best performance

// import multer from "multer";

// // Store files in memory (recommended when using Cloudinary)
// const storage = multer.memoryStorage();

// const upload = multer({storage,limits: {fileSize: 5 * 1024 * 1024, // 5MB limit
// },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/webp"
//     ) {
//       cb(null, true);
//     } 
//     else {
//       cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
//     }
//   },
// });

// export default upload;

import multer from "multer";

// Store files in memory (recommended when using Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({storage:storage});                 

export default upload;


// ✅ 2. Disk Storage (Used when files must be stored locally)
// Use When:
// You want to store images on your own server
// You are building a local file-based CMS
// You want to store PDF, DOC, videos locally
// You do not use Cloudinary / S3
// ⚠️ Not recommended for scalable production apps
// ⚠️ Storage will fill up
// ⚠️ Harder to manage cleanup

// import multer from "multer";
// import path from "path";

// // Configure disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // folder to store files
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
//     );
//   },
// });

// const uploadDisk = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/webp"
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
//     }
//   },
// });

// export default uploadDisk;