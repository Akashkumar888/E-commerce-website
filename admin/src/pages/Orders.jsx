
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import AdminContext from '../context/AdminContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = () => {

  const {token,currencySymbol}=useContext(AdminContext);
  const [orders,setOrders]=useState([]);

  const fetchAllOrders=async()=>{
  if(!token)return null;
  try {
    const {data}=await api.get(`/api/order/list`);
    if(data.success){
      console.log(data.orders);
      setOrders(data.orders.reverse());
    }
    else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[token]);

  const statusHandler=async(event,orderId)=>{
   try {
    const {data}=await api.post(`/api/order/status`,{orderId,status:event.target.value});
    if(data.success){
      await fetchAllOrders();
    }
   } catch (error) {
    console.log(error);
    toast.error(error.message);
   }
  }


  return (
    <div>
      <h3>Order Page</h3>

      <div>
        {orders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div className="">
            <div>
              {order.items?.map((item, i) => (   // ✅ FIX 2 (safe)
                <p className='py-0.5' key={i}>{item.name} x {item.quantity} <span>{item.size}</span>{i !== order.items.length - 1 && ","}
                </p>
              ))}
            </div>
            <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
            <div className="">
              <p>{order.address.street +", "}</p>
              <p>{order.address.city +", " +order.address.state + ", " + order.address.country + ", "+ order.address.zipcode}</p>
            </div>
            <p>{order.address.phone}</p>
          </div>
           <div className="">
            <p className='text-sm sm:text-[15px]'>Item : {order.items.length}</p>
            <p className='mt-3'>Method : {order.paymentMethod}</p>
            <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
            <p>Date :{new Date(order.date).toLocaleDateString()}</p>
           </div>
           <p className='text-sm sm:text-[15px]'>{currencySymbol}{order.amount}</p>
           <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold cursor-pointer'>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipping">Shipping</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
           </select>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Orders
