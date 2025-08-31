import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, Banknote, ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { FaGooglePay } from 'react-icons/fa6'
import { SiPaypal } from 'react-icons/si'
import { MdMobileFriendly } from 'react-icons/md'

const Checkout = ({ location, getLocation }) => {
    const { cartItem, setCartItem } = useCart()
    const { user } = useUser()
    const navigate = useNavigate()
    
    const [selectedPayment, setSelectedPayment] = useState('card')
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)
    const [orderData, setOrderData] = useState(null)
    
    // Form states
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: user?.fullName || '',
        address: location?.county || '',
        state: location?.state || '',
        postcode: location?.postcode || '',
        country: location?.country || '',
        phone: ''
    })
    
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    })
    
    const [jazzCashInfo, setJazzCashInfo] = useState({
        mobileNumber: '',
        pin: ''
    })

    const totalPrice = cartItem.reduce((total, item) => total + (item.price * item.quantity), 0)
    const grandTotal = totalPrice + 5 // Adding handling charge

    const handleInputChange = (section, field, value) => {
        if (section === 'delivery') {
            setDeliveryInfo(prev => ({ ...prev, [field]: value }))
        } else if (section === 'card') {
            setCardInfo(prev => ({ ...prev, [field]: value }))
        } else if (section === 'jazzcash') {
            setJazzCashInfo(prev => ({ ...prev, [field]: value }))
        }
    }

    const validateCardNumber = (number) => {
        const cleaned = number.replace(/\s/g, '')
        return cleaned.length === 16 && /^\d+$/.test(cleaned)
    }

    const validateExpiryDate = (date) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
        return regex.test(date)
    }

    const validateCVV = (cvv) => {
        return /^\d{3,4}$/.test(cvv)
    }

    const processPayment = async (method) => {
        setIsProcessing(true)
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            // Simulate different payment methods
            switch (method) {
                case 'card':
                    if (!validateCardNumber(cardInfo.cardNumber)) {
                        throw new Error('Invalid card number')
                    }
                    if (!validateExpiryDate(cardInfo.expiryDate)) {
                        throw new Error('Invalid expiry date')
                    }
                    if (!validateCVV(cardInfo.cvv)) {
                        throw new Error('Invalid CVV')
                    }
                    break
                case 'jazzcash':
                    if (jazzCashInfo.mobileNumber.length !== 11) {
                        throw new Error('Invalid mobile number')
                    }
                    if (jazzCashInfo.pin.length !== 5) {
                        throw new Error('Invalid PIN')
                    }
                    break
                case 'googlepay':
                    // Google Pay validation would be handled by Google Pay SDK
                    break
                default:
                    break
            }
            
            // Create order data
            const order = {
                id: `ORD-${Date.now()}`,
                items: cartItem,
                total: grandTotal,
                paymentMethod: method,
                deliveryInfo: deliveryInfo,
                date: new Date().toISOString(),
                status: 'confirmed'
            }
            
            setOrderData(order)
            setPaymentComplete(true)
            setCartItem([]) // Clear cart
            
            // Save order to localStorage (in real app, this would be saved to backend)
            const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]')
            const updatedOrders = [order, ...existingOrders]
            localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders))
            
        } catch (error) {
            alert(`Payment failed: ${error.message}`)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '')
        const match = cleaned.match(/\d{1,4}/g)
        return match ? match.join(' ') : ''
    }

    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D/g, '')
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
        }
        return cleaned
    }

    if (paymentComplete) {
        return (
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
                        <p className="text-gray-600 mb-6">Thank you for your order. Your payment has been processed successfully.</p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800">Order Details</h3>
                            <p className="text-sm text-gray-600">Order ID: {orderData?.id}</p>
                            <p className="text-sm text-gray-600">Total: ${orderData?.total}</p>
                            <p className="text-sm text-gray-600">Items: {orderData?.items.length}</p>
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Continue Shopping
                            </button>
                            <button 
                                onClick={() => navigate('/orders')}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (cartItem.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some items to your cart to proceed with checkout</p>
                    <button 
                        onClick={() => navigate('/products')}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Secure Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Forms */}
                    <div className="space-y-6">
                        {/* Delivery Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <ShieldCheck className="mr-2 text-blue-500" />
                                Delivery Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={deliveryInfo.fullName}
                                    onChange={(e) => handleInputChange('delivery', 'fullName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={deliveryInfo.phone}
                                    onChange={(e) => handleInputChange('delivery', 'phone', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={deliveryInfo.address}
                                    onChange={(e) => handleInputChange('delivery', 'address', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent md:col-span-2"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={deliveryInfo.state}
                                    onChange={(e) => handleInputChange('delivery', 'state', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Postcode"
                                    value={deliveryInfo.postcode}
                                    onChange={(e) => handleInputChange('delivery', 'postcode', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={deliveryInfo.country}
                                    onChange={(e) => handleInputChange('delivery', 'country', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent md:col-span-2"
                                />
                            </div>
                            <button 
                                onClick={getLocation}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Auto-detect Location
                            </button>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Lock className="mr-2 text-green-500" />
                                Payment Methods
                            </h2>
                            
                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <button
                                    onClick={() => setSelectedPayment('card')}
                                    className={`p-4 border-2 rounded-lg transition-all ${
                                        selectedPayment === 'card' 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-medium">Card Payment</p>
                                </button>
                                
                                <button
                                    onClick={() => setSelectedPayment('googlepay')}
                                    className={`p-4 border-2 rounded-lg transition-all ${
                                        selectedPayment === 'googlepay' 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <FaGooglePay className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                    <p className="font-medium">Google Pay</p>
                                </button>
                                
                                <button
                                    onClick={() => setSelectedPayment('jazzcash')}
                                    className={`p-4 border-2 rounded-lg transition-all ${
                                        selectedPayment === 'jazzcash' 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <MdMobileFriendly className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="font-medium">JazzCash</p>
                                </button>
                            </div>

                            {/* Card Payment Form */}
                            {selectedPayment === 'card' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Card Holder Name"
                                        value={cardInfo.cardHolder}
                                        onChange={(e) => handleInputChange('card', 'cardHolder', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Card Number (1234 5678 9012 3456)"
                                        value={formatCardNumber(cardInfo.cardNumber)}
                                        onChange={(e) => handleInputChange('card', 'cardNumber', e.target.value.replace(/\s/g, ''))}
                                        maxLength={19}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={formatExpiryDate(cardInfo.expiryDate)}
                                            onChange={(e) => handleInputChange('card', 'expiryDate', e.target.value.replace(/\D/g, ''))}
                                            maxLength={5}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            value={cardInfo.cvv}
                                            onChange={(e) => handleInputChange('card', 'cvv', e.target.value.replace(/\D/g, ''))}
                                            maxLength={4}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Google Pay */}
                            {selectedPayment === 'googlepay' && (
                                <div className="text-center py-8">
                                    <FaGooglePay className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                                    <p className="text-gray-600 mb-4">You'll be redirected to Google Pay to complete your payment securely.</p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            Ensure you have Google Pay set up on your device for a seamless checkout experience.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* JazzCash Payment Form */}
                            {selectedPayment === 'jazzcash' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Mobile Number (03XXXXXXXXX)"
                                        value={jazzCashInfo.mobileNumber}
                                        onChange={(e) => handleInputChange('jazzcash', 'mobileNumber', e.target.value.replace(/\D/g, ''))}
                                        maxLength={11}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="password"
                                        placeholder="5-Digit PIN"
                                        value={jazzCashInfo.pin}
                                        onChange={(e) => handleInputChange('jazzcash', 'pin', e.target.value.replace(/\D/g, ''))}
                                        maxLength={5}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <p className="text-sm text-orange-800">
                                            Make sure you have sufficient balance in your JazzCash account before proceeding.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        
                        {/* Cart Items */}
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                            {cartItem.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Price Breakdown */}
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartItem.length} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Handling</span>
                                <span>$5.00</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {/* Checkout Button */}
                        <button
                            onClick={() => processPayment(selectedPayment)}
                            disabled={isProcessing}
                            className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                                isProcessing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-600 transform hover:scale-105'
                            }`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Processing Payment...
                                </div>
                            ) : (
                                `Pay $${grandTotal.toFixed(2)} with ${
                                    selectedPayment === 'card' ? 'Card' :
                                    selectedPayment === 'googlepay' ? 'Google Pay' :
                                    'JazzCash'
                                }`
                            )}
                        </button>
                        
                        {/* Security Notice */}
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center text-sm text-green-800">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Your payment information is encrypted and secure
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout