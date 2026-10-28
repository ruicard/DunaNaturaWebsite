import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PromoCode {
  id: string;
  code: string;
  percent: number;
  expirationDate: string; // YYYY-MM-DD, inclusive
}

interface UsePromoCodesResult {
  promoCodes: PromoCode[];
  loading: boolean;
  error: string | null;
}

// Firestore collection "PromoCodes" stores fields "code"/"percent"/"expiration-date".
export function usePromoCodes(enabled: boolean): UsePromoCodesResult {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const q = query(collection(db, "PromoCodes"), orderBy("code"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPromoCodes(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              code: typeof data.code === "string" ? data.code : "",
              percent: typeof data.percent === "number" ? data.percent : 0,
              expirationDate: data["expiration-date"] ?? "",
            };
          })
        );
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load promo codes.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled]);

  return { promoCodes, loading, error };
}
