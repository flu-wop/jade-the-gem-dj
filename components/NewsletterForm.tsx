"use client";

import { useState, FormEvent } from "react";
import { Mail } from "lucide-react";

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_FORM ||
          "https://formspree.io/f/YOUR_FORM_ID",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-neon-green/20 border-2 border-neon-green rounded-lg text-center">
        <p className="text-neon-green font-bold text-lg">
          ✓ You're on the list! Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="input-field pl-12 w-full"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
