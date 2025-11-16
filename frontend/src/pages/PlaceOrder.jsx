import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/cartTotal'
import { assets } from '../assets/assets'
import ShopContext from '../context/ShopContext'
import { toast } from 'react-toastify'
import api from '../api/axios'

const PlaceOrder = () => {

   const [method,setMethod]=useState("cod");
   const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

   const {navigate,currencySymbol,token,getCartAmount,setCartItems,cartItems,delivery_fee,products}=useContext(ShopContext);

   // 🔹 Controlled Input handler
  const onChangeHandler=(event)=>{
   const name=event.target.name;
   const value=event.target.value;
   setFormData(data => ({...data,[name]:value}))
  }


  const onSubmitHandler=async(event)=>{
    event.preventDefault();
     try {
       let orderItems=[];
       for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo=structuredClone(products.find(product => product._id===item));
            if(itemInfo){
              itemInfo.size=item;
              itemInfo.quantity=cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
       }
       let orderData={
        address:formData,
        items:orderItems,
        amount:getCartAmount() + delivery_fee,
        currencySymbol
       };
       let url='/api/order'
       if(method==='cod'){
        const {data}=await api.post(`${url}/place`,orderData);
        if(data.success){
         setCartItems({});
         navigate("/orders");
        }
        else{
          toast.error(data.message);
        }
       }
       else if(method==='razorpay'){
         const {data}=await api.post(`${url}/razorpay`,orderData);
        if(data.success){
         setCartItems({});
         navigate("/orders");
        }
        else{
          toast.error(data.message);
        }
       }
       else if(method==='stripe'){
        const {data}=await api.post(`${url}/stripe`,orderData);
        if(data.success){
         setCartItems({});
         navigate("/orders");
        }
        else{
          toast.error(data.message);
        }
       }
     } catch (error) {
       console.log(error);
       toast.error(error.message);
     }
  }


  

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side  */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className="text-xl sm:text-2xl my-3">
         <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
      <div className='flex gap-3'>
       <input name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' required/>
       <input name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' required/>
      </div>
      <input name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' required/>
      <input name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' required/>
      <div className='flex gap-3'>
       <input name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' required/>
       <input name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' required/>
      </div>
      <div className='flex gap-3'>
       <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' required/>
       <input name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' required/>
      </div>
       <input name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' required/>
      </div>
      {/* Right side  */}
      <div className="mt-8">
       <div className="mt-8 min-w-80">
         <CartTotal/>
       </div>
       <div className="mt-12">
       <Title text1={'PAYMENT'} text2={'METHOD'}/>
       {/* Payment Method  */}
      <div className="flex gap-3 flex-col lg:flex-row">

        {/* Stripe */}
        <div onClick={()=>setMethod('stripe')} className="flex items-center gap-3 border p-3 px-4 cursor-pointer">
          <p className={`w-4 h-4 border rounded-full ${method === 'stripe'?'bg-green-400' :""}`}></p>
          <img src={assets.stripe_logo} alt="" className="h-5" />
        </div>

        {/* Razorpay */}
        <div onClick={()=>setMethod('razorpay')} className="flex items-center gap-3 border p-3 px-4 cursor-pointer">
          <p className={`w-4 h-4 border rounded-full ${method === 'razorpay'?'bg-green-400' :""}`}></p>
          <img src={assets.razorpay_logo} alt="" className="h-5" />
        </div>

        <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 border p-3 px-4 cursor-pointer">
          <p className={`w-4 h-4 border rounded-full ${method === 'cod'?'bg-green-400' :""}`}></p>
          <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
        </div>
      </div>
      <div className="w-full text-end mt-8">
      <button type='submit' className='bg-black text-white px-16 py-3 text-sm cursor-pointer'>
      PLACE ORDER
      </button>
      </div>
      
       </div>
      </div>
    </form>
  )
}

export default PlaceOrder
