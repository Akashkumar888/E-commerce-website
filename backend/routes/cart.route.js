
import express from 'express'
import { addToCart, getUserCart, updateUserCart } from '../controllers/cart.controller.js';
import { authUser } from '../middlewares/authUser.middleware.js';

const cartRouter=express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.put("/update", authUser, updateUserCart);
cartRouter.get("/get", authUser, getUserCart);


export default cartRouter;