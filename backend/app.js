import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet'
import userRouter from './routes/user.route.js';
const app=express();

// middleware 
app.use(cors({
  credentials:true,
  origin:process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("combined"));
// For development
// app.use(morgan("dev"));
// OR for production logs:
// app.use(morgan("combined"));

app.use(helmet({
  crossOriginResourcePolicy:false
}))



// test api 
app.get("/",(req,res)=>{
  res.send("Server is working.")
});

// follow rest api structure
app.use("/api/user",userRouter);

export default app;