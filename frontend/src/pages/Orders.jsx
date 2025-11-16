import React, { useContext } from 'react'
import ShopContext from '../context/ShopContext'
import Title from '../components/Title';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { token, currencySymbol, products } = useContext(ShopContext);  // ⬅ ADD products here


  const [orderData,setOrderData]=useState([]);

  const loadOrderData = async () => {
  if (!token) return;

  try {
    const { data } = await api.get("/api/order/user-orders");

    if (!data.success) return toast.error(data.message);

    let merged = [];

    data.orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p._id === item.productId);
        if (!product) return;

        merged.push({
          ...item,
          image: product.image,
          name: product.name,
          price: product.price,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          date: order.date
        });
      });
    });

    setOrderData(merged);

  } catch (err) {
    toast.error(err.message);
  }
};


  
  useEffect(()=>{
   if(token){
    loadOrderData();
   }
  },[token]);


  return (
    <div className='border-t pt-16'>
      
      <div className="text-2xl">
      <Title text1={'MY'} text2={'ORDERS'}/>
      </div>
      <div className="">
        {
          orderData.map((item,index)=>(
          <div key={index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-6 text-sm">
          <img src={item?.image[0]} alt="" className='w-16 sm:w-20'/>
          <div className="">
            <p className="sm:text-base font-medium">{item?.name}</p>
            <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
             <p>{currencySymbol}{item?.price}</p>
             <p>Quantity: {item?.quantity}</p>
             <p>Size: {item.size}</p> 
            </div>
            <p className="mt-2">Date: <span className='text-gray-400'>25, Jul, 2025 </span></p>
          </div>
          </div>
          <div className="md:w-1/2 flex justify-between">
            <div className="flex items-center gap-2">
            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
            <p className='text-sm ms:text-base'>Ready to ship</p>
            </div>
            <button className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer">Track Order</button>
          </div>
          </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
