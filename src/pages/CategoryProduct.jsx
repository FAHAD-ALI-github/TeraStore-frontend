import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getData } from '../context/DataContext'
import Loading from "../assets/Loading4.webm"
import { ChevronLeft } from 'lucide-react'
import ProductListView from '../components/ProductListView'

const CategoryProduct = () => {
    const [searchData, setSearchData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const params = useParams()
    const category = params.category
    const navigate = useNavigate()
    const { fetchProductsByCategory } = getData()

    const getFilterData = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const products = await fetchProductsByCategory(category)
            setSearchData(products || [])
            
            if (!products || products.length === 0) {
                setError(`No products found in "${category}" category`)
            }
        } catch (error) {
            console.error('Error fetching category products:', error)
            setError('Failed to load category products. Please try again.')
            setSearchData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (category) {
            getFilterData()
        }
        window.scrollTo(0, 0)
    }, [category])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-[400px]'>
                <video muted autoPlay loop>
                    <source src={Loading} type='video/webm'/>
                </video>
            </div>
        )
    }

    if (error) {
        return (
            <div className='max-w-6xl mx-auto mt-10 mb-10 px-4'>
                <button 
                    onClick={() => navigate('/')} 
                    className='bg-gray-800 mb-5 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center'
                >
                    <ChevronLeft/> Back
                </button>
                <div className='text-center py-16'>
                    <h2 className='text-2xl font-semibold text-gray-600 mb-2'>{error}</h2>
                    <button 
                        onClick={() => navigate('/products')}
                        className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors'
                    >
                        Browse All Products
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto mt-10 mb-10 px-4'>
            <div className='flex items-center justify-between mb-5'>
                <button 
                    onClick={() => navigate('/')} 
                    className='bg-gray-800 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center hover:bg-gray-700 transition-colors'
                >
                    <ChevronLeft/> Back
                </button>
                <h1 className='text-2xl font-bold text-gray-800 capitalize'>
                    {category} Products ({searchData.length})
                </h1>
            </div>
            
            {searchData.length > 0 ? (
                <div className='space-y-4'>
                    {searchData.map((product, index) => (
                        <ProductListView key={product.id || index} product={product}/>
                    ))}
                </div>
            ) : (
                <div className='text-center py-16'>
                    <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                        No products found in this category
                    </h2>
                    <button 
                        onClick={() => navigate('/products')}
                        className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors'
                    >
                        Browse All Products
                    </button>
                </div>
            )}
        </div>
    )
}

export default CategoryProduct