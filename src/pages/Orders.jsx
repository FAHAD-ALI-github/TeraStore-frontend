import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Package, Calendar, CreditCard, MapPin, ChevronLeft, Eye } from 'lucide-react'

const Orders = () => {
    const { user } = useUser()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        // Load orders from localStorage (in real app, this would be from backend)
        const storedOrders = localStorage.getItem(`orders_${user?.id}`)
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders))
        }
    }, [user])

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-gray-100 text-gray-800'
            default: return 'bg-yellow-100 text-yellow-800'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'card': return <CreditCard className="w-4 h-4" />
            case 'googlepay': return <span className="text-sm font-bold">G</span>
            case 'jazzcash': return <span className="text-sm font-bold">J</span>
            default: return <CreditCard className="w-4 h-4" />
        }
    }

    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'card': return 'Credit/Debit Card'
            case 'googlepay': return 'Google Pay'
            case 'jazzcash': return 'JazzCash'
            default: return 'Unknown'
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Please sign in</h2>
                    <p className="text-gray-500">You need to be logged in to view your orders</p>
                </div>
            </div>
        )
    }

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Orders
                    </button>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                                <p className="text-gray-600">Order ID: {selectedOrder.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Order Info */}
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>Ordered: {formatDate(selectedOrder.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                                    <span className="ml-2">{getPaymentMethodName(selectedOrder.paymentMethod)}</span>
                                </div>
                                <div className="flex items-start text-gray-700">
                                    <MapPin className="w-5 h-5 mr-2 mt-0.5" />
                                    <div>
                                        <p>{selectedOrder.deliveryInfo.fullName}</p>
                                        <p>{selectedOrder.deliveryInfo.address}</p>
                                        <p>{selectedOrder.deliveryInfo.state}, {selectedOrder.deliveryInfo.postcode}</p>
                                        <p>{selectedOrder.deliveryInfo.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold mb-3">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({selectedOrder.items.length} items)</span>
                                        <span>${(selectedOrder.total - 5).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Handling</span>
                                        <span>$5.00</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-base border-t pt-2">
                                        <span>Total</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h3 className="font-semibold mb-4">Items Ordered</h3>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-medium line-clamp-2">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">When you place your first order, it will appear here</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
                                        <p className="text-gray-600 text-sm">{formatDate(order.date)}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 mr-2" />
                                        <span>{order.items.length} item(s)</span>
                                    </div>
                                    <div className="flex items-center">
                                        {getPaymentMethodIcon(order.paymentMethod)}
                                        <span className="ml-2">{getPaymentMethodName(order.paymentMethod)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-800">Total: ${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                {/* Order Items Preview */}
                                <div className="mt-4 flex space-x-2 overflow-x-auto">
                                    {order.items.slice(0, 4).map((item, itemIndex) => (
                                        <img 
                                            key={itemIndex} 
                                            src={item.image} 
                                            alt={item.title} 
                                            className="w-12 h-12 rounded object-cover flex-shrink-0" 
                                        />
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-gray-600">+{order.items.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders