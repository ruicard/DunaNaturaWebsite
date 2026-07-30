import { useState, type FormEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Loader2, Check, X, Pencil } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  useReservationRequests,
  type ReservationRequest,
  type ReservationStatus,
} from "@/hooks/useReservationRequests";

export default function Admin() {
  const { user, loading, signIn, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pt-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return user ? <AdminDashboard onSignOut={signOut} /> : <AdminLogin onSignIn={signIn} />;
}

function AdminLogin({
  onSignIn,
}: {
  onSignIn: (username: string, password: string) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSignIn(username, password);
    } catch {
      // Deliberately generic: don't reveal whether the username exists.
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-card p-8 shadow-soft">
        <h1 className="text-xl font-medium">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage reservations.</p>

        <div className="mt-6">
          <label
            htmlFor="admin-username"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Username
          </label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="admin-password"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
          />
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-primary py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const FILTERS: { label: string; value: ReservationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Requests", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Canceled", value: "canceled" },
  { label: "Rejected", value: "rejected" },
];

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [filter, setFilter] = useState<ReservationStatus | "all">("all");
  const { requests, loading, error } = useReservationRequests(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  function toggleEditMenu(id: string, e: MouseEvent<HTMLButtonElement>) {
    if (editingId === id) {
      setEditingId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setEditingId(id);
  }

  async function setStatus(
    request: ReservationRequest,
    status: Exclude<ReservationStatus, "pending">
  ) {
    setUpdatingId(request.id);
    setActionError(null);
    try {
      await updateDoc(doc(db, "reservationRequests", request.id), { status });
      if (request.bookingId) {
        await updateDoc(doc(db, "bookings", request.bookingId), {
          status: status === "confirmed" ? "confirmed" : "canceled",
        });
      }
    } catch {
      setActionError("Couldn't update that reservation. Please try again.");
    } finally {
      setUpdatingId(null);
      setEditingId(null);
    }
  }

  return (
    <div className="container py-12 pt-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Reservations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Requests and confirmed bookings submitted from the site.
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-smooth ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {actionError && <p className="mb-4 text-sm text-destructive">{actionError}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Actions</th>
              <th className="whitespace-nowrap px-4 py-3">Guest</th>
              <th className="whitespace-nowrap px-4 py-3">Email</th>
              <th className="whitespace-nowrap px-4 py-3">Dates</th>
              <th className="whitespace-nowrap px-4 py-3">Guests</th>
              <th className="whitespace-nowrap px-4 py-3">Promo Code</th>
              <th className="px-4 py-3">Comments</th>
              <th className="whitespace-nowrap px-4 py-3">Status</th>
              <th className="sticky right-0 whitespace-nowrap bg-muted px-4 py-3 text-right">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.status === "pending" ? (
                      updatingId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStatus(r, "confirmed")}
                            aria-label={`Confirm reservation for ${r.name}`}
                            title="Confirm"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-green-600/30 text-green-700 transition-smooth hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStatus(r, "rejected")}
                            aria-label={`Reject reservation for ${r.name}`}
                            title="Reject"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-smooth hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{r.name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{r.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.checkIn} → {r.checkOut}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.guests} ({r.adults} adult{r.adults !== 1 ? "s" : ""}
                    {r.children > 0 ? `, ${r.children} child${r.children !== 1 ? "ren" : ""}` : ""})
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{r.promoCode || "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {r.comments || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="sticky right-0 whitespace-nowrap bg-background px-4 py-3 text-right">
                    {r.status !== "pending" &&
                      (updatingId === r.id ? (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <button
                          onClick={(e) => toggleEditMenu(r.id, e)}
                          aria-label={`Edit status for ${r.name}`}
                          title="Edit"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      ))}
                    {editingId === r.id &&
                      menuPosition &&
                      createPortal(
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setEditingId(null)} />
                          <div
                            className="fixed z-50 w-36 overflow-hidden rounded-md border border-border bg-card shadow-hover"
                            style={{ top: menuPosition.top, right: menuPosition.right }}
                          >
                            {(["confirmed", "rejected", "canceled"] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => setStatus(r, status)}
                                disabled={status === r.status}
                                className={`block w-full px-3 py-2 text-left text-xs capitalize transition-smooth ${
                                  status === r.status
                                    ? "cursor-not-allowed text-muted-foreground/50"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </>,
                        document.body
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const styles: Record<ReservationStatus, string> = {
    confirmed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}
