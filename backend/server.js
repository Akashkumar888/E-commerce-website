import 'dotenv/config'
import app from './app.js'
import http from 'http'
import connectDB from './configs/db.config.js';
import connectCloudinary from './configs/cloudinary.config.js';

const server=http.createServer(app);

const PORT=process.env.PORT || 4000;
connectCloudinary();

// Database connection
connectDB().then(()=>{
  server.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
  });

});
