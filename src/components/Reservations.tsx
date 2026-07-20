import { useState } from "react";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Reservations() {
  const today = startOfDay(new Date());
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const canGoPrev =
    view > new Date(today.getFullYear(), today.getMonth(), 1);

  function pick(date: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (date <= checkIn) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      setCheckOut(date);
    }
  }

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
      : 0;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
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
              onInc={() => setAdults((v) => v + 1)}
            />
            <div className="my-6 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Kids
              </span>
              <button
                onClick={() => setKids((v) => v + 1)}
                className="flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:opacity-70"
              >
                <Plus className="h-4 w-4" /> Add Kid
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {kids === 0 ? "No kids added" : `${kids} kid${kids !== 1 ? "s" : ""} added`}
            </p>
            {kids > 0 && (
              <button
                onClick={() => setKids(0)}
                className="mt-2 text-xs text-muted-foreground underline"
              >
                clear
              </button>
            )}
            <button className="mt-8 w-full rounded-md bg-primary py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90">
              Continue
            </button>
          </div>

          {/* Calendar */}
          <div className="rounded-lg bg-card p-8 shadow-soft">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Check-in & Check-out
            </p>
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

            <div className="grid grid-cols-7 gap-1 text-center">
              {DOW.map((d) => (
                <span key={d} className="py-1 text-[0.7rem] font-medium text-muted-foreground">
                  {d}
                </span>
              ))}
              {cells.map((date, i) => {
                if (!date) return <span key={i} />;
                const isPast = date < today;
                const isIn = checkIn && date.getTime() === checkIn.getTime();
                const isOut = checkOut && date.getTime() === checkOut.getTime();
                const inRange =
                  checkIn && checkOut && date > checkIn && date < checkOut;
                const selected = isIn || isOut;
                return (
                  <button
                    key={i}
                    disabled={isPast}
                    onClick={() => pick(date)}
                    className={[
                      "aspect-square rounded-md text-sm transition-smooth",
                      isPast ? "cursor-not-allowed text-muted-foreground/40" : "hover:bg-muted",
                      selected ? "bg-primary text-primary-foreground hover:bg-primary" : "",
                      inRange ? "bg-primary/15" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-border pt-4 text-sm">
              {checkIn && checkOut ? (
                <p className="text-foreground">
                  {nights} night{nights !== 1 ? "s" : ""} · {adults + kids} guest
                  {adults + kids !== 1 ? "s" : ""}
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
  );
}

function Stepper({
  label,
  value,
  onDec,
  onInc,
}: {
  label: string;
  value: string;
  onDec: () => void;
  onInc: () => void;
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
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-smooth hover:bg-muted"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
