"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Save, CheckCircle } from "lucide-react";

type ProfilePanelProps = {
  user: {
    id: string;
    email: string;
    full_name: string;
  };
};

export function ProfilePanel({ user }: ProfilePanelProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = (user.full_name || user.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSave = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fade-up mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-xl font-semibold text-cream">
          {initials}
        </div>
        <div>
          <h2 className="text-3xl">{user.full_name || "Your Profile"}</h2>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <div className="panel space-y-5 p-6">
        <p className="label-mono text-xs text-muted">Account Details</p>

        <label className="block text-sm font-medium">
          <span className="mb-1 flex items-center gap-1.5">
            <User size={13} /> Full name
          </span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        <label className="block text-sm font-medium opacity-60">
          <span className="mb-1 flex items-center gap-1.5">
            <Mail size={13} /> Email address
          </span>
          <input
            value={user.email}
            disabled
            className="mt-1 w-full cursor-not-allowed rounded-md border border-oat bg-paper px-3 py-2 text-muted"
          />
          <p className="mt-1 text-xs text-muted">Email cannot be changed here.</p>
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          onClick={onSave}
          disabled={saving || !fullName.trim() || fullName === user.full_name}
          className="btn btn-primary flex items-center gap-2 border border-ink px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saved ? (
            <>
              <CheckCircle size={15} /> Saved
            </>
          ) : (
            <>
              <Save size={15} /> {saving ? "Saving…" : "Save changes"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
