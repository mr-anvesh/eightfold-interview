"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthPanel() {
  const router = useRouter();
  const getSupabase = () => getSupabaseBrowserClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || "Signup failed.");
        }

        const { error: signInError } = await getSupabase().auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      } else {
        const { error: signInError } = await getSupabase().auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="label-mono text-xs text-muted">Authentication</p>
        <h2 className="text-4xl">{mode === "signin" ? "Welcome back" : "Create account"}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`btn border px-4 py-2 text-sm font-semibold ${
            mode === "signin" ? "btn-primary border-ink" : "btn-outline"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`btn border px-4 py-2 text-sm font-semibold ${
            mode === "signup" ? "btn-primary border-ink" : "btn-outline"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" ? (
          <label className="block text-sm">
            Full Name
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
            />
          </label>
        ) : null}

        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        <label className="block text-sm">
          Password
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-fin w-full border border-fin px-4 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
