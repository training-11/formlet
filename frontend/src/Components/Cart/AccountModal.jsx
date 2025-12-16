import React, { useState } from "react";
import "./AccountModal.css";

export default function AccountModal({ onClose, onContinue }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'phoneNumber') {
            setIsPhoneVerified(false); // Reset verification if phone changes
            setOtpSent(false);
            setOtp("");
        }
    };

    // Password Strength Logic
    const getPasswordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
        return score; // 0 to 3
    };

    const strengthScore = getPasswordStrength(formData.password);
    const getStrengthColor = () => {
        if (strengthScore === 0) return "#e0e0e0";
        if (strengthScore === 1) return "red";
        if (strengthScore === 2) return "orange";
        return "green";
    };

    const handleSendOtp = async () => {
        if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }
        setLoadingOtp(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/user/send-register-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phoneNumber }),
            });
            const data = await response.json();
            if (response.ok) {
                setOtpSent(true);
                alert("OTP sent to " + formData.phoneNumber);
            } else {
                alert(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Error sending OTP.");
        } finally {
            setLoadingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }
        setLoadingOtp(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/user/verify-register-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phoneNumber, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setIsPhoneVerified(true);
                setOtpSent(false); // Hide OTP field
                alert("Phone number verified!");
            } else {
                alert(data.message || "Invalid OTP.");
            }
        } catch (error) {
            console.error("Verify Error:", error);
            alert("Error verifying OTP.");
        } finally {
            setLoadingOtp(false);
        }
    };

    // Make isPhoneVerified optional for now
    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.password.length >= 8; // && isPhoneVerified;

    return (
        <div className="account-modal-overlay">
            <div className="account-modal-container">
                <button className="account-close-btn" onClick={onClose}>×</button>

                <h2 className="account-title">Account</h2>
                <div className="account-underline"></div>

                <p className="account-helper">
                    You will need to create a Farmlet account to complete your order.
                </p>

                <div className="account-form-body">
                    <div className="account-field">
                        <label>First name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>

                    <div className="account-field">
                        <label>Last name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>

                    <div className="account-field">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="account-field">
                        <label>Password (at least 8 characters)</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 8 characters"
                            />
                            <span className="show-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                        {/* Visual password strength placeholder if needed */}
                        <div className="password-strength-label">Password strength:</div>
                        <div className="strength-bar-container">
                            <div className="strength-bar" style={{
                                width: strengthScore === 0 ? '0%' : strengthScore === 1 ? '33%' : strengthScore === 2 ? '66%' : '100%',
                                backgroundColor: getStrengthColor()
                            }}></div>
                        </div>
                    </div>

                    <div className="account-field">
                        <label>Phone number</label>
                        <div className="phone-verify-wrapper">
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={isPhoneVerified}
                                placeholder="Enter mobile number"
                            />
                            {/* {!isPhoneVerified && !otpSent && (
                                <button className="verify-btn" onClick={handleSendOtp} disabled={loadingOtp}>
                                    {loadingOtp ? "..." : "Verify"}
                                </button>
                            )} */}
                            {isPhoneVerified && <span className="verified-badge">✓ Verified</span>}
                        </div>

                        {otpSent && !isPhoneVerified && (
                            <div className="otp-input-area" style={{ marginTop: '10px' }}>
                                <input
                                    type="text"
                                    className="otp-input"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button className="verify-confirm-btn" onClick={handleVerifyOtp} disabled={loadingOtp}>
                                    Submit
                                </button>
                            </div>
                        )}

                        <p className="phone-helper">
                            We will only use your phone number to contact you if there is an issue with your delivery.
                        </p>
                    </div>

                    <button
                        className="continue-account-btn"
                        onClick={() => onContinue(formData)}
                        disabled={!isFormValid}
                    >
                        Continue
                    </button>

                    <button className="cancel-account-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>

                <div className="account-footer">
                    <p>
                        We will keep your personal data private and secure, respecting current data protection legislation. To fulfil your order, we share relevant data with our delivery team and payment provider.
                    </p>
                    <p>
                        You can update these preferences if you change your mind or wish to opt in or out of any communication in your account settings. Find out more in our <a href="#">privacy policy</a>.
                    </p>
                </div>

            </div>
        </div>
    );
}
