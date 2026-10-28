import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePromoCodes, type PromoCode } from "@/hooks/usePromoCodes";

interface Row {
  key: string;
  docId: string | null; // null = not yet saved to Firestore
  code: string;
  percent: string;
  expirationDate: string;
  saving: boolean;
  error: string | null;
}

function promoCodesToRows(promoCodes: PromoCode[]): Row[] {
  return promoCodes.map((p) => ({
    key: p.id,
    docId: p.id,
    code: p.code,
    percent: String(p.percent),
    expirationDate: p.expirationDate,
    saving: false,
    error: null,
  }));
}

export default function PromoCodeManager() {
  const { promoCodes, loading, error } = usePromoCodes(true);
  const [rows, setRows] = useState<Row[]>([]);
  const nextKey = useRef(0);

  // Rebuild the local editable list from Firestore whenever it changes —
  // but only while there's nothing unsaved, so we don't clobber an
  // in-progress edit out from under the admin.
  useEffect(() => {
    const hasDraft = rows.some((r) => r.docId === null);
    if (hasDraft) return;
    setRows(promoCodesToRows(promoCodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoCodes]);

  function newRow(): Row {
    nextKey.current += 1;
    return {
      key: `draft-${nextKey.current}`,
      docId: null,
      code: "",
      percent: "",
      expirationDate: "",
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
        await deleteDoc(doc(db, "PromoCodes", row.docId));
      } catch {
        updateRow(row.key, { saving: false, error: "Couldn't delete this promo code." });
        return;
      }
    }
    setRows((current) => current.filter((r) => r.key !== row.key));
  }

  async function saveRow(row: Row) {
    const code = row.code.trim();
    if (!code) {
      updateRow(row.key, { error: "Enter a promo code." });
      return;
    }
    const percent = Number(row.percent);
    if (row.percent.trim() === "" || Number.isNaN(percent) || percent <= 0 || percent > 100) {
      updateRow(row.key, { error: "Enter a valid discount (1 to 100)." });
      return;
    }
    if (!row.expirationDate) {
      updateRow(row.key, { error: "Pick an expiration date." });
      return;
    }

    const duplicate = rows.find(
      (other) => other.key !== row.key && other.code.trim().toUpperCase() === code.toUpperCase()
    );
    if (duplicate) {
      updateRow(row.key, { error: `"${code}" is already in use. Codes must be unique.` });
      return;
    }

    updateRow(row.key, { saving: true, error: null });
    try {
      if (row.docId) {
        await updateDoc(doc(db, "PromoCodes", row.docId), {
          code,
          percent,
          "expiration-date": row.expirationDate,
        });
        updateRow(row.key, { saving: false, code });
      } else {
        const ref = await addDoc(collection(db, "PromoCodes"), {
          code,
          percent,
          "expiration-date": row.expirationDate,
        });
        updateRow(row.key, { saving: false, docId: ref.id, code });
      }
    } catch {
      updateRow(row.key, { saving: false, error: "Couldn't save this promo code. Please try again." });
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">Promo Codes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Codes guests can apply at booking for a percentage off. Expired codes no longer apply.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Add</th>
              <th className="whitespace-nowrap px-4 py-3">Code</th>
              <th className="whitespace-nowrap px-4 py-3">Discount (%)</th>
              <th className="whitespace-nowrap px-4 py-3">Expires</th>
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
                  No promo codes yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.key} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => addRowAfter(index)}
                      aria-label="Add promo code below"
                      title="Add promo code below"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.code}
                      onChange={(e) => updateRow(row.key, { code: e.target.value, error: null })}
                      placeholder="SUMMER10"
                      className="w-32 rounded-md border border-border bg-background px-2 py-1.5 text-sm uppercase outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      inputMode="numeric"
                      value={row.percent}
                      onChange={(e) => updateRow(row.key, { percent: e.target.value, error: null })}
                      placeholder="10"
                      className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.expirationDate}
                      onChange={(e) =>
                        updateRow(row.key, { expirationDate: e.target.value, error: null })
                      }
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-smooth focus:border-primary"
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
                            aria-label="Save promo code"
                            title="Save"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-green-600/30 text-green-700 transition-smooth hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeRow(row)}
                            aria-label="Delete promo code"
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
        <Plus className="h-4 w-4" /> Add Promo Code
      </button>
    </div>
  );
}
