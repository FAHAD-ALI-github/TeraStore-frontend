import { SignedIn, SignedOut, UserButton, useUser, useClerk } from '@clerk/clerk-react'
import { MapPin, Package, ChevronDown } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { CgClose } from 'react-icons/cg'
import { FaCaretDown } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi'
import ResponsiveMenu from './ResponsiveMenu'

const Navbar = ({location, getLocation, openDropdown, setOpenDropdown}) => {

    const {cartItem} = useCart()
    const [openNav, setOpenNav] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const profileMenuRef = useRef(null)
    const navigate = useNavigate()
    const { isSignedIn } = useUser()
    const { openSignIn } = useClerk()  
    const toggleDropdown = ()=>{
        setOpenDropdown(!openDropdown)
    }

    // Handle cart click
    const handleCartClick = () => {
        if (isSignedIn) {
            navigate("/cart")
        } else {
            openSignIn()
        }
    }

    // Handle sign-in button
    const handleSignInClick = () => {
        openSignIn()  
    }

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className='bg-white py-3 shadow-2xl px-4 md:px-0'>
            <div className='max-w-6xl mx-auto flex justify-between items-center'>
                {/* logo section */}
                <div className='flex gap-7 items-center'>
                    <Link to={'/'}><h1 className='font-bold text-3xl'><span className='text-red-500 font-serif'>Tera</span>store</h1></Link>
                    <div className='md:flex gap-1 cursor-pointer text-gray-700 items-center hidden'>
                        <MapPin className='text-red-500' />
                        <span className='font-semibold '>{location ? <div className='-space-y-2'>
                            <p>{location.county}</p>
                            <p>{location.state}</p>
                        </div> : "Add Address"}</span>
                        <FaCaretDown onClick={toggleDropdown}/>
                    </div>
                    {
                        openDropdown ? <div className='w-[250px] h-max shadow-2xl z-50 bg-white fixed top-16 left-60 border-2 p-5 border-gray-100 rounded-md'>
                         <h1 className='font-semibold mb-4 text-xl flex justify-between'>Change Location <span onClick={toggleDropdown}><CgClose/></span></h1>
                         <button onClick={getLocation} className='bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400'>Detect my location</button>
                        </div> : null
                    }
                </div>
                {/* menu section */}
                <nav className='flex gap-7 items-center'>
                    <ul className='md:flex gap-7 items-center text-xl font-semibold hidden'>
                        <NavLink to={'/'} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}><li>Home</li></NavLink>
                        <NavLink to={"/products"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}><li>Products</li></NavLink>
                        <NavLink to={"/about"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}><li>About</li></NavLink>
                        <NavLink to={"/contact"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}><li>Contact</li></NavLink>
                    </ul>
                    
                    <button onClick={handleCartClick} className='relative'>
                        <IoCartOutline className='h-7 w-7' />
                        <span className='bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white'>{cartItem.length}</span>
                    </button>

                    <div className='hidden md:block'>
                        <SignedOut>
                            <button 
                                onClick={handleSignInClick} 
                                className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
                            >
                                Sign In
                            </button>
                        </SignedOut>
                        <SignedIn>
                            <div className='relative' ref={profileMenuRef}>
                                <div className='flex items-center gap-2'>
                                    <UserButton 
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-12 h-12"
                                            }
                                        }}
                                    />
                                    <ChevronDown 
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className='w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-800'
                                    />
                                </div>
                                
                                {/* Custom dropdown menu */}
                                {showProfileMenu && (
                                    <div className='absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                                        <div className='py-2'>
                                            <button 
                                                onClick={() => {
                                                    navigate('/orders')
                                                    setShowProfileMenu(false)
                                                }}
                                                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                            >
                                                <Package size={16} className='mr-2' />
                                                My Orders
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SignedIn>
                    </div>
                    {
                        openNav ? <HiMenuAlt3 onClick={()=>setOpenNav(false)} className='h-7 w-7 md:hidden'/>:<HiMenuAlt1 
                        onClick={()=>setOpenNav(true)}
                        className='h-7 w-7 md:hidden'/>
                    }
                </nav>
            </div>
            <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav}/>
        </div>
    )
}

export default Navbar
