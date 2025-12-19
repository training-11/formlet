import React, { useEffect, useState } from "react";
import "./AdminPincodes.css"; // Reusing the same CSS for consistency
import { useAuth } from "../../Context/AuthContext";

export default function AdminCategories() {
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Fetch Categories Error:", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ name, image_url: image })
            });

            if (response.ok) {
                setName("");
                setImage("");
                fetchCategories();
            } else {
                const err = await response.json();
                alert(err.message || "Failed to add");
            }
        } catch (error) {
            console.error("Add Category Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will delete all products in this category!")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchCategories();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <div className="admin-pincodes-container">
            <h2>Manage Categories</h2>

            <form className="add-pincode-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Image URL (Optional)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Category"}
                </button>
            </form>

            <table className="pincode-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td>
                                {cat.image_url && <img src={cat.image_url} alt={cat.name} style={{ width: 40, height: 40, objectFit: 'cover' }} />}
                            </td>
                            <td>{cat.name}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
