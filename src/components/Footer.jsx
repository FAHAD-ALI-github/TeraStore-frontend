import React from 'react'
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/*  info */}
        <div className='mb-6 md:mb-0'>
            <Link to='/'>
              {/* <img src={Logo} alt="" className='w-32'/> */}
              <h1 className='text-red-500 text-2xl font-bold'>Tera store</h1>
            </Link>
            <p className='mt-2 text-sm'>Powering Your World with the Best in Electronics.</p>
            <p className='mt-2 text-sm'>123 tech-St, Lahore, Pakistan</p>
            <p className='text-sm'>Email: support@terastore.com</p>
            <p className='text-sm'>Phone: +92 327 0688791</p>
        </div>

{/* customer service link */}
<div className='mb-6 md:mb-0'>
  <h3 className='text-xl font-semibold'>Customer Service</h3>
  <ul className='mt-2 text-sm space-y-2'>
    <li><Link to="/contact" className="hover:text-red-500">Contact Us</Link></li>
    <li><Link to="/contact" className="hover:text-red-500">Shipping & Returns</Link></li>
    <li><Link to="/contact" className="hover:text-red-500">FAQs</Link></li>
    <li><Link to="/contact" className="hover:text-red-500">Order Tracking</Link></li>
    <li><Link to="/contact" className="hover:text-red-500">Size Guide</Link></li>
  </ul>
</div>

{/* social media links */}
<div className='mb-6 md:mb-0'>
  <h3 className='text-xl font-semibold'>Follow Us</h3>
  <div className='flex space-x-4 mt-2 text-2xl'>
    <a href="https://www.linkedin.com/in/fahadali1078/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
      <FaLinkedin />
    </a>
    <a href="https://github.com/FAHAD-ALI-github" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
      <FaGithub />
    </a>
    <a href="https://www.instagram.com/fahad_ali1078/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
      <FaInstagram />
    </a>
    <a href="https://x.com/FahadAli_0x" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
      <FaTwitter />
    </a>
  </div>
</div>
        {/* newsletter subscription */}
        <div>
            <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
            <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
            <form action="" className='mt-4 flex'>
                <input 
                type="email" 
                placeholder='Your email address'
                className='w-full p-2 rounded-l-md  text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                />
                <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
            </form>
        </div>
      </div>
      {/* bottom section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Tera store</span>. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer