import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function AdminUsers() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/users`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Users Error:", error);
        }
    };

    return (
        <div className="table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || "-"}</td>
                            <td>
                                <span style={{
                                    fontWeight: user.role === 'admin' ? 'bold' : 'normal',
                                    color: user.role === 'admin' ? '#f59e0b' : '#333'
                                }}>
                                    {user.role}
                                </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
