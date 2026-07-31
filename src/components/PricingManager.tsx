import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNightlyRates, type NightlyRate } from "@/hooks/useNightlyRates";

interface Row {
  key: string;
  docId: string | null; // null = not yet saved to Firestore
  startDate: string;
  endDate: string;
  price: string;
  saving: boolean;
  error: string | null;
}

function ratesToRows(rates: NightlyRate[]): Row[] {
  return rates.map((r) => ({
    key: r.id,
    docId: r.id,
    startDate: r.startDate,
    endDate: r.endDate,
    price: String(r.price),
    saving: false,
    error: null,
  }));
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart <= bEnd && bStart <= aEnd;
}

export default function PricingManager() {
  const { rates, loading, error } = useNightlyRates(true);
  const [rows, setRows] = useState<Row[]>([]);
  const nextKey = useRef(0);

  // Rebuild the local editable list from Firestore whenever it changes —
  // but only while there's nothing unsaved, so we don't clobber an
  // in-progress edit out from under the admin.
  useEffect(() => {
    const hasDraft = rows.some((r) => r.docId === null);
    if (hasDraft) return;
    setRows(ratesToRows(rates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  function newRow(): Row {
    nextKey.current += 1;
    return {
      key: `draft-${nextKey.current}`,
      docId: null,
      startDate: "",
      endDate: "",
      price: "",
      saving: false,
      error: null,
    };
  }

  function addRowAfter(index: number) {
    setRows((current) => {
      const next = [...current];
      next.splice(index + 1, 0, newRow());
      return next;
    });
  }

  function addRowAtEnd() {
    setRows((current) => [...current, newRow()]);
  }

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((current) => current.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  async function removeRow(row: Row) {
    if (row.docId) {
      updateRow(row.key, { saving: true, error: null });
      try {
        await deleteDoc(doc(db, "Pricing", row.docId));
      } catch {
        updateRow(row.key, { saving: false, error: "Couldn't delete this period." });
        return;
      }
    }
    setRows((current) => current.filter((r) => r.key !== row.key));
  }

  async function saveRow(row: Row) {
    if (!row.startDate || !row.endDate) {
      updateRow(row.key, { error: "Pick both a start and end date." });
      return;
    }
    if (row.startDate > row.endDate) {
      updateRow(row.key, { error: "Start date must be before the end date." });
      return;
    }
    const price = Number(row.price);
    if (row.price.trim() === "" || Number.isNaN(price) || price < 0) {
      updateRow(row.key, { error: "Enter a valid price (0 or more)." });
      return;
    }

    const overlap = rows.find(
      (other) =>
        other.key !== row.key &&
        other.startDate &&
        other.endDate &&
        rangesOverlap(row.startDate, row.endDate, other.startDate, other.endDate)
    );
    if (overlap) {
      updateRow(row.key, {
        error: `Overlaps with ${overlap.startDate} → ${overlap.endDate}. Adjust the dates so periods don't share a night.`,
      });
      return;
    }

    updateRow(row.key, { saving: true, error: null });
    try {
      if (row.docId) {
        await updateDoc(doc(db, "Pricing", row.docId), {
          "start-date": row.startDate,
          "end-date": row.endDate,
          price,
        });
        updateRow(row.key, { saving: false });
      } else {
        const ref = await addDoc(collection(db, "Pricing"), {
          "start-date": row.startDate,
          "end-date": row.endDate,
          price,
        });
        updateRow(row.key, { saving: false, docId: ref.id });
      }
    } catch {
      updateRow(row.key, { saving: false, error: "Couldn't save this period. Please try again." });
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">Nightly Pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define the price per night for each date period. Periods can't overlap.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Add</th>
              <th className="whitespace-nowrap px-4 py-3">Start Date</th>
              <th className="whitespace-nowrap px-4 py-3">End Date</th>
              <th className="whitespace-nowrap px-4 py-3">Price / Night (€)</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No pricing periods yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.key} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => addRowAfter(index)}
                      aria-label="Add period below"
                      title="Add period below"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={(e) => updateRow(row.key, { startDate: e.target.value, error: null })}
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => updateRow(row.key, { endDate: e.target.value, error: null })}
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={row.price}
                      onChange={(e) => updateRow(row.key, { price: e.target.value, error: null })}
                      placeholder="0.00"
                      className="w-28 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {row.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <button
                            onClick={() => saveRow(row)}
                            aria-label="Save period"
                            title="Save"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-green-600/30 text-green-700 transition-smooth hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeRow(row)}
                            aria-label="Delete period"
                            title="Delete"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-smooth hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                    {row.error && (
                      <p className="mt-1 max-w-[220px] text-xs text-destructive">{row.error}</p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRowAtEnd}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-smooth hover:opacity-70"
      >
        <Plus className="h-4 w-4" /> Add Period
      </button>
    </div>
  );
}
