import React, { useEffect, useState } from "react";
import "./AdminInventory.css";
import "./AdminProducts.css"; // Reuse styling for variants
import { useAuth } from "../../Context/AuthContext";

export default function AdminInventory() {
    const { currentUser } = useAuth();

    // Data
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [tags, setTags] = useState([]); // Tags State

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
        name: "", location: "", image_url: "", imageFile: null, tag_ids: []
    });

    // Variants State
    const [variants, setVariants] = useState([{ id: Date.now(), weight: "", price: "", stock: "" }]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const weightOptions = ["250g", "500g", "1kg", "2kg", "5kg", "1 Unit", "1 Bunch", "1 Dozen", "6 pcs", "12 pcs"];


    // Editing State
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchEverything();
    }, []);

    const fetchEverything = async () => {
        try {
            const [catRes, prodRes, tagRes] = await Promise.all([
                fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
                fetch(`${window.ENV.BACKEND_API}/api/admin/products`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
                fetch(`${window.ENV.BACKEND_API}/api/admin/tags`, { headers: { Authorization: `Bearer ${currentUser.token}` } })
            ]);

            if (catRes.ok) {
                const cats = await catRes.json();
                setCategories(cats);
                // Auto-select first category if none selected
                if (!selectedCategory && cats.length > 0) setSelectedCategory(cats[0]);
            }
            if (prodRes.ok) setProducts(await prodRes.json());
            if (tagRes.ok) setTags(await tagRes.json());

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
        setNewProduct({ name: "", location: "", image_url: "", imageFile: null, tag_ids: [] });
        setVariants([{ id: Date.now(), weight: "", price: "", stock: "" }]);
        setShowProductModal(true);
    };

    const handleOpenEditModal = (prod) => {
        setEditingProduct(prod);

        // Parse existing tags
        let currentTagIds = [];
        if (prod.tag_ids) {
            currentTagIds = Array.isArray(prod.tag_ids) ? prod.tag_ids : JSON.parse(prod.tag_ids);
        }

        setNewProduct({
            name: prod.name,
            location: prod.location,
            image_url: prod.image_url,
            imageFile: null,
            tag_ids: currentTagIds || []
        });

        // Initialize variants with current product's details
        setVariants([{
            id: Date.now(),
            dbId: prod.id, // Important for updates
            weight: prod.weight || "",
            price: prod.price,
            stock: prod.stock
        }]);

        setShowProductModal(true);
    };

    // Variant Helpers
    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const addVariant = () => {
        setVariants([...variants, { id: Date.now(), weight: "", price: "", stock: "" }]);
    };

    const removeVariant = (index) => {
        if (variants.length === 1) return;
        setVariants(variants.filter((_, i) => i !== index));
    };

    const selectWeight = (index, value) => {
        handleVariantChange(index, 'weight', value);
        setActiveDropdown(null);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return alert("Select a category first!");

        // Loop through variants and save each one
        let successCount = 0;

        for (const variant of variants) {
            // Skip empty variants if multiple
            if (variants.length > 1 && !variant.weight && !variant.price) continue;

            try {
                const formData = new FormData();
                formData.append("category_id", selectedCategory.id);
                formData.append("name", newProduct.name);
                formData.append("location", newProduct.location || "");

                // Variant specific
                formData.append("weight", variant.weight);
                formData.append("price", variant.price);
                formData.append("stock", variant.stock || 0);

                if (newProduct.imageFile) {
                    formData.append("image", newProduct.imageFile);
                } else {
                    formData.append("image_url", newProduct.image_url);
                }

                if (newProduct.tag_ids && newProduct.tag_ids.length > 0) {
                    newProduct.tag_ids.forEach(tagId => formData.append("tag_ids", tagId));
                }

                // Determine URL and Method
                // If variant has dbId, it is an UPDATE to that specific ID.
                // If NOT, it is a create.
                let url = `${window.ENV.BACKEND_API}/api/admin/products`;
                let method = "POST";

                if (variant.dbId) {
                    url = `${window.ENV.BACKEND_API}/api/admin/products/${variant.dbId}`;
                    method = "PUT";
                }

                const res = await fetch(url, {
                    method: method,
                    headers: { Authorization: `Bearer ${currentUser.token}` },
                    body: formData
                });

                if (res.ok) {
                    successCount++;
                } else {
                    const err = await res.json();
                    console.error("Failed to save variant", variant, err);
                    alert(`Failed to save variant ${variant.weight}: ${err.message}`);
                }
            } catch (err) { console.error(err); }
        }

        if (successCount > 0) {
            setShowProductModal(false);
            setEditingProduct(null);
            setNewProduct({ name: "", location: "", image_url: "", imageFile: null });
            fetchEverything();
        }
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
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("https") || url.startsWith("data:")) {
            return url;
        }
        if (url.startsWith("/uploads") || url.startsWith("/api/uploads")) {
            return `${window.ENV.BACKEND_API}${url}`;
        }
        return url.startsWith("/") ? url : `/${url}`;
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
                            <div className="form-group">
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Variants (Weight, Price, Stock)</label>
                                {variants.map((variant, index) => (
                                    <div key={variant.id} className="variant-row">
                                        <div className="weight-wrapper">
                                            <input
                                                placeholder="Weight (e.g. 1kg)"
                                                value={variant.weight}
                                                onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Price (₹)"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                        />
                                        {variants.length > 1 && (
                                            <button type="button" className="remove-variant-btn" onClick={() => removeVariant(index)}>
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="add-variant-btn" onClick={addVariant}>
                                    + Add Another Variant
                                </button>
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
                                {newProduct.imageFile && (
                                    <p style={{ fontSize: 12, color: 'blue', marginTop: 5 }}>
                                        Selected File Size: {(newProduct.imageFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input value={newProduct.location} onChange={e => setNewProduct({ ...newProduct, location: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Tags (Hold Ctrl/Cmd to select multiple)</label>
                                <select
                                    multiple
                                    style={{ height: '80px', width: '100%', padding: '5px' }}
                                    value={newProduct.tag_ids}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                        setNewProduct({ ...newProduct, tag_ids: selected });
                                    }}
                                >
                                    {tags.map(tag => (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    ))}
                                </select>
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
