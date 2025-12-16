// import React, { useState } from "react";
// import "./SignInModal.css";
// import farmletLogo from "../../Images/Logo 1.png";

// export default function SignInModal({ open, onClose }) {
//   const [showPassword, setShowPassword] = useState(false);

//   if (!open) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-container" onClick={(e) => e.stopPropagation()}>

//         {/* Close Button */}
//         <button className="modal-close" onClick={onClose}>×</button>

//         {/* LEFT SIDE */}
//         <div className="modal-left">
//           <h2 className="modal-title">Sign in</h2>
//           <div className="underline"></div>
//           <p className="modal-subtext-center">
//             Enter your details below to sign in to your Farmlet account
//           </p>

//           <label className="label-text">Email</label>
//           <input className="input-box" type="email" placeholder="Enter Email" />

//           <label className="label-text">Password</label>

//           <div className="password-box">
//   <input
//     className="inputs"
//     type={showPassword ? "text" : "password"}
//     placeholder="Enter Password"
//   />
//   <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
//     {showPassword ? "Hide" : "Show"}
//   </span>
// </div>


//           <button className="small-btn">Sign in</button>

//           <p className="forgot-link">Forgotten password?</p>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="modal-right">
//           <img src={farmletLogo} alt="Farmlet" className="side-logo" />

//           <h3 className="modal-title">New to Farmlet?</h3>
//           <div className="underline"></div>

//           <p className="modal-subtext-center">
//             Find out your delivery day to start shopping...
//           </p>

//           <label className="label-text">Enter postcode</label>
//           <input className="input-box" type="text" placeholder="ex: 560001" />

//           <button className="small-btn">Show my delivery day</button>
//         </div>

//       </div>
//     </div>
//   );
// }











import React, { useState } from "react";
import "./SignInModal.css";
import farmletLogo from "../../Images/Logo 1.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function SignInModal({ open, onClose }) {
  const navigate = useNavigate();
  const { verifyPincode, login } = useAuth(); // Import from context
  const [showPassword, setShowPassword] = useState(false);

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(null); // null, true, false
  const [deliveryData, setDeliveryData] = useState(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setAvailable(null);
      setDeliveryData(null);
      setPincode("");
      setLoginInput("");
      setLoginPassword("");
      setLoginOtp("");
      setIsOtpSent(false);
      setInputType(null);
    }
  }, [open]);

  // Helper to get dates
  const calculateDates = (dayName) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = days.indexOf(dayName);

    if (targetDayIndex === -1) return null;

    const today = new Date();
    const currentDayIndex = today.getDay(); // 0-6

    let daysUntil = targetDayIndex - currentDayIndex;
    if (daysUntil <= 0) {
      daysUntil += 7; // Delivery is next week
    }

    const nextDeliveryDate = new Date(today);
    nextDeliveryDate.setDate(today.getDate() + daysUntil);

    // Cutoff: 2 days before at 11:45 PM
    const cutoffDate = new Date(nextDeliveryDate);
    cutoffDate.setDate(nextDeliveryDate.getDate() - 2);

    // Format dates
    const options = { day: 'numeric', month: 'short' };
    const nextDeliveryStr = nextDeliveryDate.toLocaleDateString('en-GB', options);

    const cutoffDayName = days[cutoffDate.getDay()].substring(0, 3); // Mon
    const cutoffDateStr = cutoffDate.toLocaleDateString('en-GB', options); // 9th Dec

    return {
      nextDelivery: nextDeliveryStr,
      cutoffDay: cutoffDayName,
      cutoffDate: cutoffDateStr
    };
  };

  const handleCheckPincode = async () => {
    if (!pincode) return;
    setLoading(true);
    setAvailable(null);
    setDeliveryData(null); // Clear previous delivery data

    try {
      const response = await fetch(`${window.ENV.BACKEND_API}/api/pincode/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });

      const data = await response.json();

      if (response.ok) {
        const dates = calculateDates(data.deliveryDay);
        const fullDetails = { ...data, ...dates };

        setDeliveryData(fullDetails);
        setAvailable(true);

        // UPDATE GLOBAL CONTEXT
        verifyPincode(fullDetails);

      } else {
        setAvailable(false);
      }
    } catch (error) {
      setAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryPath) => {
    onClose(); // Close modal
    navigate(categoryPath); // Navigate
  };
  // Login State (Unified)
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [inputType, setInputType] = useState(null); // 'email' or 'phone' or null

  // Determine input type on change
  const handleInputChange = (e) => {
    const val = e.target.value;
    setLoginInput(val);

    if (val === "") {
      setInputType(null);
      setIsOtpSent(false);
    } else if (val.match(/^\d+$/)) {
      // Only digits -> Phone
      setInputType('phone');
    } else {
      // Letters, symbols, etc -> Email (Password flow)
      setInputType('email');
      setIsOtpSent(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!loginInput || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${window.ENV.BACKEND_API}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginInput, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token } = data;
        login({ ...user, token });
        onClose();
        if (user.role === 'admin') {
          navigate("/admin");
        } else {
          alert(`Welcome back, ${user.name}!`);
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    if (!loginInput) {
      alert("Please enter a phone number");
      return;
    }

    try {
      const response = await fetch(`${window.ENV.BACKEND_API}/api/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginInput }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        alert("OTP sent!");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert("Something went wrong.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!loginInput || !loginOtp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const response = await fetch(`${window.ENV.BACKEND_API}/api/user/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginInput, otp: loginOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token } = data;
        login({ ...user, token });
        onClose();
        if (user.role === 'admin') {
          navigate("/admin");
        } else {
          alert(`Welcome back, ${user.name}!`);
        }
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert("Something went wrong.");
    }
  };

  // Forgot Password Logic
  const [forgotView, setForgotView] = useState(false);

  const handleForgotSubmit = async () => {
    if (!loginInput) {
      alert("Please enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${window.ENV.BACKEND_API}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginInput }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setForgotView(false); // Go back to login
      } else {
        alert(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  if (available && deliveryData) {
    // ... success view (no changes needed) ...
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container wide-modal" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="modal-close" onClick={onClose} style={{ color: '#333', borderColor: '#333' }}>×</button>

          <div className="success-view">
            <h2 className="delivery-header">
              <span className="delivery-date-highlight">{deliveryData.deliveryDay}</span> is your delivery day!
            </h2>

            <p className="delivery-message">
              We deliver to your area every {deliveryData.deliveryDay}. The next time we can deliver to you is on <strong>{deliveryData.nextDelivery}</strong>.
            </p>

            <div className="cutoff-message">
              You’ve got plenty of time to use up anything in the fridge and start meal planning before your last chance to order at <strong>11:45pm on {deliveryData.cutoffDay} {deliveryData.cutoffDate}</strong>.
            </div>

            <div className="build-order-section">
              <h3 className="build-order-title">Start building your order</h3>
              <div className="underline"></div>

              <p className="build-order-desc">
                Pick whatever items you fancy from our full range, or choose one of our set boxes and top up with any extras.
                You decide what you want, and how often - no subscription necessary.
              </p>

              <div className="category-grid">
                <div onClick={() => handleCategoryClick("/products/fresh-fruits")} className="category-card">Fresh Fruits</div>
                <div onClick={() => handleCategoryClick("/products/fresh-vegetables")} className="category-card">Fresh Vegetables</div>
                <div onClick={() => handleCategoryClick("/products/leafy-seasonings")} className="category-card">Leafy & others</div>
                <div onClick={() => handleCategoryClick("/products/whats-new")} className="category-card">What's new</div>
                <div onClick={() => handleCategoryClick("/products/essentials")} className="category-card">Essentials</div>
                <div onClick={() => handleCategoryClick("/products/dairy-eggs")} className="category-card">Dairy & eggs</div>
              </div>

              <button className="continue-btn" onClick={onClose}>Explore Farmlet</button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* LEFT SIDE */}
        <div className="modal-left">
          <h2 className="modal-title">Sign in</h2>
          <div className="underline"></div>
          <p className="modal-subtext-center">
            Enter your email or phone number to sign in
          </p>

          <label className="label-text">Email or Phone Number</label>
          <input
            className="input-box"
            type="text"
            placeholder="Enter Email or Phone"
            value={loginInput}
            onChange={handleInputChange}
            disabled={isOtpSent} // Disable only if OTP sent (for phone flow)
            style={isOtpSent ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
          />


          {/* EMAIL / PASSWORD FLOW (Default) */}
          {inputType !== 'phone' && !forgotView && (
            <>
              <label className="label-text">Password</label>
              <div className="password-box">
                <input
                  className="inputs"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button className="small-btn" onClick={handleEmailLogin}>Sign in</button>
              <p className="forgot-link" onClick={() => setForgotView(true)}>Forgotten password?</p>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {forgotView && (
            <div className="forgot-view">
              <p style={{ fontSize: '14px', marginBottom: '15px', color: '#555' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="small-btn" onClick={handleForgotSubmit} disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
              <p className="forgot-link" onClick={() => setForgotView(false)}>Back to Sign in</p>
            </div>
          )}

          {/* PHONE FLOW - Start (Get OTP) */}
          {inputType === 'phone' && !isOtpSent && !forgotView && (
            <button className="small-btn" onClick={handleSendOtp}>Get OTP</button>
          )}

          {/* PHONE FLOW - OTP SENT */}
          {inputType === 'phone' && isOtpSent && !forgotView && (
            <>
              <label className="label-text" style={{ marginTop: '15px' }}>OTP</label>
              <input
                className="input-box"
                type="text"
                placeholder="Enter OTP"
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value)}
              />
              <button className="small-btn" onClick={handleVerifyOtp}>Verify & Sign in</button>
              <p className="forgot-link" onClick={() => setIsOtpSent(false)} style={{ cursor: 'pointer' }}>Change Phone Number</p>
            </>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="modal-right">
          <img src={farmletLogo} alt="Farmlet" className="side-logo" />

          <h3 className="modal-title">New to Farmlet?</h3>
          <div className="underline"></div>

          <p className="modal-subtext-center">
            Find out your delivery day to start shopping...
          </p>

          <label className="label-text">Enter postcode</label>
          <input
            className="input-box"
            type="text"
            placeholder="ex: 500032"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          <button className="small-btn" onClick={handleCheckPincode} disabled={loading}>
            {loading ? "Checking..." : "Show my delivery day"}
          </button>

          {available === false && (
            <p style={{ color: "red", marginTop: "10px", fontWeight: "bold", textAlign: "center" }}>
              Sorry, we don't deliver to this area yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
