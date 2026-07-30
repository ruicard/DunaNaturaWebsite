import { useRef, useState, type FormEvent } from "react";
import { Minus, Plus, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toDateKey, useBookedDates } from "@/hooks/useBookedDates";

interface ReservationDetails {
  name: string;
  email: string;
  comments: string;
}

const MIN_CHILD_AGE = 0;
const MAX_CHILD_AGE = 17;
const MAX_ADULTS = 6;

interface Child {
  id: number;
  age: number;
}

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function datesBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  for (let cursor = start; cursor < end; cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }
  return days;
}

export default function Reservations() {
  const today = startOfDay(new Date());
  const { bookedDates, loading, error } = useBookedDates();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState<Child[]>([]);
  const nextChildId = useRef(0);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);

  const isBooked = (date: Date) => bookedDates.has(toDateKey(date));

  function addChild() {
    nextChildId.current += 1;
    setChildren((c) => [...c, { id: nextChildId.current, age: 8 }]);
  }

  function removeChild(id: number) {
    setChildren((c) => c.filter((child) => child.id !== id));
  }

  function setChildAge(id: number, age: number) {
    const clamped = Math.min(MAX_CHILD_AGE, Math.max(MIN_CHILD_AGE, age));
    setChildren((c) => c.map((child) => (child.id === id ? { ...child, age: clamped } : child)));
  }

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const canGoPrev =
    view > new Date(today.getFullYear(), today.getMonth(), 1);

  function pick(date: Date) {
    if (date < today || isBooked(date) || Boolean(error)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      setRangeError(null);
      return;
    }

    if (date <= checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      setRangeError(null);
      return;
    }

    const blocked = datesBetween(checkIn, date).some(isBooked);
    if (blocked) {
      setRangeError("Some nights in that range are already booked — pick a different check-out date.");
      return;
    }

    setCheckOut(date);
    setRangeError(null);
  }

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
      : 0;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const totalGuests = adults + children.length;
  const tripSummary =
    checkIn && checkOut
      ? `${MONTHS[checkIn.getMonth()]} ${checkIn.getDate()} – ${MONTHS[checkOut.getMonth()]} ${checkOut.getDate()} · ${nights} night${nights !== 1 ? "s" : ""} · ${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
      : "";

  return (
    <>
      <section id="reservations" className="bg-background py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">Reservations</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">Book Your Escape</h2>
          <p className="mt-4 text-muted-foreground">
            Choose your dates and let nature work its magic
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Guests */}
          <div className="rounded-lg bg-card p-8 shadow-soft">
            <Stepper
              label="Adults"
              value={`${adults} adult${adults !== 1 ? "s" : ""}`}
              onDec={() => setAdults((v) => Math.max(1, v - 1))}
              onInc={() => setAdults((v) => Math.min(MAX_ADULTS, v + 1))}
              incDisabled={adults >= MAX_ADULTS}
            />
            <div className="my-6 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Children
              </span>
              <button
                onClick={addChild}
                className="flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:opacity-70"
              >
                <Plus className="h-4 w-4" /> Add Child
              </button>
            </div>
            {children.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No children added</p>
            ) : (
              <div className="mt-4 space-y-2">
                {children.map((child, index) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-sm">Child {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChildAge(child.id, child.age - 1)}
                        disabled={child.age <= MIN_CHILD_AGE}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-smooth hover:bg-muted disabled:opacity-30"
                        aria-label={`Decrease age for child ${index + 1}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-16 text-center text-sm">
                        {child.age} yr{child.age !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={() => setChildAge(child.id, child.age + 1)}
                        disabled={child.age >= MAX_CHILD_AGE}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-smooth hover:bg-muted disabled:opacity-30"
                        aria-label={`Increase age for child ${index + 1}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeChild(child.id)}
                        className="ml-1 text-muted-foreground transition-smooth hover:text-destructive"
                        aria-label={`Remove child ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {reservation ? (
              <div className="mt-8 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
                <p className="font-medium text-foreground">Request sent!</p>
                <p className="mt-1 text-muted-foreground">
                  Thanks, {reservation.name}. We'll reach out at {reservation.email} to confirm
                  your stay.
                </p>
              </div>
            ) : (
              <button
                disabled={!checkIn || !checkOut}
                onClick={() => setDialogOpen(true)}
                className="mt-8 w-full rounded-md bg-primary py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            )}
          </div>

          {/* Calendar */}
          <div className="rounded-lg bg-card p-8 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Check-in & Check-out
              </p>
              {loading && (
                <span className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking availability
                </span>
              )}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <button
                disabled={!canGoPrev}
                onClick={() => setView(new Date(year, month - 1, 1))}
                className="rounded-md p-1 text-foreground transition-smooth hover:bg-muted disabled:opacity-30"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium">
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={() => setView(new Date(year, month + 1, 1))}
                className="rounded-md p-1 text-foreground transition-smooth hover:bg-muted"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className={`grid grid-cols-7 gap-1 text-center ${loading ? "opacity-50" : ""}`}>
              {DOW.map((d) => (
                <span key={d} className="py-1 text-[0.7rem] font-medium text-muted-foreground">
                  {d}
                </span>
              ))}
              {cells.map((date, i) => {
                if (!date) return <span key={i} />;
                const isPast = date < today;
                const booked = !isPast && isBooked(date);
                const isIn = checkIn && date.getTime() === checkIn.getTime();
                const isOut = checkOut && date.getTime() === checkOut.getTime();
                const inRange =
                  checkIn && checkOut && date > checkIn && date < checkOut;
                const selected = isIn || isOut;
                return (
                  <button
                    key={i}
                    disabled={isPast || booked}
                    title={booked ? "Already booked" : undefined}
                    onClick={() => pick(date)}
                    className={[
                      "relative aspect-square rounded-md text-sm transition-smooth",
                      isPast ? "cursor-not-allowed text-muted-foreground/30" : "",
                      booked && !isPast
                        ? "cursor-not-allowed bg-muted text-muted-foreground/50 line-through decoration-muted-foreground/40"
                        : "",
                      !isPast && !booked && !selected ? "hover:bg-muted" : "",
                      selected ? "bg-primary text-primary-foreground hover:bg-primary" : "",
                      inRange ? "bg-primary/15" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[0.7rem] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-border" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                Booked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Selected
              </span>
            </div>

            <div className="mt-6 border-t border-border pt-4 text-sm">
              {error ? (
                <p className="text-destructive">{error}</p>
              ) : rangeError ? (
                <p className="text-destructive">{rangeError}</p>
              ) : checkIn && checkOut ? (
                <p className="text-foreground">
                  {nights} night{nights !== 1 ? "s" : ""} · {adults + children.length} guest
                  {adults + children.length !== 1 ? "s" : ""}
                </p>
              ) : checkIn ? (
                <p className="text-muted-foreground">Select your check-out date</p>
              ) : (
                <p className="text-muted-foreground">Select your check-in date</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </section>

      {dialogOpen && checkIn && checkOut && (
        <ReservationDialog
          summary={tripSummary}
          booking={{ checkIn, checkOut, adults, children }}
          onClose={() => setDialogOpen(false)}
          onSubmitted={(details) => {
            setReservation(details);
            setDialogOpen(false);
          }}
        />
      )}
    </>
  );
}

function Stepper({
  label,
  value,
  onDec,
  onInc,
  incDisabled,
}: {
  label: string;
  value: string;
  onDec: () => void;
  onInc: () => void;
  incDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
        <p className="mt-1 text-sm">{value}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-smooth hover:bg-muted"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={onInc}
          disabled={incDisabled}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-smooth hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ReservationDialog({
  summary,
  booking,
  onClose,
  onSubmitted,
}: {
  summary: string;
  booking: { checkIn: Date; checkOut: Date; adults: number; children: Child[] };
  onClose: () => void;
  onSubmitted: (details: ReservationDetails) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: { name?: string; email?: string } = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const checkInKey = toDateKey(booking.checkIn);
      const checkOutKey = toDateKey(booking.checkOut);

      const bookingRef = await addDoc(collection(db, "bookings"), {
        checkIn: checkInKey,
        checkOut: checkOutKey,
        status: "pending",
      });

      await addDoc(collection(db, "reservationRequests"), {
        name: name.trim(),
        email: email.trim(),
        checkIn: checkInKey,
        checkOut: checkOutKey,
        guests: booking.adults + booking.children.length,
        adults: booking.adults,
        children: booking.children.length,
        childrenAges: booking.children.map((child) => child.age),
        comments: comments.trim(),
        promoCode: promoCode.trim(),
        reservationDate: serverTimestamp(),
        status: "pending",
        bookingId: bookingRef.id,
      });

      onSubmitted({ name: name.trim(), email: email.trim(), comments: comments.trim() });
    } catch {
      setSubmitError("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-card p-8 shadow-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 id="reservation-dialog-title" className="text-xl font-medium">
              Your Details
            </h3>
            {summary && <p className="mt-1 text-sm text-muted-foreground">{summary}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground transition-smooth hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reservation-name"
              className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              Name
            </label>
            <input
              id="reservation-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="reservation-email"
              className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              Email
            </label>
            <input
              id="reservation-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="reservation-comments"
              className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              Comments <span className="normal-case text-muted-foreground/70">(optional)</span>
            </label>
            <textarea
              id="reservation-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
              placeholder="Anything we should know?"
            />
          </div>

          <div>
            <label
              htmlFor="reservation-promo-code"
              className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              Promo Code <span className="normal-case text-muted-foreground/70">(optional)</span>
            </label>
            <input
              id="reservation-promo-code"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
              placeholder="Have a code?"
            />
          </div>

          {submitError && <p className="text-xs text-destructive">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-md bg-primary py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
