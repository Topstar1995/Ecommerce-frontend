import React, { useState, useEffect } from 'react';
import axios from '../axios';

const CustomerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await axios.get('/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to fetch orders.');
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleAddToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity + 1 > product.quantity) {
                setError('Not enough stock available');
                return;
            }
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            if (product.quantity < 1) {
                setError('Not enough stock available');
                return;
            }
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleCheckout = async () => {
        setError('');
        try {
            await axios.post('/orders', {
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            });
            setCart([]);
            fetchOrders();
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <h3 className="text-xl font-bold mb-4">Products</h3>
            {loadingProducts ? (
                <p>Loading products...</p>
            ) : (
                <ul className="grid grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map(product => (
                            <li key={product.id} className="border p-2">
                                <h4 className="font-bold">{product.name}</h4>
                                <p>{product.description}</p>
                                <p>${product.price}</p>
                                <p>Quantity: {product.quantity}</p>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-blue-500 text-white p-2 rounded mt-2"
                                >
                                    Add to Cart
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </ul>
            )}
            <h3 className="text-xl font-bold mt-8">Cart</h3>
            <ul className="mt-4 space-y-2">
                {cart.map((item, index) => (
                    <li key={index} className="border p-2">
                        <h4 className="font-bold">{item.name}</h4>
                        <p>{item.description}</p>
                        <p>${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </li>
                ))}
            </ul>
            {cart.length > 0 && (
                <button
                    onClick={handleCheckout}
                    className="bg-green-500 text-white p-2 rounded mt-4"
                >
                    Checkout
                </button>
            )}
            <h3 className="text-xl font-bold mt-8">Order History</h3>
            {loadingOrders ? (
                <p>Loading orders...</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <li key={order.id} className="border p-2">
                                <h4 className="font-bold">Order #{order.id}</h4>
                                <p>Total: ${order.total}</p>
                                <ul>
                                    {order.order_items.map(item => (
                                        <li key={item.id}>
                                            {item.product.name} - Quantity: {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))
                    ) : (
                        <p>No orders available</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomerDashboard;
