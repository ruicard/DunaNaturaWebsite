import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCleaningFee } from "@/hooks/useCleaningFee";

export default function SettingsManager() {
  const { cleaningFee, loading, error } = useCleaningFee(true);
  const [value, setValue] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (dirty) return;
    setValue(cleaningFee !== null ? String(cleaningFee) : "");
  }, [cleaningFee, dirty]);

  async function save() {
    const parsed = Number(value);
    if (value.trim() === "" || Number.isNaN(parsed) || parsed < 0) {
      setSaveError("Enter a valid fee (0 or more).");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await setDoc(doc(db, "Settings", "general"), { "cleaning-fee": parsed }, { merge: true });
      setDirty(false);
    } catch {
      setSaveError("Couldn't save the cleaning fee. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">Booking Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Extra charges applied to every booking.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="flex max-w-sm items-end gap-3 rounded-lg border border-border p-4">
        <div className="flex-1">
          <label
            htmlFor="cleaning-fee"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Cleaning Fee (€)
          </label>
          <input
            id="cleaning-fee"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={value}
            disabled={loading}
            onChange={(e) => {
              setValue(e.target.value);
              setDirty(true);
              setSaveError(null);
            }}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-smooth focus:border-primary"
          />
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          aria-label="Save cleaning fee"
          title="Save"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-green-600/30 text-green-700 transition-smooth hover:bg-green-50 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
      </div>
      {saveError && <p className="mt-2 text-xs text-destructive">{saveError}</p>}
    </div>
  );
}
