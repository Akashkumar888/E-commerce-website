
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
//  _id by default store by mongoDB
name:{type:String,required:[true,'Provide name']},
email:{type:String,required:[true,'Provide email'],unique:true},
password:{
  type:String,
  required:[true,'Provide password'],
  minlength:8,
  select:false// For sensitive data, always set select: false for password and other sensitive fields, which you are already doing.
},
avatar:{type:String,default:""},
mobile:{type:Number,default:null},
refresh_token:{type:String,default:""},
verify_email:{type:Boolean,default:false},
last_login_date:{type:Date,default:null},
// refresh_token_expiry: { type: Date, default: null },  // ✅ added standard practice
status:{type:String,enum:["Active","Inactive","Suspended"],default:'Active'},
address_details:[
  {
    type:mongoose.Schema.ObjectId,
    ref:"Address"
  }
],
shopping_cart:[
  {
    type:mongoose.Schema.ObjectId,
    ref:"CartProduct"
  }
],
orderHistory:[
  {
    type:mongoose.Schema.ObjectId,
    ref:"Order"
  }
],
forgot_password_otp:{
  type:String,
  default:null,
},
forgot_password_expiry:{
  type:Date,
  default:null,
},
role:{
  type:String,
  enum:["ADMIN","USER"],
  default:"USER"
},
},{timestamps:true});


// Hash password before saving
// Pre-save hook ensures you never store plain text passwords.
// Use pre('save') for password hashing + instance methods for comparison & token generation.
// Runs before saving the document (pre("save")).
// 🔹 Checks if the password field was modified (isModified("password")).
// 🔹 If yes → generates a salt → hashes the password using bcrypt.
// 🔹 Prevents rehashing when other fields (like email) are updated.


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ✅ Avoid re-hashing
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// // user hash password
// userSchema.statics.hashPassword=async function (password) {
  //   const salt=await bcrypt.genSalt(10);
  //   const hash=await bcrypt.hash(password,salt);
  //   return hash;
  // }
  
  // Compare password (instance method)
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Generate JWT token (instance method)
  userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      // expiresIn: "30d", // expiry is best practice
    });
  };
  

  const userModel=mongoose.models.User || mongoose.model("User",userSchema);
  export default userModel;