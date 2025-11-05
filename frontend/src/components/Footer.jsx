
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className=''>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      <div className="">
        <img src={assets.logo} alt="" className='mb-5 w-32'/>
        <p className='w-full md:w-2/3 text-gray-600'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur dicta rem amet repudiandae voluptatibus. Atque ut, laboriosam suscipit non enim magnam quisquam officiis beatae consequatur recusandae architecto earum nobis neque.
        </p>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
        <li>Home</li>
        <li>About us</li>
        <li>Delivery</li>
        <li>Privacy policy</li>
        </ul>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
         <li>+1-222-456-7890</li>
         <li>contact@foreveryou.com</li>
        </ul>
      </div>
      </div>
      <div className=''>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025&copy; forever.com - All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer