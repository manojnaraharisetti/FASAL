// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './../../firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // Ensure currentUser is not undefined
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  // Define checkAuthentication function here
  const checkAuthentication = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return currentUser;
      } else {
        throw new Error('User is not authenticated');
      }
    } catch (error) {
      throw error;
    }
  };

  return { ...context, checkAuthentication }; // Include checkAuthentication in the returned context
};
