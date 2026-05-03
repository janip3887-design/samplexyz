import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Check, X, Plus, Calendar, ArrowUpDown } from "lucide-react";

const ADMIN_EMAIL = "pranavrjani958@gmail.com";

const Admin = () => {
  const { user, signInWithEmail, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [diningBookings, setDiningBookings] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<"rooms" | "dining">("rooms");
  const [diningSortConfig, setDiningSortConfig] = useState<{
    key: "date" | "status" | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchBookings();
      fetchDiningBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setBookings(data);
    } catch (error: any) {
      console.error("Error fetching bookings", error);
      alert("Error fetching bookings: " + error.message);
    }
  };

  const fetchDiningBookings = async () => {
    try {
      const q = query(
        collection(db, "dining_bookings")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setDiningBookings(data);
    } catch (error: any) {
      console.error("Error fetching dining bookings", error);
      alert("Error fetching dining bookings: " + error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (e) {
      // Error is handled in context
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string, isDining = false) => {
    try {
      await updateDoc(doc(db, isDining ? "dining_bookings" : "bookings", id), {
        status,
      });
      
      let bookingDetails;
      if (isDining) {
        bookingDetails = diningBookings.find((b) => b.id === id);
        fetchDiningBookings();
      } else {
        bookingDetails = bookings.find((b) => b.id === id);
        fetchBookings();
      }

      if (bookingDetails && bookingDetails.email) {
        const subject = encodeURIComponent(
          `Velmora Grand Palace: Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`
        );
        let body = "";
        
        if (isDining) {
          body = `Dear ${bookingDetails.name},\n\nYour dining reservation for ${bookingDetails.guests} guest(s) on ${bookingDetails.date} at ${bookingDetails.time} has been ${status}.\n\nThank you,\nVelmora Grand Palace`;
        } else {
          body = `Dear ${bookingDetails.name},\n\nYour room booking for a ${bookingDetails.suite} from ${bookingDetails.checkIn} to ${bookingDetails.checkOut} has been ${status}.\n\nThank you,\nVelmora Grand Palace`;
        }
        
        window.location.href = `mailto:${bookingDetails.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  const handleAddBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
      guests: formData.get("guests"),
      suite: formData.get("suite"),
      requests: formData.get("requests") || "",
      userId: "admin-created",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "bookings"), data);
      setShowAdd(false);
      fetchBookings();
      alert("Booking added successfully");
    } catch (error) {
      console.error("Error adding", error);
      alert("Failed to add booking");
    }
  };

  const sortedDiningBookings = [...diningBookings].sort((a, b) => {
    if (diningSortConfig.key === "date") {
      const dateA = new Date(`${a.date} ${a.time}`).getTime() || 0;
      const dateB = new Date(`${b.date} ${b.time}`).getTime() || 0;
      return diningSortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (diningSortConfig.key === "status") {
      const statusA = a.status || "";
      const statusB = b.status || "";
      return diningSortConfig.direction === "asc" ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
    }
    return 0;
  });

  const handleSort = (key: "date" | "status") => {
    let direction: "asc" | "desc" = "asc";
    if (diningSortConfig.key === key && diningSortConfig.direction === "asc") {
      direction = "desc";
    }
    setDiningSortConfig({ key, direction });
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-ink-800/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-ink-800 italic">Velmora</h1>
            <p className="text-[10px] uppercase tracking-widest text-sand-800 mt-2">
              Admin Portal
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sand-800">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-ink-800/20 py-2 bg-transparent text-ink-800 focus:outline-none focus:border-ink-800"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-sand-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-ink-800/20 py-2 bg-transparent text-ink-800 focus:outline-none focus:border-ink-800"
                required
              />
            </div>
            {user && user.email !== ADMIN_EMAIL && (
              <p className="text-xs text-red-600 mt-2">
                You are signed in as {user.email}, which is not an admin
                account. Please sign out and sign in with an admin account.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-800 text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-ink-900 transition-colors mt-4"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            {user && (
              <button
                type="button"
                onClick={logout}
                className="w-full border border-ink-800/20 text-ink-800 py-3 text-xs uppercase tracking-widest font-medium hover:bg-ink-800/5 transition-colors mt-2"
              >
                Sign Out
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 p-6 md:p-12 text-ink-800">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-ink-800/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-serif">Admin Dashboard</h1>
            <p className="text-[11px] uppercase tracking-widest text-sand-800 mt-2">
              Manage Reservations
            </p>
          </div>
          <div className="flex gap-4">
            {activeTab === "rooms" && (
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="px-6 py-2 border border-ink-800 text-ink-800 rounded-full text-xs uppercase tracking-widest hover:bg-ink-800 hover:text-white transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> New Booking
              </button>
            )}
            <button
              onClick={logout}
              className="px-6 py-2 border border-ink-800/20 text-ink-800 rounded-full text-xs uppercase tracking-widest hover:bg-ink-800/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${
              activeTab === "rooms"
                ? "bg-ink-800 text-white"
                : "border border-ink-800 text-ink-800"
            }`}
          >
            Room Bookings
          </button>
          <button
            onClick={() => setActiveTab("dining")}
            className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${
              activeTab === "dining"
                ? "bg-ink-800 text-white"
                : "border border-ink-800 text-ink-800"
            }`}
          >
            Dining Reservations
          </button>
        </div>

        {activeTab === "rooms" && showAdd && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-ink-800/10 mb-12">
            <h2 className="text-2xl font-serif mb-6">Add New Booking</h2>
            <form
              onSubmit={handleAddBooking}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Full Name
                </label>
                <input
                  name="name"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Check In
                </label>
                <input
                  name="checkIn"
                  type="date"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Check Out
                </label>
                <input
                  name="checkOut"
                  type="date"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Guests
                </label>
                <select
                  name="guests"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4+">4+ Guests</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-sand-800">
                  Suite Preference
                </label>
                <select
                  name="suite"
                  className="w-full border-b border-ink-800/20 py-2 focus:outline-none"
                >
                  <option value="Deluxe Heritage Room">
                    Deluxe Heritage Room
                  </option>
                  <option value="Royal Courtyard Suite">
                    Royal Courtyard Suite
                  </option>
                  <option value="Maharaja Presidential Suite">
                    Maharaja Presidential Suite
                  </option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-ink-800 text-white text-[11px] uppercase tracking-widest hover:bg-ink-900 transition-colors"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {activeTab === "rooms" ? (
            <>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-6 rounded-xl border border-ink-800/10 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                        Guest
                      </p>
                      <p className="text-sm font-medium">{booking.name}</p>
                      <p className="text-xs text-ink-800/60 break-all">
                        {booking.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                        Stay
                      </p>
                      <p className="text-xs flex flex-col gap-1">
                        <span>In: {booking.checkIn}</span>
                        <span>Out: {booking.checkOut}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                        Details
                      </p>
                      <p className="text-xs">{booking.guests} Guests</p>
                      <p className="text-xs truncate" title={booking.suite}>
                        {booking.suite}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-2">
                        Status
                      </p>
                      <span
                        className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                          booking.status === "confirmed"
                            ? "border-green-600/30 text-green-800 bg-green-500/10"
                            : booking.status === "cancelled"
                              ? "border-red-600/30 text-red-800 bg-red-500/10"
                              : "border-amber-600/30 text-amber-800 bg-amber-500/10"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 justify-center">
                    {booking.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(booking.id, "confirmed", false)}
                        className="flex-1 md:flex-none px-4 py-2 bg-ink-800 text-white text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-ink-900 transition-colors"
                      >
                        <Check size={12} /> Confirm
                      </button>
                    )}
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(booking.id, "cancelled", false)}
                        className="flex-1 md:flex-none px-4 py-2 border border-ink-800/20 text-ink-800 text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-ink-800/5 transition-colors"
                      >
                        <X size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-24 text-ink-800/50">
                  <Calendar className="mx-auto mb-4 opacity-50" size={32} />
                  <p>No room bookings found.</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-ink-800/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-sand-100 border-b border-ink-800/10 text-[10px] uppercase tracking-widest text-sand-800">
                      <th className="p-4 font-normal">Guest Name</th>
                      <th className="p-4 font-normal">Email</th>
                      <th className="p-4 font-normal cursor-pointer hover:bg-sand-200 transition-colors group" onClick={() => handleSort('date')}>
                        <div className="flex items-center gap-1">
                          Date & Time
                          <ArrowUpDown size={12} className={`opacity-50 group-hover:opacity-100 ${diningSortConfig.key === 'date' ? 'text-ink-800 opacity-100' : ''}`} />
                        </div>
                      </th>
                      <th className="p-4 font-normal">Guests</th>
                      <th className="p-4 font-normal">Preference</th>
                      <th className="p-4 font-normal">Dietary Choices</th>
                      <th className="p-4 font-normal cursor-pointer hover:bg-sand-200 transition-colors group" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown size={12} className={`opacity-50 group-hover:opacity-100 ${diningSortConfig.key === 'status' ? 'text-ink-800 opacity-100' : ''}`} />
                        </div>
                      </th>
                      <th className="p-4 font-normal text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800/10">
                    {sortedDiningBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-sand-50 transition-colors text-sm">
                        <td className="p-4 font-medium">{booking.name}</td>
                        <td className="p-4 text-xs text-ink-800/80">{booking.email || 'No email'}</td>
                        <td className="p-4 text-xs">
                          <div className="flex flex-col">
                            <span>{booking.date}</span>
                            <span className="text-ink-800/60">{booking.time}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs">{booking.guests}</td>
                        <td className="p-4 text-xs">{booking.preference}</td>
                        <td className="p-4 text-xs text-ink-800/80">{booking.dietary}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-sm whitespace-nowrap ${
                              booking.status === "confirmed"
                                ? "border-green-600/30 text-green-800 bg-green-500/10"
                                : booking.status === "cancelled"
                                  ? "border-red-600/30 text-red-800 bg-red-500/10"
                                  : "border-amber-600/30 text-amber-800 bg-amber-500/10"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            {booking.status !== "confirmed" && (
                              <button
                                onClick={() => updateStatus(booking.id, "confirmed", true)}
                                className="px-3 py-1.5 bg-ink-800 text-white text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-ink-900 transition-colors rounded-sm shadow-sm"
                                title="Confirm"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button
                                onClick={() => updateStatus(booking.id, "cancelled", true)}
                                className="px-3 py-1.5 border border-ink-800/20 text-ink-800 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-ink-800/5 transition-colors rounded-sm"
                                title="Cancel"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {diningBookings.length === 0 && (
                <div className="text-center py-24 text-ink-800/50">
                  <Calendar className="mx-auto mb-4 opacity-50" size={32} />
                  <p>No dining reservations found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
