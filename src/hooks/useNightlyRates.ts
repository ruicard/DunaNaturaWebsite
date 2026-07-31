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

// Firestore collection "Pricing" stores fields "start-date"/"end-date"/"price";
// this hook maps them to the camelCase NightlyRate shape used across the app.
export function useNightlyRates(enabled: boolean): UseNightlyRatesResult {
  const [rates, setRates] = useState<NightlyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const q = query(collection(db, "Pricing"), orderBy("start-date"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRates(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              startDate: data["start-date"] ?? "",
              endDate: data["end-date"] ?? "",
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
