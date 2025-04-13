import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-gray-800 px-4 md:px-16 lg:px-28 py-8'>
  <div className='flex flex-col md:flex-row justify-between gap-8'>
    <div className='md:w-1/3'>
      <h2 className='text-lg font-bold mb-4 text-white'>About Us</h2>
      <p className='text-gray-300'>
        We are a team of passionate developers and travelers who believe in the power of exploration and innovation.
      </p>
    </div>

    <div className='md:w-1/3'>
      <h2 className='text-lg font-bold mb-4 text-white'>Quick Links</h2>
      <ul>
        <li><a href='' className='hover:underline text-gray-300'>Home</a></li>
        <li><a href='' className='hover:underline text-gray-300'>Contact Us</a></li>
      </ul>
    </div>

    <div className='md:w-1/3'>
      <h2 className='text-lg font-bold mb-4 text-white'>Follow us</h2>
      <ul className='flex space-x-4'>
        <li><a href=''><FaFacebook className='text-blue-500'/></a></li>
        <li><a href=''><FaTwitter className='text-blue-500'/></a></li>
        <li><a href=''><FaInstagram className='text-pink-500'/></a></li>
      </ul>
    </div>
  </div>
  <div className='border-t border-gray-600 pt-2 text-gray-300 text-center mt-6'>
    <p>@2024 Trip Planner - All rights reserved by IIT KGP</p>
  </div>
</footer>

  )
}

export default Footer