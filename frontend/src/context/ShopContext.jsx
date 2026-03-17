import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

export const shopDataContext = createContext()

function ShopContext({ children }) {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItem, setCartItem] = useState({})
    const [loading, setLoading] = useState(false)
    
    // Contexts se data nikalna
    const { userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)
    
    const currency = '₹'
    const delivery_fee = 40

    // 1. Get Products from API
    const getProducts = async () => {
        if (!serverUrl) return; // Safety check
        try {
            const response = await axios.get(`${serverUrl}/api/product/list`)
            if (Array.isArray(response.data)) {
                setProducts(response.data)
            } else if (response.data.products) {
                setProducts(response.data.products)
            }
        } catch (error) {
            console.error("Fetch Products Error:", error)
            setProducts([])
        }
    }

    // 2. Add to Cart
    const addtoCart = async (itemId, size) => {
        if (!size) {
            toast.warning("Please select a size first!")
            return
        }

        let cartData = structuredClone(cartItem)

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        setCartItem(cartData)

        if (userData && serverUrl) {
            setLoading(true)
            try {
                await axios.post(`${serverUrl}/api/cart/add`, { itemId, size }, { withCredentials: true })
                toast.success("Added to Cart")
            } catch (error) {
                console.error("Add Cart Error:", error)
                toast.error("Cart sync failed")
            } finally {
                setLoading(false)
            }
        }
    }

    // 3. Get User Cart Data
    const getUserCart = async () => {
        // Agar user login nahi hai ya serverUrl nahi mila to request mat bhejo
        if (!userData || !serverUrl) return; 

        try {
            const response = await axios.post(`${serverUrl}/api/cart/get`, {}, { withCredentials: true })
            if (response.data) {
                setCartItem(response.data)
            }
        } catch (error) {
            console.error("Get Cart Error:", error)
        }
    }

    // 4. Update Quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem)
        cartData[itemId][size] = quantity
        setCartItem(cartData)

        if (userData && serverUrl) {
            try {
                await axios.post(`${serverUrl}/api/cart/update`, { itemId, size, quantity }, { withCredentials: true })
            } catch (error) {
                console.error("Update Quantity Error:", error)
            }
        }
    }

    // 5. Get Total Cart Count
    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    totalCount += cartItem[items][item]
                }
            }
        }
        return totalCount
    }

    // 6. Get Total Amount
    const getCartAmount = () => {
        let totalAmount = 0
        for (const items in cartItem) {
            let itemInfo = products.find((product) => product._id === items)
            if (itemInfo) {
                for (const item in cartItem[items]) {
                    if (cartItem[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItem[items][item]
                    }
                }
            }
        }
        return totalAmount
    }

    // --- USE EFFECTS (LIFECYCLE) ---

    // Load products only when serverUrl is ready
    useEffect(() => {
        if (serverUrl) {
            getProducts()
        }
    }, [serverUrl]) 

    // Refresh Cart only when user logs in and serverUrl is ready
    // Isse 'Maximum update depth' wali infinite loop solve ho jayegi
    useEffect(() => {
        if (userData && serverUrl) {
            getUserCart()
        } else if (!userData) {
            setCartItem({}) // Logout hone par cart khali
        }
    }, [userData, serverUrl]) 

    const value = {
        products, currency, delivery_fee, getProducts,
        search, setSearch, showSearch, setShowSearch,
        cartItem, addtoCart, getCartCount, setCartItem,
        updateQuantity, getCartAmount, loading
    }

    return (
        <shopDataContext.Provider value={value}>
            {children}
        </shopDataContext.Provider>
    )
}

export default ShopContext