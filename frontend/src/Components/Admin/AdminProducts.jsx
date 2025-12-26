import React, { useEffect, useState } from "react";
import "./AdminPincodes.css";
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
    const initialFormState = {
        name: "",
        category_id: "",
        weight: "",
        price: "",
        location: "",
        stock: 0,
        image_url: "",
        tag_ids: []
    };
    const [newItem, setNewItem] = useState(initialFormState);

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
            weight: prod.weight || "",
            price: prod.price,
            location: prod.location || "",
            stock: prod.stock || 0,
            image_url: prod.image_url || "",
            tag_ids: currentTagIds || []
        });

        // Scroll to top
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditId(null);
        setNewItem(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editMode
                ? `${window.ENV.BACKEND_API}/api/admin/products/${editId}`
                : `${window.ENV.BACKEND_API}/api/admin/products`;

            const method = editMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                handleCancel(); // Reset form
                fetchData();    // Refresh list
            } else {
                const err = await response.json();
                alert(err.message || "Failed to save product");
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

    return (
        <div className="admin-pincodes-container">
            <h2>{editMode ? "Edit Product" : "Manage Products"}</h2>

            <form className="add-item-form" onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "30px" }}>
                <select name="category_id" value={newItem.category_id} onChange={handleInputChange} required style={{ gridColumn: "span 2", padding: "10px" }}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <input type="text" name="name" placeholder="Product Name" value={newItem.name} onChange={handleInputChange} required style={{ padding: "10px" }} />
                <input type="text" name="weight" placeholder="Weight (e.g. 1kg)" value={newItem.weight} onChange={handleInputChange} style={{ padding: "10px" }} />

                <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleInputChange} required style={{ padding: "10px" }} />
                <input type="number" name="stock" placeholder="Stock Qty" value={newItem.stock} onChange={handleInputChange} style={{ padding: "10px" }} />

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
                                {prod.image_url && <img src={prod.image_url.startsWith("/uploads") ? `${window.ENV.BACKEND_API}${prod.image_url}` : prod.image_url} alt={prod.name} style={{ width: 40, height: 40, objectFit: 'cover' }} />}
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
