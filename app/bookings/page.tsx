import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { Music2, Calendar, DollarSign, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Book DJ Jade | DJ Jade the Gem",
  description:
    "Book DJ Jade the Gem for your club night, festival, private party, or corporate event. Professional DJ services in New Orleans and beyond.",
};

export default function BookingsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Book DJ Jade</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elevate your event with electrifying energy and fire mixes.
            Available for clubs, festivals, private parties, and corporate
            events.
          </p>
        </div>

        {/* What I Offer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="glass-card text-center">
            <Music2 className="w-12 h-12 text-neon-green mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Club Events</h3>
            <p className="text-gray-400 text-sm">
              Nightclub residencies and guest sets
            </p>
          </div>
          <div className="glass-card text-center">
            <Calendar className="w-12 h-12 text-neon-purple mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Festivals</h3>
            <p className="text-gray-400 text-sm">
              Music festivals and outdoor events
            </p>
          </div>
          <div className="glass-card text-center">
            <DollarSign className="w-12 h-12 text-neon-gold mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Private Parties</h3>
            <p className="text-gray-400 text-sm">
              Weddings, birthdays, and celebrations
            </p>
          </div>
          <div className="glass-card text-center">
            <MapPin className="w-12 h-12 text-neon-green mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Corporate Events</h3>
            <p className="text-gray-400 text-sm">
              Brand activations and company parties
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-display text-neon-green mb-2">
            Get a Quote
          </h2>
          <p className="text-gray-400 mb-8">
            Fill out the form below and I'll get back to you within 24-48 hours
          </p>
          <BookingForm />
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card">
            <h3 className="text-2xl font-display text-neon-purple mb-4">
              What's Included
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-neon-green mr-2">✓</span>
                Professional DJ equipment and setup
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">✓</span>
                Custom playlist tailored to your event
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">✓</span>
                MC services and announcements
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">✓</span>
                Professional sound system
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-2">✓</span>
                Pre-event consultation
              </li>
            </ul>
          </div>

          <div className="glass-card">
            <h3 className="text-2xl font-display text-neon-purple mb-4">
              Booking Process
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-neon-green mr-3 font-bold">1.</span>
                Submit the booking inquiry form
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-3 font-bold">2.</span>
                Receive a custom quote within 48 hours
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-3 font-bold">3.</span>
                Schedule a consultation call
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-3 font-bold">4.</span>
                Sign contract and pay deposit
              </li>
              <li className="flex items-start">
                <span className="text-neon-green mr-3 font-bold">5.</span>
                Get ready to experience the energy!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
