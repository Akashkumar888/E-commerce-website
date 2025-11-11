
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import { generateAuthToken } from "../utils/generateToken.util.js";
import { generateAdminToken } from "../utils/generateAdminToken.util.js";


// register a user 
export const registerUser=async(request,response)=>{
  try {
    const errors=validationResult(request);
    if(!errors.isEmpty()){
      return response.status(400).json({success:false,message:errors.array().map((errs)=>errs.msg)})
    }
    const {name,email,password}=request.body;
    
    const userAlreadyExists=await userModel.findOne({email});
    if(userAlreadyExists){
      return response.status(401).json({success:false,message:'User Already Exists'});
    }
    const user=await userModel.create({
      name,
      email,
      password
    });
    // ✅ remove password from response
    const safeUser = user.toObject();
    delete safeUser.password;


    const token=await generateAuthToken(user._id);

    response.status(201).json({success:true,message:"User registered successfully",data:safeUser,token});
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}
       

// login a user
export const loginUser=async(request,response)=>{
  try {
    const errors=validationResult(request);
    if(!errors.isEmpty()){
      return response.status(400).json({success:false,message:errors.array().map((errs)=>errs.msg)})
    }
    const {email,password}=request.body;
    
    const user=await userModel.findOne({email}).select("+password");
    if(!user)return response.status(400).json({success:false,message:"User not found!"});
    
    const isMatch=await user.comparePassword(password);
    if(!isMatch)return  response.status(400).json({success:false,message:"Invalid credentials"});
    const token=await generateAuthToken(user._id);
    
    const safeUser = user.toObject();
    delete safeUser.password;

    return response.status(200).json({
      success: true,
      message: "Login successfully!",
      data: safeUser,
      token
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}


export const adminLogin=async(request,response)=>{
  try {
    const {email,password}=request.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return response.status(401).json({
        success: false,
        message: "Only ADMIN can perform this action",
      });
    }

    // ✅ Generate admin token
    const token = generateAdminToken(email);

    return response.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });

  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}                          