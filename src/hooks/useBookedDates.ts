import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Firestore shape (collection "bookings"):
//   checkIn:  "YYYY-MM-DD"  (first night occupied)
//   checkOut: "YYYY-MM-DD"  (departure day, not occupied — matches the
//                            check-in/check-out semantics used by the calendar)
//   status:   "confirmed" | "pending" | "canceled"  (optional, defaults to booked)
interface BookingDoc {
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function expandRange(checkIn: string, checkOut: string): string[] {
  const keys: string[] = [];
  let cursor = parseDateKey(checkIn);
  const end = parseDateKey(checkOut);
  while (cursor < end) {
    keys.push(toDateKey(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
  }
  return keys;
}

interface UseBookedDatesResult {
  bookedDates: Set<string>;
  loading: boolean;
  error: string | null;
}

export function useBookedDates(): UseBookedDatesResult {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const dates = new Set<string>();
        snapshot.forEach((doc) => {
          const booking = doc.data() as BookingDoc;
          if (booking.status === "canceled") return;
          if (!booking.checkIn || !booking.checkOut) return;
          for (const key of expandRange(booking.checkIn, booking.checkOut)) {
            dates.add(key);
          }
        });
        setBookedDates(dates);
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Couldn't load availability. Please contact us to confirm your dates.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { bookedDates, loading, error };
}
