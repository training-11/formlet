import React, { useEffect, useState } from "react";
import "./AdminInventory.css";
import { useAuth } from "../../Context/AuthContext";

export default function AdminInventory() {
    const { currentUser } = useAuth();

    // Data
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // Selection
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Modals
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // Form inputs
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState("");
    const [newCategoryFile, setNewCategoryFile] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: "", weight: "", price: "", location: "", stock: 0, image_url: "", imageFile: null
    });


    // Editing State
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchEverything();
    }, []);

    const fetchEverything = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
                fetch(`${window.ENV.BACKEND_API}/api/admin/products`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
            ]);

            if (catRes.ok) {
                const cats = await catRes.json();
                setCategories(cats);
                // Auto-select first category if none selected
                if (!selectedCategory && cats.length > 0) setSelectedCategory(cats[0]);
            }
            if (prodRes.ok) setProducts(await prodRes.json());

        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    // Filter products for the view
    const displayedProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory.id)
        : [];

    // --- HANDLERS ---

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName) return;
        try {
            const formData = new FormData();
            formData.append("name", newCategoryName);
            if (newCategoryFile) {
                formData.append("image", newCategoryFile);
            } else {
                formData.append("image_url", newCategoryImage);
            }

            const res = await fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, {
                method: "POST",
                headers: { Authorization: `Bearer ${currentUser.token}` }, // No Content-Type for FormData
                body: formData
            });
            if (res.ok) {
                setShowCategoryModal(false);
                setNewCategoryName("");
                setNewCategoryImage("");
                setNewCategoryFile(null);
                fetchEverything();
            }
        } catch (err) { console.error(err); }
    };

    const handleCategoryFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCategoryFile(e.target.files[0]);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete Category? This deletes ALL its products!")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchEverything();
            if (selectedCategory && selectedCategory.id === id) setSelectedCategory(null);
        } catch (err) { console.error(err); }
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setNewProduct({ name: "", weight: "", price: "", location: "", stock: 0, image_url: "", imageFile: null });
        setShowProductModal(true);
    };

    const handleOpenEditModal = (prod) => {
        setEditingProduct(prod);

        setNewProduct({
            name: prod.name,
            weight: prod.weight,
            price: prod.price,
            location: prod.location,
            stock: prod.stock,
            image_url: prod.image_url,
            imageFile: null
        });
        setShowProductModal(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return alert("Select a category first!");

        try {
            const formData = new FormData();
            formData.append("category_id", selectedCategory.id);
            formData.append("name", newProduct.name);
            formData.append("weight", newProduct.weight);
            formData.append("price", newProduct.price);
            formData.append("location", newProduct.location || "");
            formData.append("stock", newProduct.stock);
            // formData.append("image_url", newProduct.image_url); // We can still send this if no new file
            // Actually, backend prioritizes file. If no file, it looks at body.image_url.

            if (newProduct.imageFile) {
                formData.append("image", newProduct.imageFile);
            } else {
                formData.append("image_url", newProduct.image_url);
            }

            let url = `${window.ENV.BACKEND_API}/api/admin/products`;
            let method = "POST";

            if (editingProduct) {
                url = `${window.ENV.BACKEND_API}/api/admin/products/${editingProduct.id}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                    // Content-Type must NOT be set when sending FormData, browser does it with boundary
                },
                body: formData
            });

            if (res.ok) {
                setShowProductModal(false);
                setEditingProduct(null);
                setNewProduct({ name: "", weight: "", price: "", location: "", stock: 0, image_url: "", imageFile: null });
                fetchEverything();
            } else {
                alert("Failed to save product");
            }
        } catch (err) { console.error(err); }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewProduct({ ...newProduct, imageFile: e.target.files[0] });
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Delete Product?")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchEverything();
        } catch (err) { console.error(err); }
    };

    // Helper for Image URLs
    const getImageUrl = (url) => {
        if (url && url.startsWith("/uploads")) {
            return `${window.ENV.BACKEND_API}${url}`;
        }
        return url;
    };

    return (
        <div className="inventory-container">
            {/* LEFT SIDEBAR: CATEGORIES */}
            <div className="inventory-sidebar">
                <div className="sidebar-header">
                    <h3>Categories</h3>
                    <button className="add-btn-small" onClick={() => setShowCategoryModal(true)}>+</button>
                </div>
                <div className="category-list">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className={`category-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span className="cat-name">{cat.name}</span>
                            <span className="cat-del" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}>×</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT: PRODUCTS */}
            <div className="inventory-main">
                {selectedCategory ? (
                    <>
                        <div className="main-header">
                            <h2>{selectedCategory.name} <span style={{ fontSize: '14px', color: '#777' }}>({displayedProducts.length} items)</span></h2>
                            <button className="primary-btn" onClick={handleOpenAddModal}>+ Add Product</button>
                        </div>

                        <div className="products-grid">
                            {displayedProducts.map(prod => (
                                <div className="inv-product-card" key={prod.id}>
                                    <img src={getImageUrl(prod.image_url) || "https://via.placeholder.com/150"} alt={prod.name} className="inv-prod-img" />
                                    <div className="inv-prod-details">
                                        <h4>{prod.name}</h4>
                                        <p>{prod.weight} • ₹{prod.price}</p>
                                        <p style={{ marginTop: '5px', color: '#666', fontSize: '13px' }}><span style={{ fontWeight: '500' }}>Location:</span> {prod.location}</p>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <button className="inv-edit-btn" onClick={() => handleOpenEditModal(prod)}>Edit</button>
                                        <button className="inv-del-btn" style={{ borderLeft: '1px solid #ffcccc' }} onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {displayedProducts.length === 0 && <p style={{ color: '#999' }}>No products in this category.</p>}
                        </div>
                    </>
                ) : (
                    <div className="empty-state">Select a category to manage products</div>
                )}
            </div>

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingProduct ? 'Edit Product' : `Add Product to ${selectedCategory.name}`}</h3>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>Name</label>
                                <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Weight</label>
                                    <input value={newProduct.weight} onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })} />
                                </div>
                            </div>

                            {/* IMAGE INPUT */}
                            <div className="form-group">
                                <label>Image</label>
                                {newProduct.image_url && !newProduct.imageFile && (
                                    <div style={{ marginBottom: 10 }}>
                                        <img src={getImageUrl(newProduct.image_url)} alt="Current" style={{ height: 50 }} />
                                        <p style={{ fontSize: 12, color: '#666' }}>Current Image</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input value={newProduct.location} onChange={e => setNewProduct({ ...newProduct, location: e.target.value })} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowProductModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">{editingProduct ? 'Update' : 'Save'} Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CATEGORY MODAL */}
            {showCategoryModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Category</h3>
                        <form onSubmit={handleAddCategory}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Category Image</label>
                                <input type="file" accept="image/*" onChange={handleCategoryFileChange} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Create Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
