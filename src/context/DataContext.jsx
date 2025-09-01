import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const DataContext = createContext()

// Base API URL - your deployed Django API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fahadali.pythonanywhere.com/api'

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([])
    const [categoryOnlyData, setCategoryOnlyData] = useState([])
    const [brandOnlyData, setBrandOnlyData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Get unique categories from data
    const getUniqueCategory = (data, property) => {
        if (!data || !Array.isArray(data)) return []
        let newVal = data.map((curElem) => curElem[property])
        newVal = [...new Set(newVal)]
        return newVal.filter(item => item) // Remove any null/undefined values
    }

    // Get unique brands from data
    const getUniqueBrands = (data) => {
        if (!data || !Array.isArray(data)) return ['All']
        const brands = data.map(item => item.brand).filter(brand => brand)
        return ['All', ...new Set(brands)]
    }

    // Fetch all products
    const fetchAllProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_BASE_URL}/products/`)
            const products = response.data.products || response.data
            
            setData(products)
            setCategoryOnlyData(['All', ...getUniqueCategory(products, 'category')])
            setBrandOnlyData(getUniqueBrands(products))
            
            console.log('Products fetched successfully:', products.length)
        } catch (error) {
            console.error('Error fetching products:', error)
            setError('Failed to fetch products. Please try again.')
            
            // Set empty arrays as fallback
            setData([])
            setCategoryOnlyData(['All'])
            setBrandOnlyData(['All'])
        } finally {
            setLoading(false)
        }
    }

    // Fetch products by category
    const fetchProductsByCategory = async (category) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_BASE_URL}/products/category/?type=${category}`)
            const products = response.data.products || response.data
            return products
        } catch (error) {
            console.error('Error fetching products by category:', error)
            setError('Failed to fetch category products. Please try again.')
            return []
        } finally {
            setLoading(false)
        }
    }

    // Fetch single product
    const fetchSingleProduct = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${id}/`)
            const product = response.data.product || response.data
            return product
        } catch (error) {
            console.error('Error fetching single product:', error)
            setError('Failed to fetch product details. Please try again.')
            return null
        } finally {
            setLoading(false)
        }
    }

    // Search products
    const searchProducts = async (query) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${API_BASE_URL}/products/search/?q=${encodeURIComponent(query)}`)
            const products = response.data.products || response.data
            return products
        } catch (error) {
            console.error('Error searching products:', error)
            setError('Search failed. Please try again.')
            return []
        } finally {
            setLoading(false)
        }
    }

    const value = {
        data,
        categoryOnlyData,
        brandOnlyData,
        loading,
        error,
        fetchAllProducts,
        fetchProductsByCategory,
        fetchSingleProduct,
        searchProducts,
        API_BASE_URL
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export const getData = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('getData must be used within a DataProvider')
    }
    return context
}

export { DataContext }