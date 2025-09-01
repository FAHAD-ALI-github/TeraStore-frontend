import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getData } from '../context/DataContext'
import Loading from "../assets/Loading4.webm"
import Breadcrums from '../components/Breadcrums'
import { IoCartOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'

const SingleProduct = () => {
    const params = useParams()
    const [singleProduct, setSingleProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { addToCart } = useCart()
    const { fetchSingleProduct } = getData()

    const getSingleProduct = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const product = await fetchSingleProduct(params.id)
            if (product) {
                setSingleProduct(product)
            } else {
                setError('Product not found')
            }
        } catch (error) {
            console.error('Error fetching product:', error)
            setError('Failed to load product details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSingleProduct()
        window.scrollTo(0, 0)
    }, [params.id])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <video muted autoPlay loop>
                    <source src={Loading} type='video/webm' />
                </video>
            </div>
        )
    }

    if (error || !singleProduct) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                        {error || 'Product not found'}
                    </h2>
                    <button 
                        onClick={() => window.history.back()}
                        className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors'
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const price = Number(singleProduct?.price) || 0
    const discount = Number(singleProduct?.discount) || 0

    const originalPrice = discount > 0 && discount < 100 ? price / (1 - discount / 100) : price

    return (
        <div className='px-4 pb-4 md:px-0'>
            <Breadcrums title={singleProduct.title} />
            <div className='max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Product Image */}
                <div className='w-full'>
                    <img 
                        src={singleProduct.image} 
                        alt={singleProduct.title} 
                        className='rounded-2xl w-full object-cover'
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg' // Add a placeholder image
                        }}
                    />
                </div>
                
                {/* Product Details */}
                <div className='flex flex-col gap-6'>
                    <h1 className='md:text-3xl text-xl font-bold text-gray-800'>
                        {singleProduct.title}
                    </h1>
                    
                    <div className='text-gray-700'>
                        {singleProduct.brand?.toUpperCase()} / {singleProduct.category?.toUpperCase()} 
                        {singleProduct.model && ` / ${singleProduct.model}`}
                    </div>
                    
                    <p className='text-xl text-red-500 font-bold'>
                        ${price.toFixed(2)}
                        {discount > 0 && (
                            <span className='line-through text-gray-700 ml-2'>
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                        {discount > 0 && (
                            <span className='bg-red-500 text-white px-4 py-2 rounded-full ml-2'>
                                {discount}% discount
                            </span>
                        )}
                    </p>
                    
                    <p className='text-gray-600'>{singleProduct.description}</p>

                    {/* Quantity Selector */}
                    <div className='flex items-center gap-4'>
                        <label className='text-sm font-medium text-gray-700'>Quantity:</label>
                        <input 
                            type="number" 
                            min={1} 
                            max={10}
                            value={quantity} 
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className='w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500'
                        />
                    </div>

                    <div className='flex gap-4 mt-4'>
                        <button 
                            onClick={() => addToCart(singleProduct, quantity)} 
                            className='px-6 flex gap-2 items-center py-2 text-lg bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                        >
                            <IoCartOutline className='w-6 h-6'/>
                            Add to Cart
                        </button>
                    </div>

                    {/* Additional Product Info */}
                    {singleProduct.stock && (
                        <div className='text-sm text-green-600'>
                            ✓ In Stock ({singleProduct.stock} available)
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SingleProduct