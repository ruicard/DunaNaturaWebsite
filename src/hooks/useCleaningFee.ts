import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseCleaningFeeResult {
  cleaningFee: number | null;
  loading: boolean;
  error: string | null;
}

// Firestore doc "Settings/general" stores field "cleaning-fee".
export function useCleaningFee(enabled: boolean): UseCleaningFeeResult {
  const [cleaningFee, setCleaningFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = onSnapshot(
      doc(db, "Settings", "general"),
      (snapshot) => {
        const fee = snapshot.data()?.["cleaning-fee"];
        setCleaningFee(typeof fee === "number" ? fee : null);
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load the cleaning fee.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled]);

  return { cleaningFee, loading, error };
}
