import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../Pages/Authentic/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user || null);
      if (user) {
        try {
          const res = await fetch(`${API}/api/users/email/${user.email}`);
          if (!res.ok) throw new Error("Failed to fetch role");
          const data = await res.json();
          setUserRole(data.role);
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [API]);

  return (
    <AuthContext.Provider value={{ firebaseUser, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);