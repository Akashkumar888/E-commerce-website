import React, { useContext, useEffect, useState } from 'react'
import AdminContext from '../context/AdminContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

const List = () => {

  const {token,currencySymbol}=useContext(AdminContext);
  const [lists,setLists]=useState([]);

  const fetchList=async()=>{
     try {
      const {data}=await api.get(`/api/product/list`);
      if(data.success){
        // console.log(data.products);
        setLists([...data.products].reverse());
      }
      else{
        toast.error(data.error);
      }
     } catch (error) {
      console.log(error);
      toast.error(error.message);
     }
  }

  const removeProduct=async(id)=>{
   try {
    const {data}=await api.post(`/api/product/remove`,{id});
    if(data.success){
      toast.success(data.message);
      await fetchList();
    }
    else{
      toast.error(data.error);
    }
   } catch (error) {
    console.log(error);
    toast.error(error.message);
   }
  }

  useEffect(()=>{
   if(token){
    fetchList();
   }
  },[token])

  return (
    < >
      <p className="">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title  */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List  */}

        {
          lists.map((item,index)=>(
            <div key={index} className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
            <img className='w-12' src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currencySymbol}{item.price}</p>
            <p onClick={() => removeProduct(item._id)}  className='text-right md:text-center cursor-pointer'>X</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List
