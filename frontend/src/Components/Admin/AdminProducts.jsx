import React, { useEffect, useState } from "react";
import "./AdminPincodes.css";
import "./AdminProducts.css";
import { useAuth } from "../../Context/AuthContext";

export default function AdminProducts() {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    // Edit Mode State
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    // Form State
    const initialFormState = {
        name: "",
        category_id: "",
        location: "",
        image_url: "",
        tag_ids: []
    };
    const [newItem, setNewItem] = useState(initialFormState);
    const [variants, setVariants] = useState([{ id: Date.now(), weight: "", price: "", stock: "" }]);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const weightOptions = ["250g", "500g", "1kg", "2kg", "5kg", "1 Unit", "1 Bunch", "1 Dozen", "6 pcs", "12 pcs"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, tagRes] = await Promise.all([
                fetch(`${window.ENV.BACKEND_API}/api/admin/products`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
                fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, { headers: { Authorization: `Bearer ${currentUser.token}` } }),
                fetch(`${window.ENV.BACKEND_API}/api/admin/tags`, { headers: { Authorization: `Bearer ${currentUser.token}` } })
            ]);

            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
            if (tagRes.ok) setTags(await tagRes.json());

        } catch (error) {
            console.error("Fetch Data Error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (e) => {
        const { options } = e.target;
        const selectedTags = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedTags.push(parseInt(options[i].value));
            }
        }
        setNewItem(prev => ({ ...prev, tag_ids: selectedTags }));
    };

    // Variant Handlers
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
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated);
    };

    const selectWeight = (index, value) => {
        handleVariantChange(index, 'weight', value);
        setActiveDropdown(null);
    };

    const handleEdit = (prod) => {
        setEditMode(true);
        setEditId(prod.id);

        // Parse tag_ids if they come as string/JSON from DB, or use raw if array
        let currentTagIds = [];
        if (prod.tag_ids) {
            // It might come as "[1, 2]" string or [1, 2] array
            currentTagIds = Array.isArray(prod.tag_ids) ? prod.tag_ids : JSON.parse(prod.tag_ids);
        }

        setNewItem({
            name: prod.name,
            category_id: prod.category_id,
            location: prod.location || "",
            image_url: prod.image_url || "",
            tag_ids: currentTagIds || []
        });

        setVariants([{
            id: Date.now(),
            dbId: prod.id, // Store original DB ID
            weight: prod.weight || "",
            price: prod.price,
            stock: prod.stock || 0
        }]);

        // Scroll to top
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditId(null);
        setNewItem(initialFormState);
        setVariants([{ id: Date.now(), weight: "", price: "", stock: "" }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let successCount = 0;

            for (const variant of variants) {
                // Skip completely empty variants if multiple exist
                if (variants.length > 1 && !variant.weight && !variant.price) continue;

                const payload = {
                    ...newItem,
                    weight: variant.weight,
                    price: variant.price,
                    stock: variant.stock || 0
                };

                // Decoupled Logic: If variant has a dbId, it's an UPDATE. If not, it's a CREATE.
                const isUpdate = !!variant.dbId;
                const url = isUpdate
                    ? `${window.ENV.BACKEND_API}/api/admin/products/${variant.dbId}`
                    : `${window.ENV.BACKEND_API}/api/admin/products`;

                const method = isUpdate ? "PUT" : "POST";

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    successCount++;
                } else {
                    const err = await response.json();
                    console.error("Failed to save variant:", variant, err);
                    alert(`Failed to save ${variant.weight}: ${err.message}`);
                }
            }

            if (successCount > 0) {
                handleCancel(); // Reset form
                fetchData();    // Refresh list
            }
        } catch (error) {
            console.error("Product Save Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

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
        <div className="admin-pincodes-container">
            <h2>{editMode ? "Edit Product" : "Manage Products"}</h2>

            <form className="add-item-form" onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "30px" }}>
                <select name="category_id" value={newItem.category_id} onChange={handleInputChange} required style={{ gridColumn: "span 2", padding: "10px" }}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <input type="text" name="name" placeholder="Product Name" value={newItem.name} onChange={handleInputChange} required style={{ padding: "10px" }} />
                <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Variants (Weight & Price)</label>
                    {variants.map((variant, index) => (
                        <div key={variant.id} className="variant-row">
                            <div className="weight-wrapper">
                                <input
                                    type="text"
                                    placeholder="Weight (e.g. 1kg)"
                                    value={variant.weight}
                                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "8px" }}
                                />
                            </div>
                            <input
                                type="number"
                                placeholder="Price"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                required
                                style={{ padding: "8px" }}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                style={{ padding: "8px" }}
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

                <input type="text" name="location" placeholder="Location" value={newItem.location} onChange={handleInputChange} style={{ padding: "10px" }} />
                <input type="text" name="image_url" placeholder="Image URL" value={newItem.image_url} onChange={handleInputChange} style={{ padding: "10px" }} />

                <div style={{ gridColumn: "span 2" }}>
                    <label>Select Tags (Hold Ctrl/Cmd to select multiple):</label>
                    <select multiple value={newItem.tag_ids} onChange={handleTagChange} style={{ width: "100%", height: "80px", padding: "5px" }}>
                        {tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                    </select>
                </div>

                <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: "10px", background: editMode ? "#007bff" : "black", color: "white", cursor: "pointer" }}>
                        {loading ? "Saving..." : (editMode ? "Update Product" : "Add Product")}
                    </button>
                    {editMode && (
                        <button type="button" onClick={handleCancel} style={{ flex: 0.3, padding: "10px", background: "#666", color: "white", cursor: "pointer" }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <table className="pincode-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id}>
                            <td>
                                {prod.image_url && <img src={getImageUrl(prod.image_url)} alt={prod.name} style={{ width: 40, height: 40, objectFit: 'cover' }} />}
                            </td>
                            <td>
                                {prod.name}
                                <br />
                                <small style={{ color: "#777" }}>{prod.weight}</small>
                            </td>
                            <td>{prod.category_name}</td>
                            <td>₹{prod.price}</td>
                            <td>
                                {(() => {
                                    let displayTags = [];
                                    if (prod.tags) {
                                        try {
                                            if (Array.isArray(prod.tags)) {
                                                displayTags = prod.tags;
                                            } else {
                                                displayTags = JSON.parse(prod.tags);
                                            }
                                        } catch (e) {
                                            displayTags = [prod.tags]; // Fallback
                                        }
                                    }
                                    return displayTags.map(t => (
                                        <span key={t} style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", marginRight: "4px" }}>
                                            {t}
                                        </span>
                                    ));
                                })()}
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(prod)} style={{ marginRight: "5px", padding: "5px 10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(prod.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
