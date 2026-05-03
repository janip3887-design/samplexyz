import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Utensils, Calendar as CalendarIcon, Clock, Users } from "lucide-react";

const Dining = () => {
  const { user, signInWithGoogle } = useAuth();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: formData.get("guests"),
      preference: formData.get("preference"),
      dietary: formData.get("dietary") || "None",
      userId: user.uid,
      email: user.email,
      type: "dining",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "dining_bookings"), data);
      setStatus("success");
    } catch (error: any) {
      console.error("Error adding dining booking: ", error);
      setStatus("error");
      if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
        alert("Firestore permissions denied. Please update the rules to allow table bookings.");
      } else {
        alert("Failed to submit table booking. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-sand-200">
      <nav className="fixed top-0 w-full bg-sand-200/90 backdrop-blur-md z-50 border-b border-ink-800/10 py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="/" className="text-xl font-serif italic tracking-widest uppercase text-ink-800">
            Velmora
          </a>
          <a href="/" className="px-4 py-1.5 border border-ink-800/20 rounded-full text-[11px] uppercase tracking-[0.2em] text-ink-800 hover:bg-ink-800/5 transition-colors">
            Back to Home
          </a>
        </div>
      </nav>

      <div className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <Utensils className="mx-auto mb-6 text-ink-800" size={32} strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-serif text-ink-800 mb-4">Table Reservations</h1>
          <p className="text-sm text-ink-800/70 max-w-md mx-auto">
            Experience culinary excellence. Reserve your table at our signature restaurants.
          </p>
        </div>

        <div className="bg-sand-100 p-8 md:p-12 border border-ink-800/10 rounded-2xl shadow-sm">
          {!user ? (
            <div className="text-center py-12">
              <h2 className="font-serif text-2xl mb-4 text-ink-800">Sign in to Reserve</h2>
              <p className="text-sm text-ink-800/70 mb-8 max-w-sm mx-auto">
                Please sign in with your Google account to request a table reservation.
              </p>
              <button 
                onClick={signInWithGoogle} 
                className="px-8 py-3 bg-ink-800 text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ink-900 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : status === "success" ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full border border-ink-800/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-serif text-ink-800">V</span>
              </div>
              <h2 className="font-serif text-3xl mb-4 text-ink-800">Request Received</h2>
              <p className="text-sm text-ink-800/70 mb-8 max-w-sm mx-auto">
                Your table reservation request is pending confirmation. Our maitre d' will review your request and confirm shortly.
              </p>
              <button 
                onClick={() => setStatus("idle")} 
                className="px-8 py-3 border border-ink-800 text-ink-800 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ink-800/5 transition-colors"
              >
                New Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Name</label>
                  <input name="name" type="text" defaultValue={user.displayName || ""} className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 placeholder:text-ink-800/30" required disabled={status === "submitting"} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-800/40" size={16} />
                    <select name="guests" className="w-full bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer" required disabled={status === "submitting"}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="9+">9+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Date</label>
                  <div className="relative">
                    <input name="date" type="date" className="w-full bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 uppercase" required disabled={status === "submitting"} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Time</label>
                  <div className="relative">
                     <Clock className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-800/40 pointer-events-none" size={16} />
                    <select name="time" className="w-full bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer" required disabled={status === "submitting"}>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="9:30 PM">9:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Preference</label>
                  <select name="preference" className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer" disabled={status === "submitting"}>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">Dietary Choices</label>
                  <select name="dietary" className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer" disabled={status === "submitting"}>
                    <option value="None">Standard Options</option>
                    <option value="Jain">Jain Selection (No Root Vegetables)</option>
                    <option value="Swaminarayan">Swaminarayan Selection</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={status === "submitting"} className="w-full bg-ink-800 text-white py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ink-900 transition-colors mt-8 disabled:opacity-70 disabled:cursor-not-allowed">
                {status === "submitting" ? "Processing..." : "Submit Reservation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dining;
