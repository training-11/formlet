import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Components/Home/SignInModal.css"; // Correct path

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/user/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();

            if (response.ok) {
                alert("Password reset successfully. Please login.");
                navigate("/");
            } else {
                alert(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset Error:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f9f9f9"
        }}>
            <div style={{
                background: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: "100%", maxWidth: "400px", textAlign: "center"
            }}>
                <h2 style={{ color: "#4b3e2f", marginBottom: "20px" }}>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%", padding: "12px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "4px"
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            width: "100%", padding: "12px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "4px"
                        }}
                        required
                    />
                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "12px", backgroundColor: "#01BF64", color: "white", border: "none",
                        borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "10px"
                    }}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
