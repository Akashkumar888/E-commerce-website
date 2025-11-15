import productModel from "../models/product.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.util.js";

// function for add product 
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Get uploaded images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    // Upload to Cloudinary
    const uploadedImages = [];
    for (const img of images) {
      const uploaded = await uploadImageCloudinary(img);
      uploadedImages.push(uploaded.secure_url); 
    }

    // Parse sizes array
    let parsedSizes = [];
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {
        parsedSizes = sizes.split(",");
      }
    }

    // Store final product data
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: uploadedImages,
      date: Date.now(),
    };

    const product = await productModel.create(productData);

    res.json({
      success: true,
      message: "Product Added Successfully",
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



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
 