import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pincodeDetails, setPincodeDetails] = useState(null); // { pincode: "500032", deliveryDay: "Wednesday" }
    const [cartItems, setCartItems] = useState([]);

    // Load from local storage on mount (optional persistent state)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedPincode = localStorage.getItem("pincodeDetails");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);

            // If we have a user but no stored pincode context, try to recover it from user's address/profile if available
            // This is a simple heuristic: if the user has a saved Pincode in their object
            if (!storedPincode && user.pincode) {
                // We might need to fetch delivery day for this pincode again to be complete
                // For now, just setting it might be enough if we just need the number
                setPincodeDetails({ pincode: user.pincode, deliveryDay: "Checking..." });
            }
        }
        if (storedPincode) setPincodeDetails(JSON.parse(storedPincode));
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
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

    const addToCart = (product, quantity = 1, frequency = "Once only") => {
        setCartItems((prev) => {
            const exist = prev.find((item) => item.name === product.name);
            if (exist) {
                return prev.map((item) =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + quantity, frequency: frequency } // Update freq if re-added? Or keep old? Let's overwrite.
                        : item
                );
            }
            return [...prev, { ...product, quantity, frequency }];
        });
    };

    const updateCartItem = (productName, newQuantity, newFrequency) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.name === productName
                    ? { ...item, quantity: newQuantity, frequency: newFrequency || item.frequency }
                    : item
            )
        );
    };

    const removeFromCart = (productName) => {
        setCartItems((prev) => prev.filter((item) => item.name !== productName));
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
