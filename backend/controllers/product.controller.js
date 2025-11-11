import productModel from "../models/product.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.util.js";

// function for add product 
export const addProduct=async(request,response)=>{
  try {
    const {name,description,price,category,subCategory,sizes,bestSeller}=request.body;

    // ✅ Access uploaded files correctly
    const image1 = request.files.image1?.[0];
    const image2 = request.files.image2?.[0];
    const image3 = request.files.image3?.[0];
    const image4 = request.files.image4?.[0];
    // const files = req.files; // ✅ array of files

    // ✅ Upload images to Cloudinary
    // ✅ Filter available images
    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return response.status(400).json({ success: false, message: "No images found" });
    }


    // ✅ Upload each image separately
    const uploadedImages = [];

    for (const img of images) {
      const uploaded = await uploadImageCloudinary(img);
      uploadedImages.push(uploaded.secure_url);  // save URL
    }

    // ✅ Safe sizes parsing
    let parsedSizes = [];
    if (sizes) {
      try { parsedSizes = JSON.parse(sizes); }
      catch { parsedSizes = sizes.split(","); }
    }

    const productData={
      name,
      description,
      category,
      price:Number(price),
      subCategory,
      bestSeller:bestSeller==='true'? true:false,
      sizes:parsedSizes,
      image:uploadedImages,
      date:Date.now()
    };
    const product= await productModel.create(productData);
    
    return response.json({
      success: true,
      message: "Product Added",
      product
    });
    
    
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}


// function for list product 
export const listProducts=async(request,response)=>{
  try {
    const products=await productModel.find({});
    response.json({success:true,products});
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}


// function for removing product 
export const removeProduct=async(request,response)=>{
  try {
    const {id}=request.body;
    await productModel.findOneAndDelete(id);
    response.json({success:true,message:"Product Removed"});
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}


// function for removing product 
export const singleProduct=async(request,response)=>{
  try {
    const {productId}=request.body;
    const product=await productModel.findById(productId);
    response.json({success:true,product});
  } catch (error) {
    console.log(error);
    response.status(500).json({success:false,message:error.message || "Server error",error:true});
  }
}
 