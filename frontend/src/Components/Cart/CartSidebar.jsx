
import React, { useState } from "react";
import "./CartSidebar.css";
import { useAuth } from "../../Context/AuthContext";
import DeliveryModal from "./DeliveryModal";
import AccountModal from "./AccountModal";
import ContactPreferencesModal from "./ContactPreferencesModal";
import PaymentModal from "./PaymentModal";

import ChangePostcodeModal from "./ChangePostcodeModal";
import { useNavigate } from "react-router-dom";
import ThankYouModal from "./ThankYouModal";
import AddToCartModal from "./AddToCartModal";
import SignInModal from "../Home/SignInModal";
import { getProductImage } from "../../utils/urlHelper";

export default function CartSidebar({ isCheckoutPage = false }) {
    const navigate = useNavigate();
    const { cartItems, pincodeDetails, isAuthenticated, currentUser, updateCartItem, removeFromCart, clearCart, login } = useAuth();
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Success Modal
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // New Modals State
    const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    // Store checkout data temporarily
    const [deliveryData, setDeliveryData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null); // Store created order details

    if (!isAuthenticated) return null;


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const deliveryDay = pincodeDetails?.deliveryDay || "Unknown";
    const pincode = pincodeDetails?.pincode || "";
    const nextDelivery = pincodeDetails?.nextDelivery || "";
    const cutoffDay = pincodeDetails?.cutoffDay || "";
    const cutoffDate = pincodeDetails?.cutoffDate || "";

    const handleCheckoutClick = () => {
        const total = parseFloat(calculateTotal());
        const minOrderValue = pincodeDetails?.minOrderValue ? parseFloat(pincodeDetails.minOrderValue) : 0;

        if (cartItems.length === 0) {
            alert("Your basket is empty.");
            return;
        }

        if (minOrderValue > 0 && total < minOrderValue) {
            alert(`The minimum order value for your area (${pincodeDetails?.pincode}) is ₹${minOrderValue}. Please add more items.`);
            return;
        }

        setIsDeliveryModalOpen(true);
    };

    const handleDeliveryContinue = (data) => {
        setDeliveryData(data);
        setIsDeliveryModalOpen(false);

        if (isAuthenticated && currentUser) {
            // Pre-fill account data from current user
            const names = currentUser.name ? currentUser.name.split(' ') : ["", ""];
            const fName = names[0];
            const lName = names.slice(1).join(' ') || "";

            setAccountData({
                firstName: fName,
                lastName: lName,
                email: currentUser.email,
                password: "", // Not needed for existing user
                phoneNumber: "", // Phone might be missing in User object, maybe update backend to store it later
                marketing: false, // Default
                sms: false
            });
            // Skip Account Modal
            setIsContactModalOpen(true);
        } else {
            setIsAccountModalOpen(true);
        }
    };

    const handleAccountContinue = async (data) => {
        setAccountData(data);

        // If already authenticated, just proceed (e.g. they modified details manually?)
        // Usually if auth, we skip this modal, but if they opened it manually from top...
        if (isAuthenticated && currentUser) {
            setIsAccountModalOpen(false);
            setIsContactModalOpen(true);
            return;
        }

        const userData = {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
            address: deliveryData.address,
            phone: data.phoneNumber,
            pincode: pincode
        };

        try {
            // Attempt Signup
            const response = await fetch(`${window.ENV.BACKEND_API}/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const resData = await response.json();

            if (response.ok) {
                // Success
                login(resData.user); // Log them in immediately
                setIsAccountModalOpen(false);
                setIsContactModalOpen(true);
            } else {
                // Failure
                if (resData.message && resData.message.includes("exists")) {
                    // Try to auto-login if password matches
                    try {
                        const loginRes = await fetch(`${window.ENV.BACKEND_API}/api/user/login`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: data.email, password: data.password }),
                        });

                        if (loginRes.ok) {
                            const loginData = await loginRes.json();
                            login(loginData.user);
                            alert("Account already exists. We've logged you in!");
                            setIsAccountModalOpen(false);
                            setIsContactModalOpen(true);
                        } else {
                            alert("Account already exists with this email/phone, but the password provided was incorrect. Please use 'Sign In' instead.");
                        }
                    } catch (loginErr) {
                        alert("Account already exists. Please sign in.");
                    }
                } else {
                    alert(resData.message || "Failed to create account.");
                }
            }
        } catch (error) {
            console.error("Account/Signup Error:", error);
            alert("An error occurred while setting up your account.");
        }
    };

    const handleContactSave = async (preferences) => {
        setIsContactModalOpen(false);

        try {
            // User should be authenticated by now
            let userId;
            if (currentUser) {
                userId = currentUser.id || currentUser._id;
            } else {
                // Fallback if context update was slow (unlikely with React state batching but possible?)
                // We rely on handleAccountContinue ensuring login.
                alert("User session not found. Please try again.");
                return;
            }

            // Create Order
            const orderPayload = {
                userId,
                items: cartItems,
                totalAmount: calculateTotal(),
                deliveryAddress: deliveryData.address,
                deliveryNotes: deliveryData.notes,
                deliveryDate: `${deliveryDay} ${nextDelivery}`,
                pincode: pincode
            };

            const orderResponse = await fetch(`${window.ENV.BACKEND_API}/api/order/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            const orderRes = await orderResponse.json();

            if (orderResponse.ok) {
                // Store Razorpay Order ID
                setCurrentOrder({
                    id: orderRes.orderId,
                    amount: calculateTotal(),
                    razorpayOrderId: orderRes.razorpayOrderId
                });
                // Open Payment
                setIsPaymentModalOpen(true);
            } else {
                alert("Failed to create order. Please try again.");
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("An error occurred during checkout.");
        }
    };
    const handleRazorpayPayment = async () => {
        // Fetch Key from Backend
        let keyId = "";
        try {
            const res = await fetch(`${window.ENV.BACKEND_API}/api/order/razorpay-key`);
            const data = await res.json();
            keyId = data.key;
        } catch (error) {
            console.error("Failed to fetch Razorpay Key", error);
            alert("Payment configuration missing.");
            return;
        }

        // Razorpay Options
        const options = {
            key: keyId, // Use fetched key
            amount: currentOrder.amount * 100, // Amount in paise
            currency: "INR",
            name: "Farmlet",
            description: "Order #" + currentOrder.id,
            image: "https://your-logo-url.com/logo.png",
            order_id: currentOrder.razorpayOrderId, // Use Backend Order ID if available
            handler: function (response) {
                // Update Order Status to Paid
                fetch(`${window.ENV.BACKEND_API}/api/order/update-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: currentOrder.id,
                        status: 'paid',
                        paymentId: response.razorpay_payment_id
                    })
                });

                // alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                console.log(response);
                setIsPaymentModalOpen(false);
                clearCart();
                setIsSuccessModalOpen(true); // Open Success Modal
                // Ideally call backend to verify signature
            },
            prefill: {
                name: accountData ? `${accountData.firstName} ${accountData.lastName}` : currentUser?.name,
                email: accountData ? accountData.email : currentUser?.email,
                contact: accountData ? accountData.phoneNumber : ""
            },
            theme: {
                color: "#01BF64"
            }
        };

        // If razorpayOrderId is null (backend failed to reach Razorpay), we might fallback to mock or alert
        if (!currentOrder.razorpayOrderId) {
            console.warn("No Razorpay Order ID received. Falling back to test mode or manual.");
        }

        if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            // Fallback if SDK not loaded
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            };
            document.body.appendChild(script);
        }
    };

    return (
        <>
            <div className="cart-sidebar">            
                <div className="cart-header">
                    <h2 className="your-order-title">Your order</h2>
                    <div className="pincode-info">
                        <span className="pincode-display">{pincode}</span>
                        <span className="change-link" onClick={() => setIsPostcodeModalOpen(true)}>Change postcode</span>
                    </div>
                </div>

                <div className="info-box">
                    <span className="info-icon">i</span>
                    <p>
                        Complete payment by<br />
                        11:45pm on {cutoffDay} {cutoffDate} for<br />
                        delivery on {deliveryDay} {nextDelivery}
                    </p>
                </div>

                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart-msg">Your basket is empty.</p>
                    ) : cartItems.map((item, index) => (
                        <div className="cart-item" key={index}>
                            <img src={getProductImage(item)} alt={item.name} className="cart-item-img" />
                            <div className="cart-item-details">
                                <div className="cart-row-top">
                                    <span className="cart-item-name">{item.name}</span>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.name)}>×</button>
                                </div>

                                <div className="cart-row-bottom">
                                    <div className="qty-price">
                                        <span className="qty-label">Qty</span>
                                        <span className="qty-val">{item.quantity}</span>
                                    </div>
                                    <div className="item-price">{item.price}</div>
                                </div>
                                <button className="change-btn" onClick={() => {
                                    setEditingProduct(item);
                                    setIsEditModalOpen(true);
                                }}>Change</button>
                                {item.frequency !== "Once only" && item.startDate && (
                                    <div style={{ fontSize: '11px', color: '#558b2f', marginTop: '4px' }}>
                                        Start: {item.startDate}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>

                    {!isCheckoutPage && (
                        <button className="checkout-btn" onClick={handleCheckoutClick}>
                            Checkout
                        </button>
                    )}
                </div>

            </div >

            {isDeliveryModalOpen && (
                <DeliveryModal
                    pincode={pincode}
                    onClose={() => setIsDeliveryModalOpen(false)}
                    onContinue={handleDeliveryContinue}
                    initialAddress={isAuthenticated && currentUser?.address ? currentUser.address : ""}
                />
            )
            }

            {
                isAccountModalOpen && (
                    <AccountModal
                        onClose={() => setIsAccountModalOpen(false)}
                        onContinue={handleAccountContinue}
                    />
                )
            }

            {
                isContactModalOpen && (
                    <ContactPreferencesModal
                        onClose={() => setIsContactModalOpen(false)}
                        onSave={handleContactSave}
                    />
                )
            }

            {
                isPaymentModalOpen && (
                    <PaymentModal
                        totalAmount={calculateTotal()} // Initial subtotal (visual only if order updated)
                        currentOrder={currentOrder} // Pass full order object
                        items={cartItems}
                        onPay={handleRazorpayPayment}
                        onClose={() => setIsPaymentModalOpen(false)}
                        deliveryDate={`${deliveryDay} ${nextDelivery}`}
                        deliveryAddress={deliveryData?.address}
                        onOrderUpdate={(updated) => {
                            // Merge key updates: amount, razorpayOrderId
                            setCurrentOrder(prev => ({ ...prev, ...updated }));
                        }}
                    />
                )
            }

            {
                isSuccessModalOpen && (
                    <ThankYouModal
                        onClose={() => {
                            setIsSuccessModalOpen(false);
                            navigate('/'); // Redirect to Home
                        }}
                    />
                )
            }

            {
                isPostcodeModalOpen && (
                    <ChangePostcodeModal
                        onClose={() => setIsPostcodeModalOpen(false)}
                        onSignIn={() => {
                            setIsPostcodeModalOpen(false);
                            setIsSignInModalOpen(true);
                        }}
                    />
                )
            }

            {
                isSignInModalOpen && (
                    <SignInModal
                        open={isSignInModalOpen}
                        onClose={() => setIsSignInModalOpen(false)}
                    />
                )
            }

            {
                isEditModalOpen && editingProduct && (
                    <AddToCartModal
                        product={editingProduct}
                        onClose={() => setIsEditModalOpen(false)}
                        onConfirm={(prod, qty, freq, startDate) => {
                            updateCartItem(prod.name, qty, freq, startDate);
                            setIsEditModalOpen(false);
                        }}
                    />
                )
            }
        </>
    );
}
