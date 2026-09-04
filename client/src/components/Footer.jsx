import React from 'react'
import { assets } from '../assets/assets'

const Footer = ()=> {
  return (
    <div className=' container px-4 2xl:px-20 mx-auto py-8 flex flex-col md:flex-row justify-between items-center gap-4'>
      <img width ={160} src={assets.newlogo} alt="" />
      <p className='flex-1 border-1 border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @Roman.dev | All Right Reserved</p>
      <div className='flex gap-4' >
        <img width={38} src={assets.facebook_icon} alt="Facebook" />
        <img width={38} src={assets.twitter_icon} alt="Twitter" />
        <img width={38} src={assets.instagram_icon} alt="Instagram" />
      </div>
    </div>
  )
}

export default Footer
