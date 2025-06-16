import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, rdb, googleProvider, facebookProvider, twitterProvider } from '../services/firebase-config';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  /** ✅ Function to Add User to Database */
  const addUserToDatabase = async (user) => {
    if (!user) return;
    try {
      const userRef = rdb.ref(`users/${user.uid}`);
      const snapshot = await userRef.get();
      if (!snapshot.exists()) {
        await userRef.set({
          identifier: user.email || '',
          "last-login": new Date().toISOString(),
          "date-created": user.metadata?.creationTime || new Date().toISOString(),
          role: 'basic'
        });
      } else {
        await userRef.update({ "last-login": new Date().toISOString() });
      }
    } catch (error) {
      console.error("Database error:", error);
    }
  };

  /** ✅ Function to Fetch User Role */
  const fetchUserRoleFromFirebase = useCallback(async (userId) => {
    try {
      const roleRef = rdb.ref(`users/${userId}/role`);
      const snapshot = await roleRef.get();
      if (snapshot.exists()) {
        const role = snapshot.val();
        setUserRole(role);
        localStorage.setItem('userRole', role);
        navigateBasedOnRole(role);
      }
    } catch (error) {
      console.warn("Error fetching user role:", error);
      setUserRole('basic');
    }
  }, []);

  /** ✅ Function to Navigate Based on Role */
  const navigateBasedOnRole = useCallback((role) => {
    if (!role) return; // Prevent navigation if role is null

    if (role === "admin" && window.location.pathname === "/sign-in") {
      navigate("/baptism_registry");
    }
  }, [navigate]);

  /** ✅ Function to Handle Auth Changes */
  useEffect(() => {
    let roleRef = null;
    const handleAuthChange = async (user) => {
      setCurrentUser(user);
      if (user) {
        await addUserToDatabase(user);
        const storedRole = localStorage.getItem("userRole");
        
        if (storedRole) {
          setUserRole(storedRole);
          navigateBasedOnRole(storedRole);
        } else {
          await fetchUserRoleFromFirebase(user.uid);
        }

        roleRef = rdb.ref(`users/${user.uid}/role`);
        roleRef.on("value", (snapshot) => {
          if (snapshot.exists()) {
            const newRole = snapshot.val();
            setUserRole(newRole);
            localStorage.setItem("userRole", newRole);
            navigateBasedOnRole(newRole);
          }
        });
      } else {
        localStorage.removeItem("userRole");
        setUserRole(null);
        navigate("/sign-in"); // Ensure user is redirected properly
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(handleAuthChange);
    return () => {
      unsubscribe();
      if (roleRef) roleRef.off();
    };
  }, [fetchUserRoleFromFirebase]); // Removed navigateBasedOnRole from dependencies

  /** ✅ Sign-Up Function */
  const signUp = async (email, password) => auth.createUserWithEmailAndPassword(email, password);

  /** ✅ Sign-In Function */
  const signIn = async (email, password) => auth.signInWithEmailAndPassword(email, password);

  /** ✅ Sign-Out Function */
  const signOut = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem("userRole");
      navigate("/sign-in"); // Redirect after logout
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  /** ✅ Social Sign-In Functions */
  const signInWithGoogle = async () => auth.signInWithPopup(googleProvider);
  const signInWithFacebook = async () => auth.signInWithPopup(facebookProvider);
  const signInWithTwitter = async () => auth.signInWithPopup(twitterProvider);

  /** ✅ Provide Auth Context */
  return (
    <AuthContext.Provider value={{ currentUser, userRole, signUp, signIn, signOut, signInWithGoogle, signInWithFacebook, signInWithTwitter }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
