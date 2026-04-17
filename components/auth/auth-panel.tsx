"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

function getAuthRedirectUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = siteUrl && siteUrl.length > 0 ? siteUrl : window.location.origin;

  return `${baseUrl.replace(/\/$/, "")}/auth`;
}

export function AuthPanel() {
  const router = useRouter();
  const getSupabase = () => getSupabaseBrowserClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await getSupabase().auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          await getSupabase().from("users").upsert({
            id: data.user.id,
            email,
            full_name: fullName,
          });
        }

        if (!data.session) {
          setMessage("Account created. If email confirmation is enabled, check your inbox.");
          return;
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
        {message ? <p className="text-sm text-leaf">{message}</p> : null}

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
