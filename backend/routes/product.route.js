
import express from 'express'
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/product.controller.js';
const productRouter=express.Router();
import upload from '../middlewares/multer.middleware.js'
import { adminAuth } from '../middlewares/adminAuth.middleware.js';

productRouter.post("/add",adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addProduct);
productRouter.post("/remove",adminAuth, removeProduct);
productRouter.post("/single",singleProduct);
productRouter.get("/list",listProducts);

export default productRouter;