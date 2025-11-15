import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
const app=express();

// middleware 
// ✅ Step 1: Add simple working CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,   
    process.env.ADMIN_URL       
  ],
  credentials: true, // allows cookies and Authorization headers
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



// test api 
app.get("/",(req,res)=>{
  res.send("Server is working.")
});                     

// follow rest api structure
app.use("/api/user",userRouter);
app.use("/api/product",productRouter);

export default app;