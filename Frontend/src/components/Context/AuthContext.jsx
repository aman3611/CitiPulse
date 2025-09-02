import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [id, setId] = useState(null); 
  const [profilePhoto, setProfilePhoto] = useState(null); // NEW
    const [loading, setLoading] = useState(true); // NEW

  // Safe JWT decode
  const decodeToken = (jwt) => {
    try {
      const payload = jwt.split(".")[1];
      console.log("Decoded Payload:", JSON.parse(atob(payload))); // Log the payload for debugging
      return JSON.parse(atob(payload));
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  // Sync with localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const user = decodeToken(storedToken);
      if (user) {
        setToken(storedToken);
        setEmail(user.email);
        setRole(user.role);
        setName(user.name);
        setId(user.id); 
        setProfilePhoto(user.profilePhoto || ""); // Set default profile photo if not present
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); 
  }, []);

  // Login handler
  const login = (token) => {
    const user = decodeToken(token);
    if (user) {
      setToken(token);
      setEmail(user.email);
      setRole(user.role);
      setName(user.name);
      setId(user.id); // Set user ID
      setProfilePhoto(user.profilePhoto || ""); // Set default profile photo if not present
      localStorage.setItem("token", token);
    } else {
      console.warn("Invalid token provided to login");
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setEmail(null);
    setRole(null);
    setId(null); // Reset user ID on logout
    setName(null);
    setProfilePhoto(null); // Reset profile photo on logout
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, email, role, name, id, profilePhoto, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
