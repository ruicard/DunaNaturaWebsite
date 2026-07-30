import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ReservationStatus = "pending" | "confirmed" | "canceled" | "rejected";

export interface ReservationRequest {
  id: string;
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  childrenAges: number[];
  comments: string;
  promoCode: string;
  status: ReservationStatus;
  bookingId: string;
}

interface UseReservationRequestsResult {
  requests: ReservationRequest[];
  loading: boolean;
  error: string | null;
}

// Only subscribes once `enabled` is true (i.e. the admin is signed in) —
// Firestore rules reject this read for anonymous visitors anyway, but we
// avoid even issuing the query until there's a session.
export function useReservationRequests(enabled: boolean): UseReservationRequestsResult {
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const q = query(collection(db, "reservationRequests"), orderBy("reservationDate", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRequests(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name ?? "",
              email: data.email ?? "",
              checkIn: data.checkIn ?? "",
              checkOut: data.checkOut ?? "",
              guests: data.guests ?? 0,
              adults: data.adults ?? 0,
              children: data.children ?? 0,
              childrenAges: Array.isArray(data.childrenAges) ? data.childrenAges : [],
              comments: data.comments ?? "",
              promoCode: data.promoCode ?? "",
              status: (data.status as ReservationStatus) ?? "pending",
              bookingId: data.bookingId ?? "",
            };
          })
        );
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load reservation requests.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [enabled]);

  return { requests, loading, error };
}
