import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import api from '../api/axios';

const Add = () => {

  const [image1,setImage1]=useState(false);
  const [image2,setImage2]=useState(false);
  const [image3,setImage3]=useState(false);
  const [image4,setImage4]=useState(false);

  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [price,setPrice]=useState("");
  const [category,setCategory]=useState("Men");
  const [subCategory,setSubCategory]=useState("Topwear");
  const [bestseller,setBestseller]=useState(false);
  const [sizes, setSizes] = useState([]);


  const toggleSize = (size) => {
  setSizes((prev) => {
    // If size already selected → remove it
    if (prev.includes(size)) {
      return prev.filter((item) => item !== size);
    }

    // Otherwise → add it
    return [...prev, size];
  });
};


const onSubmitHandler=async(e)=>{
 e.preventDefault();
 try {
  const formData=new FormData();

  formData.append("name",name);
  formData.append("description",description);
  formData.append("price",price);
  formData.append("category",category);
  formData.append("subCategory",subCategory);
  formData.append("bestseller",bestseller);
  formData.append("sizes",JSON.stringify(sizes));

  image1 && formData.append("image1",image1);
  image2 && formData.append("image2",image2);
  image3 && formData.append("image3",image3);
  image4 && formData.append("image4",image4);

  const {data}=await api.post(`/api/product/add`,formData);
  // console.log(data);
  if(data.success){
    toast.success(data.message);
    setName("");
    setDescription("");
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setPrice("");
  }
  else{
    toast.error(data.message);
  }

 } catch (error) {
  console.log(error);
  toast.error(error.message);
 }
}

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>

        <p className='mb-2'>Upload Image</p>

      <div className='flex gap-2'>
      <label htmlFor="image1">
        <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
        <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id='image1' hidden/>
      </label>

      <label htmlFor="image2">
        <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
        <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id='image2' hidden/>
      </label>

      <label htmlFor="image3">
        <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
        <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id='image3' hidden/>
      </label>

      <label htmlFor="image4">
        <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
        <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id='image4' hidden/>
      </label>
      </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input value={name}  onChange={(e)=>setName(e.target.value)} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
      </div>


      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">

        <div>
          <p className='mb-2'>Product category</p>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2' name="" id="">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2' name="" id="">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
          </select>
        </div>

      <div>
        <p className='mb-2'>Product Price</p>
        <input value={price} onChange={(e)=>setPrice(e.target.value)} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25'/>
      </div>

      </div>
      <div className="">
        <p className='mb-2'>Product Sizes</p>
        <div className="flex gap-3">

          <div onClick={() => toggleSize("S")}  className="cursor-pointer">
            <p className={`px-3 py-1 
          ${sizes.includes("S") ? "bg-black text-white" : "bg-slate-200"}`}>S</p>
          </div>

          <div onClick={() => toggleSize("M")} className="cursor-pointer">
            <p className={`px-3 py-1 
          ${sizes.includes("M") ? "bg-black text-white" : "bg-slate-200"}`}>M</p>
          </div>

          <div onClick={() => toggleSize("L")} className="cursor-pointer">
            <p className={`px-3 py-1 
          ${sizes.includes("L") ? "bg-black text-white" : "bg-slate-200"}`}>L</p>
          </div>

          <div onClick={() => toggleSize("XL")} className="cursor-pointer">
            <p className={`px-3 py-1 
          ${sizes.includes("XL") ? "bg-black text-white" : "bg-slate-200"}`}>XL</p>
          </div>

          <div onClick={() => toggleSize("XXL")} className="cursor-pointer">
            <p className={`px-3 py-1 
          ${sizes.includes("XXL") ? "bg-black text-white" : "bg-slate-200"}`}>XXL</p>
          </div>

        </div>
      </div>

    <div className="flex gap-2 mt-2">
      <input checked={bestseller} onChange={()=>setBestseller(prev=> !prev)} type="checkbox" id='bestseller'/>
      <label className='cursor-pointer' htmlFor="bestseller">
       Add to bestseller
      </label>
    </div>

  <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ADD</button>
    </form>
  )
}

export default Add
