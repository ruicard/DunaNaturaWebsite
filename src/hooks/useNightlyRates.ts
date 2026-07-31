import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface NightlyRate {
  id: string;
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string; // YYYY-MM-DD, inclusive
  price: number;
}

interface UseNightlyRatesResult {
  rates: NightlyRate[];
  loading: boolean;
  error: string | null;
}

// Only subscribes once `enabled` is true (i.e. the admin is signed in) —
// Firestore rules reject this read for anonymous visitors anyway.
export function useNightlyRates(enabled: boolean): UseNightlyRatesResult {
  const [rates, setRates] = useState<NightlyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const q = query(collection(db, "nightlyRates"), orderBy("startDate"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRates(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              startDate: data.startDate ?? "",
              endDate: data.endDate ?? "",
              price: typeof data.price === "number" ? data.price : 0,
            };
          })
        );
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load pricing periods.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled]);

  return { rates, loading, error };
}
