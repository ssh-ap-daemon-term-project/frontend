import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-gray-800 px-4 md:px-16 lg:px-28 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
                <h2 className='text-lg font-bold mb-4 text-white'>
                    About Us
                </h2>
                <p className='text-gray-300'>
                    We are a team of passionate developers and travelers who believe in the power of exploration and innovation.
                </p>
            </div>

            <div>
                <h2 className='text-lg font-bold mb-4 text-white'>
                    Quick Links
                </h2>
                <ul>
                    <li><a href='' className='hover:underline text-gray-300'>Home</a></li>
                    <li><a href='' className='hover:underline text-gray-300'>Contact Us</a></li>
                </ul>
            </div>

            <div>
                <h2 className='text-lg font-bold mb-4 text-white'>
                    Follow us
                </h2>
                <ul className='flex space-x-4'>
                    <li><a href='' ><FaFacebook className='text-blue-500'/></a></li>
                    <li><a href=''><FaTwitter className='text-blue-500'/></a></li>
                    <li><a href='' ><FaInstagram className='text-pink-500'/></a></li>
                </ul>
            </div>
        </div>
        <div className='border border-t border-gray-600 pt-2 text-gray-300 text-center mt-6' >
            <p>
                @2024 Trip Planner - All rights reserved by IIT KGP
            </p>
        </div>
    </footer>
  )
}

export default Footer