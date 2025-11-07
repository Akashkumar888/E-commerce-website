import 'dotenv/config'
import app from './app.js'
import http from 'http'
import connectDB from './configs/db.config.js';

const server=http.createServer(app);

const PORT=process.env.PORT || 8080;

// Database connection
connectDB().then(()=>{
  server.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
  });

})