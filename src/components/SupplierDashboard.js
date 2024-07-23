import React, { useState, useEffect } from 'react';
import axios from '../axios';

const SupplierDashboard = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [viewingOrdersForProduct, setViewingOrdersForProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let response;
            if (editingProduct) {
                response = await axios.put(`/products/${editingProduct.id}`, {
                    name, description, price, quantity
                });
                setProducts(products.map(product =>
                    product.id === editingProduct.id ? response.data : product
                ));
            } else {
                response = await axios.post('/products', {
                    name, description, price, quantity
                });
                setProducts([...products, response.data]);
            }
            setName('');
            setDescription('');
            setPrice('');
            setQuantity('');
            setEditingProduct(null);
        } catch (err) {
            setError('Failed to save product.');
        }
    };

    const handleEditProduct = (product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
        setEditingProduct(product);
    };

    const handleDeleteProduct = async (id) => {
        setError('');
        try {
            await axios.delete(`/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            setError('Failed to delete product.');
        }
    };

    const handleViewOrders = async (id) => {
        setError('');
        try {
            const response = await axios.get(`/products/${id}/orders`);
            setOrders(response.data);
            setViewingOrdersForProduct(id);
        } catch (err) {
            setError('Failed to fetch orders.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Supplier Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
                <div>
                    <label className="block">Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full border p-2"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
            </form>
            <h3 className="text-xl font-bold mt-8">Your Products</h3>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {products.length > 0 ? (
                        products.map(product => (
                            <li key={product.id} className="border p-2">
                                <h4 className="font-bold">{product.name}</h4>
                                <p>{product.description}</p>
                                <p>${product.price}</p>
                                <p>Quantity: {product.quantity}</p>
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleViewOrders(product.id)}
                                    className="bg-green-500 text-white p-2 rounded ml-2"
                                >
                                    View Orders
                                </button>
                                {viewingOrdersForProduct === product.id && (
                                    <div className="mt-4">
                                        <h5 className="font-bold">Orders:</h5>
                                        <ul className="list-disc ml-6">
                                            {orders.length > 0 ? (
                                                orders.map(order => (
                                                    <li key={order.id}>
                                                        <p>User: {order.order.user.name}</p>
                                                        <p>Quantity: {order.quantity}</p>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No orders found for this product.</p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SupplierDashboard;
