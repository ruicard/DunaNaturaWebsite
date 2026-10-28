import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Surcharge {
  id: string;
  nights: number;
  percent: number;
}

interface UseSurchargesResult {
  surcharges: Surcharge[];
  loading: boolean;
  error: string | null;
}

// Firestore collection "Surcharges" stores fields "nights"/"percent" —
// a short-stay surcharge applied on top of the nightly price when a stay
// is exactly that many nights long. Stays with no matching row get no surcharge.
export function useSurcharges(enabled: boolean): UseSurchargesResult {
  const [surcharges, setSurcharges] = useState<Surcharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const q = query(collection(db, "Surcharges"), orderBy("nights"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setSurcharges(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nights: typeof data.nights === "number" ? data.nights : 0,
              percent: typeof data.percent === "number" ? data.percent : 0,
            };
          })
        );
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load surcharges.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled]);

  return { surcharges, loading, error };
}
