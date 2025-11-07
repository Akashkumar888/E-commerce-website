
import express from 'express'
import { registerUserController } from '../controllers/user.controller.js';
const userRouter=express.Router();
import {body} from "express-validator"

userRouter.post(
  "/register",
  [
    // isEmpty() means name must be EMPTY 😅 (reverse logic)
    body("name").notEmpty().withMessage("Please enter your name"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  registerUserController
);


export default userRouter;