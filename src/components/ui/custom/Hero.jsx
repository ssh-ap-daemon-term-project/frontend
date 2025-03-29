import React from 'react'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h1 className='font-extrabold text-[35px] text-center mt-8'>
            <span className='text-[#f10d48] '>Discover your next adventure with AI:</span><br></br>
             Personalized Itineraries at your fingertips
        </h1>
        <p className='text-xl text-gray-500 text-center'>
            Your personal trip planner and travel curator, unveiling the best destinations, activities, and experiences for your unique preferences.
        </p>
    </div>
  )
}

export default Hero