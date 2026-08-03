"use client";

import { useState, FormEvent } from "react";
import { Mail, Loader2 } from "lucide-react";

interface Props {
  /** Button label override */
  cta?: string;
}

export default function NewsletterForm({ cta = "Notify Me" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl bg-neon-green/10 border border-neon-green/30 px-6 py-5 text-center text-neon-green font-bold text-sm">
        ✓ You're on the list! Watch your inbox. 🔥
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="field pl-10"
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            cta
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400 text-center">
          Something went wrong — try again or DM @jluhvv
        </p>
      )}
      <p className="mt-2 text-[11px] text-white/30 text-center">
        We&apos;ll only use this to send updates. <a href="/privacy" className="underline-offset-2 hover:underline">Privacy policy</a>
      </p>
    </form>
  );
}
