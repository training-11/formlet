import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pincodeDetails, setPincodeDetails] = useState(null); // { pincode: "500032", deliveryDay: "Wednesday" }
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("cartItems");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse cart items", error);
            return [];
        }
    });

    // Helper to calculate next delivery date dynamically
    const calculateNextDelivery = (dayName) => {
        if (!dayName) return null;

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDayIndex = days.findIndex(d => d.toLowerCase() === dayName.toLowerCase());

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

    // Load from local storage on mount (optional persistent state)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedPincode = localStorage.getItem("pincodeDetails");

        if (storedUser) {
            const user = JSON.parse(storedUser);

            // Validate Token Existence
            if (user && user.token) {
                setCurrentUser(user);

                // If we have a user but no stored pincode context, try to recover it from user's address/profile if available
                // This is a simple heuristic: if the user has a saved Pincode in their object
                if (!storedPincode && user.pincode) {
                    // We might need to fetch delivery day for this pincode again to be complete
                    // For now, just setting it might be enough if we just need the number
                    setPincodeDetails({ pincode: user.pincode, deliveryDay: "Checking..." });
                }
            } else {
                // Invalid session, clear it
                localStorage.removeItem("user");
                setCurrentUser(null);
            }
        }

        if (storedPincode) {
            const details = JSON.parse(storedPincode);
            // Refresh dates if we have a delivery day
            if (details.deliveryDay && details.deliveryDay !== "Unknown") {
                const refreshedDates = calculateNextDelivery(details.deliveryDay);
                if (refreshedDates) {
                    const updatedDetails = { ...details, ...refreshedDates };
                    setPincodeDetails(updatedDetails);
                    // Also update storage with fresh data
                    localStorage.setItem("pincodeDetails", JSON.stringify(updatedDetails));
                    return;
                }
            }
            setPincodeDetails(details);
        }
    }, []);

    // Persist cart items
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const login = async (userData) => {
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Auto-fetch pincode details if present
        if (userData.pincode) {
            try {
                const response = await fetch(`${window.ENV.BACKEND_API}/api/pincode/check`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pincode: userData.pincode }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const dates = calculateNextDelivery(data.deliveryDay);
                    const fullDetails = { ...data, ...dates };

                    setPincodeDetails(fullDetails);
                    localStorage.setItem("pincodeDetails", JSON.stringify(fullDetails));
                }
            } catch (error) {
                console.error("Auto-fetch pincode error:", error);
            }
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setPincodeDetails(null);
        localStorage.removeItem("user");
        localStorage.removeItem("pincodeDetails");
    };

    const verifyPincode = (details) => {
        setPincodeDetails(details);
        localStorage.setItem("pincodeDetails", JSON.stringify(details));
    };

    const addToCart = (product, quantity = 1, frequency = "Once only", startDate = null) => {
        setCartItems((prev) => {
            const exist = prev.find((item) => item.name === product.name);
            if (exist) {
                return prev.map((item) =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + quantity, frequency: frequency, startDate: startDate || item.startDate } // Update freq if re-added? Or keep old? Let's overwrite.
                        : item
                );
            }
            return [...prev, { ...product, quantity, frequency, startDate }];
        });
    };

    const updateCartItem = (productName, newQuantity, newFrequency, newStartDate = null) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.name === productName
                    ? { ...item, quantity: newQuantity, frequency: newFrequency || item.frequency, startDate: newStartDate !== undefined ? newStartDate : item.startDate }
                    : item
            )
        );
    };

    const removeFromCart = (productName) => {
        setCartItems((prev) => prev.filter((item) => item.name !== productName));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                pincodeDetails,
                isAuthenticated: !!currentUser || !!pincodeDetails, // For now, pincode acts as "auth" for shopping
                login,
                logout,
                verifyPincode,
                cartItems,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
