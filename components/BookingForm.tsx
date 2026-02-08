"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";

export default function BookingForm() {
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
        process.env.NEXT_PUBLIC_FORMSPREE_BOOKING_FORM ||
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="input-field"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input-field"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-bold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="input-field"
          placeholder="(123) 456-7890"
        />
      </div>

      {/* Event Date & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="eventDate" className="block text-sm font-bold mb-2">
            Event Date *
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            required
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="eventType" className="block text-sm font-bold mb-2">
            Event Type *
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            className="input-field"
          >
            <option value="">Select event type</option>
            <option value="club">Club Night</option>
            <option value="festival">Festival</option>
            <option value="private">Private Party</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Budget Range & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-bold mb-2">
            Budget Range
          </label>
          <select id="budget" name="budget" className="input-field">
            <option value="">Select budget range</option>
            <option value="under-500">Under $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-5000">$2,000 - $5,000</option>
            <option value="5000+">$5,000+</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-bold mb-2">
            Event Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="input-field"
            placeholder="New Orleans, LA"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-bold mb-2">
          Additional Details *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input-field resize-none"
          placeholder="Tell me about your event, guest count, venue details, and any special requests..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Inquiry
          </>
        )}
      </button>

      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-neon-green/20 border border-neon-green rounded-lg text-neon-green text-center font-bold">
          ✓ Thanks! I'll get back to you within 24-48 hours.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}
    </form>
  );
}
