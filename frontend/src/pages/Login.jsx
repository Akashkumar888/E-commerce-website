import React, { useContext, useState } from 'react'
import api from '../api/axios';
import { toast } from 'react-toastify';
import ShopContext from '../context/ShopContext';

const Login = () => {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [currentState,setCurrentState]=useState("Sign Up");
  const {token,setToken,navigate}=useContext(ShopContext);

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const endpoint =
      currentState === "Sign Up" ? "register" : "login";

    const payload =
      currentState === "Sign Up"
        ? { name, email, password }
        : { email, password };

    const { data } = await api.post(`/api/user/${endpoint}`, payload);

    if (data.success) {
      toast.success(data.message);

      setToken(data.token);
      localStorage.setItem("token", data.token);  // 🔥 persist token
    } 
    else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
};


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
       <p className="prata-regular text-3xl">
        {currentState}
       </p>
       <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {
        currentState==="Sign Up" && 
        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className='w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"' placeholder='Name' required/>
      }
      

      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className='w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"' placeholder='Email' required/>
      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className='w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"' placeholder='Password' required/>

      {/* <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">
        Forgot your password?
        </p>
        {
          currentState==='Login'
          ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState("Login")} className='cursor-pointer'>Login here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState==='Login' ?"Sign In":"Sign Up"}</button> */}


      
      {/* Forgot password – left aligned under password */}
<p className="cursor-pointer text-sm text-gray-600 w-full text-left mt-1 hover:text-violet-600">
  Forgot your password?
</p>
{/* Submit Button */}
<button
  type="submit"
  className="w-full py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer font-medium mt-2"
>
  {currentState === "Sign Up" ? "Create Account" : "Login Now"}
</button>



{/* Terms Checkbox */}
<div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
  <input type="checkbox" />
  <p>Agree to the terms of use & privacy policy.</p>
</div>

{/* Bottom Login/Signup Switch */}
<div className="flex flex-col gap-2 mt-2">
  {currentState === "Sign Up" ? (
    <p className="text-sm text-gray-600">
      Already have an account?{" "}
      <span
        onClick={() => setCurrentState("Login")}
        className="font-medium text-violet-500 cursor-pointer hover:underline"
      >
        Login here
      </span>
    </p>
  ) : (
    <p className="text-sm text-gray-600">
      Create an account{" "}
      <span
        onClick={() => setCurrentState("Sign Up")}
        className="font-medium text-violet-500 cursor-pointer hover:underline"
      >
        Click here
      </span>
    </p>
  )}
</div>


    </form>
  )
}

export default Login
