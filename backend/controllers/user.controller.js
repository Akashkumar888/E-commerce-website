
import { sendEmail } from "../configs/sendEmail.config.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.js";

// register a user 
export const registerUserController=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success:false,message:errors.array().map((errs)=>errs.msg)})
    }
    const {name,email,password}=req.body;
    
    const userAlreadyExists=await userModel.findOne({email});
    if(userAlreadyExists){
      return res.status(401).json({success:false,message:'User Already Exists'});
    }
    const user=await userModel.create({
      name,
      email,
      password
    });

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${user._id}`;

    const sent = await sendEmail({
      sendTo: email,
      subject: "Verify your Blinkit Email",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl })
    });

    if (!sent) {
      return res.status(500).json({ success:false, message:"Failed to send verification email" });
    }

    res.status(201).json({success:true,message:"User registered successfully",data:user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}