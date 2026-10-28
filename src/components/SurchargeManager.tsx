import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSurcharges, type Surcharge } from "@/hooks/useSurcharges";

interface Row {
  key: string;
  docId: string | null; // null = not yet saved to Firestore
  nights: string;
  percent: string;
  saving: boolean;
  error: string | null;
}

function surchargesToRows(surcharges: Surcharge[]): Row[] {
  return surcharges.map((s) => ({
    key: s.id,
    docId: s.id,
    nights: String(s.nights),
    percent: String(s.percent),
    saving: false,
    error: null,
  }));
}

export default function SurchargeManager() {
  const { surcharges, loading, error } = useSurcharges(true);
  const [rows, setRows] = useState<Row[]>([]);
  const nextKey = useRef(0);

  // Rebuild the local editable list from Firestore whenever it changes —
  // but only while there's nothing unsaved, so we don't clobber an
  // in-progress edit out from under the admin.
  useEffect(() => {
    const hasDraft = rows.some((r) => r.docId === null);
    if (hasDraft) return;
    setRows(surchargesToRows(surcharges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surcharges]);

  function newRow(): Row {
    nextKey.current += 1;
    return {
      key: `draft-${nextKey.current}`,
      docId: null,
      nights: "",
      percent: "",
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
        await deleteDoc(doc(db, "Surcharges", row.docId));
      } catch {
        updateRow(row.key, { saving: false, error: "Couldn't delete this surcharge." });
        return;
      }
    }
    setRows((current) => current.filter((r) => r.key !== row.key));
  }

  async function saveRow(row: Row) {
    const nights = Number(row.nights);
    if (row.nights.trim() === "" || !Number.isInteger(nights) || nights < 1) {
      updateRow(row.key, { error: "Enter a valid number of nights (1 or more)." });
      return;
    }
    const percent = Number(row.percent);
    if (row.percent.trim() === "" || Number.isNaN(percent) || percent < 0) {
      updateRow(row.key, { error: "Enter a valid surcharge (0 or more)." });
      return;
    }

    const duplicate = rows.find((other) => other.key !== row.key && Number(other.nights) === nights);
    if (duplicate) {
      updateRow(row.key, { error: `${nights} night${nights !== 1 ? "s" : ""} already has a surcharge defined.` });
      return;
    }

    updateRow(row.key, { saving: true, error: null });
    try {
      if (row.docId) {
        await updateDoc(doc(db, "Surcharges", row.docId), { nights, percent });
        updateRow(row.key, { saving: false });
      } else {
        const ref = await addDoc(collection(db, "Surcharges"), { nights, percent });
        updateRow(row.key, { saving: false, docId: ref.id });
      }
    } catch {
      updateRow(row.key, { saving: false, error: "Couldn't save this surcharge. Please try again." });
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">Short-Stay Surcharges</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Extra percentage added on top of the nightly price for stays of a given length. Stay
          lengths with no row defined get no surcharge.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Add</th>
              <th className="whitespace-nowrap px-4 py-3">Nights</th>
              <th className="whitespace-nowrap px-4 py-3">Surcharge (%)</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No surcharges yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.key} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => addRowAfter(index)}
                      aria-label="Add surcharge below"
                      title="Add surcharge below"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={row.nights}
                      onChange={(e) => updateRow(row.key, { nights: e.target.value, error: null })}
                      placeholder="1"
                      className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={row.percent}
                      onChange={(e) => updateRow(row.key, { percent: e.target.value, error: null })}
                      placeholder="0"
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
                            aria-label="Save surcharge"
                            title="Save"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-green-600/30 text-green-700 transition-smooth hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeRow(row)}
                            aria-label="Delete surcharge"
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
        <Plus className="h-4 w-4" /> Add Surcharge
      </button>
    </div>
  );
}
