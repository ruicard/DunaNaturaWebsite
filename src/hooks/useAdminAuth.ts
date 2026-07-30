import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Admin login uses a plain username, mapped to a fixed internal email
// domain — the actual credential check happens against Firebase Auth's
// backend (hashed, rate-limited), not against anything in this codebase.
const ADMIN_EMAIL_DOMAIN = "dunanatura.local";

function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`;
}

interface UseAdminAuthResult {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  async function signIn(username: string, password: string) {
    await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return { user, loading, signIn, signOut };
}
