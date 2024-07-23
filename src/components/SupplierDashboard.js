import React, { useState, useEffect } from 'react';
import axios from '../axios';

const SupplierDashboard = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetchProducts();
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/products', {
                name,
                description,
                price,
                quantity
            });
            setProducts([...products, response.data]);
            setName('');
            setDescription('');
            setPrice('');
            setQuantity('');
        } catch (err) {
            setError('Failed to add product.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Supplier Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAddProduct} className="space-y-4">
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
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
            </form>
            <h3 className="text-xl font-bold mt-8">Your Products</h3>
            {loadingProducts ? (
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
