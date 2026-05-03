import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Save user data
        const userRef = doc(db, "users", result.user.uid);
        await setDoc(
          userRef,
          {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            lastLogin: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } catch (error: any) {
      console.error("Google sign in error", error);
      if (error.code === "auth/unauthorized-domain") {
        alert(
          "Domain Not Authorized. Please go to your Firebase Console -> Authentication -> Settings -> Authorized domains, and add the current URL (e.g. ais-dev-...run.app) to the list.",
        );
      } else if (
        error.code === "permission-denied" ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        alert(
          "Firestore permissions denied. Please copy the rules from the firestore.rules file and paste them into your Firebase Console under Firestore Database -> Rules.",
        );
      } else {
        alert(
          "Failed to sign in. Make sure Google Auth is enabled in your Firebase console.",
        );
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        const userRef = doc(db, "users", result.user.uid);
        await setDoc(
          userRef,
          {
            uid: result.user.uid,
            email: result.user.email,
            lastLogin: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } catch (error: any) {
      console.error("Email sign in error", error);
      if (
        error.code === "auth/configuration-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        alert(
          "Failed to sign in. Please make sure you have enabled 'Email/Password' provider in the Firebase Console under Authentication -> Sign-in method, and that you have created the user with that email and password.",
        );
      } else {
        alert("Sign in failed: " + error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
