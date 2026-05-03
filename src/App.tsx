import { motion, useScroll, useTransform } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  Star,
  Coffee,
  Wine,
  Waves,
  Dumbbell,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-ink-800/10 ${
        scrolled
          ? "bg-sand-100/95 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center text-ink-800">
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
          <a href="#stay" className="hover:opacity-50 transition-opacity">
            Stay
          </a>
          <a href="#dining" className="hover:opacity-50 transition-opacity">
            Dining
          </a>
          <a href="#wellness" className="hover:opacity-50 transition-opacity">
            Wellness
          </a>
          <a
            href="#experiences"
            className="hover:opacity-50 transition-opacity"
          >
            Experiences
          </a>
        </div>
        <div className="text-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-serif italic tracking-widest uppercase">
            Velmora
          </h1>
          <p className="text-[9px] uppercase tracking-[0.4em] -mt-1 hidden md:block">
            Grand Palace & Spa
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <AuthProfile />
          <a
            href="/dining"
            className="hidden sm:inline-block px-4 py-1.5 border border-transparent rounded-full text-[11px] uppercase tracking-[0.2em] hover:text-ink-800 transition-colors duration-300"
          >
            Dining
          </a>
          <a
            href="#booking"
            className="hidden sm:inline-block px-4 py-1.5 border border-ink-800 rounded-full text-[11px] uppercase tracking-[0.2em] hover:bg-ink-800 hover:text-white transition-colors duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  );
};

const AuthProfile = () => {
  const { user, logout, signInWithGoogle } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-ink-800/20"
            referrerPolicy="no-referrer"
          />
        )}
        <button
          onClick={logout}
          className="text-[10px] uppercase tracking-widest text-ink-800/60 hover:text-ink-800 transition-colors hidden md:block"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return null;
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[100svh] pt-32 w-full bg-sand-100 overflow-hidden flex flex-col border-b border-ink-800/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-ink-800/5 rounded-full" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-[1400px] mx-auto relative z-10 items-stretch">
        <div className="lg:col-span-5 px-6 md:px-12 py-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-sand-800 mb-6 block">
              Udaipur, Rajasthan
            </span>
            <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] mb-8 text-ink-800">
              Where <span className="italic">Royalty</span> Meets <br />
              <span className="ml-12">Timeless</span> Luxury
            </h2>
            <p className="text-sm leading-relaxed text-ink-800/70 max-w-sm mb-10 border-l border-ink-800 pl-6">
              An ultra-luxury boutique palace blending royal Rajasthani
              architecture with modern elegance. Perched on Sunset Ridge Road,
              overlooking the mystical Aravalli Hills.
            </p>
            <div className="space-y-4">
              <div className="flex items-end gap-6 group cursor-pointer">
                <span className="text-3xl font-serif text-ink-800">01</span>
                <div className="pb-1">
                  <p className="text-[10px] uppercase tracking-wider text-sand-800">
                    The Crown Jewel
                  </p>
                  <p className="text-lg font-medium text-ink-800">
                    Maharaja Suite
                  </p>
                </div>
                <span className="ml-auto text-sm font-serif italic text-ink-800/80 hidden sm:block">
                  ₹75,000 / night
                </span>
              </div>
              <div className="h-[1px] bg-ink-800/10 w-full group-hover:bg-ink-800/20 transition-colors"></div>
              <div className="flex items-end gap-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-3xl font-serif text-ink-800">02</span>
                <div className="pb-1">
                  <p className="text-[10px] uppercase tracking-wider text-sand-800">
                    Courtyard View
                  </p>
                  <p className="text-lg font-medium text-ink-800">
                    Royal Courtyard Suite
                  </p>
                </div>
                <span className="ml-auto text-sm font-serif italic text-ink-800/80 hidden sm:block">
                  ₹32,000 / night
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 relative bg-sand-200/50 flex items-center justify-center overflow-hidden p-6 lg:p-0">
          <div className="absolute inset-0 bg-black/5"></div>
          <motion.div
            style={{ y, opacity }}
            className="w-full lg:w-4/5 h-[60vh] lg:h-[85%] rounded-t-full border border-ink-800/20 overflow-hidden relative shadow-2xl bg-sand-300 flex items-center justify-center text-ink-800/70 p-12 text-center"
          >
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80"
              alt="Palace exterior at sunset"
              className="w-full h-full object-cover absolute inset-0 z-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-8 bg-white/90 backdrop-blur px-6 py-4 rounded-full border border-ink-800/10 flex items-center gap-4 whitespace-nowrap min-w-max z-10">
              <div className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-tighter text-ink-800/70">
                  Explore Nearby
                </p>
                <p className="text-xs font-bold text-ink-800">
                  Lake View & Heritage Sites
                </p>
              </div>
            </div>
          </motion.div>
          <div className="absolute top-24 -left-12 rotate-90 hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.8em] font-light text-ink-800/40">
              Established in the heart of Aravalli
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Introduction = () => {
  return (
    <section className="py-24 md:py-32 bg-sand-100 border-b border-ink-800/10 relative">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance text-ink-800 mb-8 italic">
            "A seamless blend of regal heritage and absolute modern serenity."
          </h2>
          <p className="font-sans text-ink-800/60 text-sm max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
            — Experience Velmora Grand Palace
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

const Stay = () => {
  const rooms = [
    {
      name: "Deluxe Heritage Room",
      price: "₹18,500",
      description:
        "Garden view, king-size bed, luxurious marble bathroom with authentic heritage detailing.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80",
    },
    {
      name: "Royal Courtyard Suite",
      price: "₹32,000",
      description:
        "Private balcony framing courtyard views, separate living area, and opulent bespoke interiors.",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
    },
    {
      name: "Maharaja Presidential Suite",
      price: "₹75,000",
      description:
        "The pinnacle of luxury. Private plunge pool, dedicated 24/7 butler service, and panoramic Aravalli lake views.",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section id="stay" className="py-24 bg-sand-100 border-b border-ink-800/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.3em] text-sand-800 mb-6">
              Accommodations
            </h3>
            <h2 className="font-serif text-5xl md:text-7xl text-ink-800">
              Rest in <span className="italic">Splendor</span>
            </h2>
          </div>
          <p className="text-sm text-ink-800/60 max-w-sm text-balance border-l border-ink-800/20 pl-6">
            Spacious suites and rooms curated with timeless art and plush
            perfection for your supreme comfort.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {rooms.map((room, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="group cursor-pointer flex flex-col h-full">
                <div className="overflow-hidden rounded-t-full aspect-[3/4] mb-8 relative border border-ink-800/10 shadow-sm">
                  <div className="absolute inset-0 bg-ink-800/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-start justify-between mb-4 border-b border-ink-800/10 pb-4">
                  <h4 className="font-serif text-2xl text-ink-800 pr-4">
                    {room.name}
                  </h4>
                  <span className="text-sm font-serif italic text-ink-800 min-w-max pt-1">
                    {room.price}
                  </span>
                </div>
                <p className="text-sm text-ink-800/70 mb-6 flex-1">
                  {room.description}
                </p>
                <div className="flex items-center text-[10px] uppercase tracking-widest font-medium text-ink-800 gap-2 group-hover:gap-4 transition-all pb-6">
                  <span>Explore Suite</span> <ArrowRight size={14} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
const Dining = () => {
  return (
    <section
      id="dining"
      className="py-24 bg-sand-100 border-b border-ink-800/10 text-ink-800"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <FadeIn className="text-center mb-24">
          <h3 className="text-[11px] font-sans uppercase tracking-[0.3em] text-sand-800 mb-6">
            Culinary Excellence
          </h3>
          <h2 className="font-serif text-5xl md:text-7xl">
            Taste of <span className="italic opacity-90">Royalty</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
          <FadeIn className="order-2 lg:order-1">
            <h4 className="font-serif text-4xl mb-4">The Saffron Ember</h4>
            <p className="text-[11px] uppercase tracking-[0.2em] mb-8 text-sand-800">
              Fine Dining • Indian Royal & Fusion
            </p>
            <p className="text-sm leading-relaxed text-ink-800/70 mb-8 border-l border-ink-800/30 pl-6">
              Experience the pinnacle of royal Indian cuisine tailored to modern
              palates. Our master chefs prepare century-old recipes in a
              majestic setting.
            </p>
            <div className="bg-sand-200/50 p-6 border border-ink-800/10 mb-10">
              <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-2">
                Signature Dishes
              </p>
              <p className="text-sm font-serif italic text-ink-800">
                Dum Pukht Biryani & Truffle Butter Naan
              </p>
            </div>
            <a
              href="#booking"
              className="inline-block px-6 py-3 border border-ink-800 rounded-full text-[10px] uppercase tracking-widest font-medium hover:bg-ink-800 hover:text-white transition-all text-ink-800"
            >
              Reserve a Table
            </a>
          </FadeIn>
          <FadeIn className="order-1 lg:order-2 h-[500px] md:h-[600px] arch-mask overflow-hidden border border-ink-800/20 shadow-sm relative">
            <img
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80"
              alt="Fine Dining"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-ink-800/10 pt-16 mt-16">
          <FadeIn delay={0.1}>
            <div className="aspect-[16/9] overflow-hidden mb-6 border border-ink-800/10 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
                alt="The Velvet Bar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="font-serif text-3xl mb-3">The Velvet Bar</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-4 text-sand-800">
              Premium Cocktails & Curated Spirits
            </p>
            <p className="text-sm text-ink-800/70 border-l border-ink-800/20 pl-4">
              A sophisticated escape offering rare malts, vintage cigars, and
              handcrafted cocktails.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="aspect-[16/9] overflow-hidden mb-6 border border-ink-800/10 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"
                alt="Azure Lounge"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="font-serif text-3xl mb-3">Azure Lounge</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-4 text-sand-800">
              Rooftop Dining • Continental & Mediterranean
            </p>
            <p className="text-sm text-ink-800/70 border-l border-ink-800/20 pl-4">
              Breathtaking lake views meet extraordinary international cuisine
              under the stars.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Wellness = () => {
  const amenities = [
    {
      icon: <Waves size={20} strokeWidth={1} />,
      title: "Infinity Pool",
      desc: "Overlooking the stunning Aravalli hills",
    },
    {
      icon: <Coffee size={20} strokeWidth={1} />,
      title: "Luxury Spa",
      desc: "Holistic wellness & ancient therapies",
    },
    {
      icon: <Dumbbell size={20} strokeWidth={1} />,
      title: "Fitness Center",
      desc: "Fully equipped modern gymnasium",
    },
    {
      icon: <Wine size={20} strokeWidth={1} />,
      title: "Private Dining",
      desc: "Curated intimate culinary journeys",
    },
  ];

  const experiences = [
    "Candlelight dinner setups",
    "Cultural folk performances",
    "Guided heritage tours",
    "Yoga & wellness sessions",
    "Destination wedding planning",
  ];

  return (
    <section
      id="wellness"
      className="py-24 bg-sand-100 border-b border-ink-800/10 relative"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <FadeIn>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.3em] text-sand-800 mb-6">
              Wellness & Amenities
            </h3>
            <h2 className="font-serif text-5xl md:text-6xl text-ink-800 mb-12">
              Rejuvenate the <br />
              <span className="italic">Senses</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 mb-12">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-6 items-start border-b border-ink-800/10 pb-6"
                >
                  <div className="text-ink-800 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-serif text-2xl mb-1 text-ink-800">
                      {item.title}
                    </h4>
                    <p className="text-sm text-ink-800/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-7 pl-0 lg:pl-12">
          <FadeIn className="relative h-[600px] rounded-t-full border border-ink-800/20 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-153756526675b-34ad6796c827?auto=format&fit=crop&q=80"
              alt="Infinity Pool & Spa"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ink-800/10" />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 min-w-[320px] bg-white/95 backdrop-blur-md px-8 py-8 rounded-t-full border border-ink-800/10 shadow-lg">
              <h4 className="font-serif text-2xl mb-6 text-ink-800 text-center">
                Curated Experiences
              </h4>
              <ul className="space-y-4">
                {experiences.map((exp, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 text-xs tracking-wider uppercase text-ink-800/80"
                  >
                    <span className="w-1 h-1 rounded-full bg-ink-800/30" />
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const BookingSection = () => {
  const { user, signInWithGoogle } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "pending" | "cancelled" | "loading"
  >("loading");
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStatus("idle");
      return;
    }

    const fetchBooking = async () => {
      setStatus("loading");
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);

        let latestBooking = null;
        let latestId = null;
        let latestTime = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const time = data.createdAt?.toMillis() || 0;
          if (time > latestTime) {
            latestTime = time;
            latestBooking = data;
            latestId = doc.id;
          }
        });

        if (latestBooking) {
          setBookingData(latestBooking);
          setBookingId(latestId);
          setStatus(latestBooking.status); // 'pending' or 'cancelled' or 'active' etc
        } else {
          setStatus("idle");
        }
      } catch (error: any) {
        console.error("Error fetching booking: ", error);
        if (
          error.code === "permission-denied" ||
          error.message?.includes("Missing or insufficient permissions")
        ) {
          alert(
            "Firestore permissions denied. Please copy the rules from the firestore.rules file and paste them into your Firebase Console under Firestore Database -> Rules.",
          );
        }
        setStatus("idle");
      }
    };

    fetchBooking();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
      guests: formData.get("guests"),
      suite: formData.get("suite"),
      requests: formData.get("requests"),
      userId: user.uid,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), data);
      setBookingId(docRef.id);
      setBookingData(data);
      setStatus("pending");
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setStatus("idle");
      if (
        error.code === "permission-denied" ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        alert(
          "Firestore permissions denied. Please copy the rules from the firestore.rules file and paste them into your Firebase Console under Firestore Database -> Rules.",
        );
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    }
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "cancelled",
      });
      setStatus("cancelled");
    } catch (error: any) {
      console.error("Error cancelling document: ", error);
      if (
        error.code === "permission-denied" ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        alert(
          "Firestore permissions denied. Please copy the rules from the firestore.rules file and paste them into your Firebase Console under Firestore Database -> Rules.",
        );
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const resetBooking = () => {
    setStatus("idle");
    setBookingData(null);
    setBookingId(null);
  };

  return (
    <section
      id="booking"
      className="py-24 bg-sand-200/50 border-b border-ink-800/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div className="flex flex-col justify-center">
          <FadeIn>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.3em] text-sand-800 mb-6">
              Reservations
            </h3>
            <h2 className="font-serif text-5xl md:text-6xl text-ink-800 mb-8">
              Secure Your <br />
              <span className="italic">Stay</span>
            </h2>
            <p className="text-sm leading-relaxed text-ink-800/70 max-w-sm mb-12 border-l border-ink-800 pl-6">
              Plan your escape to our serene palace and experience the epitome
              of luxury. Leave your details, and our concierge will contact you
              to finalize your bespoke itinerary.
            </p>
            <div className="space-y-6 text-[11px] uppercase tracking-widest text-ink-800/80">
              <p className="flex items-center gap-4">
                <span className="w-6 h-[1px] bg-ink-800/30"></span> Check-in:
                2:00 PM
              </p>
              <p className="flex items-center gap-4">
                <span className="w-6 h-[1px] bg-ink-800/30"></span> Check-out:
                11:00 AM
              </p>
              <p className="flex items-center gap-4">
                <span className="w-6 h-[1px] bg-ink-800/30"></span>{" "}
                Complimentary Airport Transfer
              </p>
            </div>
          </FadeIn>
        </div>

        <div>
          <FadeIn
            delay={0.2}
            className="bg-sand-100 p-8 md:p-12 border border-ink-800/10 rounded-[2rem] shadow-sm relative min-h-[600px] flex flex-col justify-center"
          >
            {status === "loading" ? (
              <div className="flex flex-col items-center justify-center text-center h-full animate-pulse">
                <div className="w-12 h-12 border-t-2 border-r-2 border-ink-800 rounded-full animate-spin mb-6"></div>
                <p className="text-[10px] uppercase tracking-widest text-ink-800/60">
                  Loading Your Details...
                </p>
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <h4 className="font-serif text-3xl mb-4 text-ink-800">
                  Sign in to Reserve
                </h4>
                <p className="text-sm text-ink-800/70 max-w-sm mb-8">
                  Please sign in with your Google account to submit a
                  reservation request and view your booking history.
                </p>
                <button
                  onClick={signInWithGoogle}
                  className="px-8 py-3 bg-ink-800 text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ink-900 transition-colors"
                >
                  Sign in with Google
                </button>
              </div>
            ) : status === "idle" || status === "submitting" ? (
              <>
                <h4 className="font-serif text-2xl mb-8 text-ink-800 text-center">
                  Reservation Request
                </h4>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={user.displayName || ""}
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 placeholder:text-ink-800/30 disabled:opacity-50"
                        placeholder="e.g. Daniel Carter"
                        required
                        disabled={status === "submitting"}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email || ""}
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 placeholder:text-ink-800/30 disabled:opacity-50"
                        placeholder="daniel@example.com"
                        required
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Check-in Date
                      </label>
                      <input
                        name="checkIn"
                        type="date"
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 uppercase disabled:opacity-50"
                        required
                        disabled={status === "submitting"}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Check-out Date
                      </label>
                      <input
                        name="checkOut"
                        type="date"
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 uppercase disabled:opacity-50"
                        required
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Number of Guests
                      </label>
                      <select
                        name="guests"
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer disabled:opacity-50"
                        disabled={status === "submitting"}
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4+">4+ Guests</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                        Suite Preference
                      </label>
                      <select
                        name="suite"
                        className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 appearance-none rounded-none cursor-pointer disabled:opacity-50"
                        disabled={status === "submitting"}
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                      Special Requests
                    </label>
                    <textarea
                      name="requests"
                      className="bg-transparent border-b border-ink-800/20 py-2 focus:outline-none focus:border-ink-800 transition-colors text-sm text-ink-800 placeholder:text-ink-800/30 resize-none h-16 disabled:opacity-50"
                      placeholder="Anniversary celebration, airport transfer, dietary requirements..."
                      disabled={status === "submitting"}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-ink-800 text-white py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-ink-900 transition-colors mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "submitting"
                      ? "Processing..."
                      : "Submit Request"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full border border-ink-800/20 flex items-center justify-center mb-6">
                  {status === "pending" ? (
                    <span className="text-2xl font-serif text-ink-800">V</span>
                  ) : (
                    <span className="text-2xl font-serif text-ink-800 opacity-50">
                      ×
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-3xl mb-2 text-ink-800">
                  {status === "pending"
                    ? "Request Received"
                    : "Request Cancelled"}
                </h4>

                <div className="mt-8 mb-8 bg-sand-200/50 p-6 border border-ink-800/10 w-full text-left">
                  <div className="flex justify-between items-center mb-6 border-b border-ink-800/10 pb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-sand-800">
                      Status
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 border ${status === "pending" ? "border-amber-600/30 text-amber-800 bg-amber-500/10" : "border-red-600/30 text-red-800 bg-red-500/10"}`}
                    >
                      {status === "pending"
                        ? "Pending Confirmation"
                        : "Cancelled"}
                    </span>
                  </div>

                  {bookingData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                            Guest
                          </p>
                          <p className="text-sm text-ink-800 font-medium">
                            {bookingData.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                            Suite
                          </p>
                          <p
                            className="text-sm text-ink-800 font-medium truncate"
                            title={bookingData.suite}
                          >
                            {bookingData.suite}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                            Check-in
                          </p>
                          <p className="text-sm text-ink-800 font-medium">
                            {bookingData.checkIn || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-sand-800 mb-1">
                            Check-out
                          </p>
                          <p className="text-sm text-ink-800 font-medium">
                            {bookingData.checkOut || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-ink-800/70 mb-8 max-w-sm">
                  {status === "pending"
                    ? "Our concierge team is reviewing your request and will contact you shortly to confirm the reservation."
                    : "Your reservation request has been cancelled. We hope to welcome you another time."}
                </p>

                <div className="flex gap-4 w-full">
                  {status === "pending" && (
                    <button
                      onClick={handleCancel}
                      className="flex-1 border border-ink-800/20 text-ink-800 py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-ink-800/5 transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}
                  <button
                    onClick={resetBooking}
                    className="flex-1 bg-ink-800 text-white py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-ink-900 transition-colors"
                  >
                    {status === "pending" ? "New Request" : "Book Again"}
                  </button>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-32 bg-sand-100 border-b border-ink-800/10 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <FadeIn className="max-w-3xl mx-auto px-6 flex flex-col items-center justify-center gap-8 relative z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-sand-800">
          Guest Memoirs
        </p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl md:text-5xl italic font-serif text-center leading-tight mb-8">
            "One of the finest luxury stays in India. The culinary experience
            was extraordinary."
          </p>
          <p className="text-[10px] uppercase tracking-widest text-ink-800/60 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-ink-800/30"></span>
            Daniel Carter, UK
            <span className="w-8 h-[1px] bg-ink-800/30"></span>
          </p>
        </div>
      </FadeIn>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-sand-100 text-ink-800 border-t border-ink-800/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 px-6 md:px-12 py-16 gap-12 text-center md:text-left">
        <div className="flex flex-col md:justify-between items-center md:items-start gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-sand-800 mb-2">
              The Saffron Ember
            </p>
            <p className="text-xs">
              Signature: Dum Pukht Biryani & Truffle Naan
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-[11px] uppercase tracking-widest text-sand-800 mb-2">
              Address
            </p>
            <p className="text-xs text-ink-800/80">
              Sunset Ridge Road,
              <br />
              Aravalli Hills, Udaipur 313001
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 py-8 md:py-0 border-y md:border-y-0 md:border-x border-ink-800/10">
          <div className="text-center">
            <h1 className="text-3xl font-serif italic tracking-widest uppercase text-ink-800 mb-1">
              Velmora
            </h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-ink-800/80">
              Grand Palace & Spa
            </p>
          </div>
          <a
            href="#booking"
            className="px-6 py-2 border border-ink-800 rounded-full text-[10px] uppercase tracking-widest font-medium hover:bg-ink-800 hover:text-white transition-all text-ink-800 whitespace-nowrap"
          >
            Reserve Your Stay
          </a>
        </div>

        <div className="flex flex-col md:justify-between items-center md:items-end gap-4">
          <div className="text-center md:text-right">
            <p className="text-[11px] uppercase tracking-widest text-sand-800 mb-2">
              Contact Concierge
            </p>
            <p className="text-xs font-medium mb-1">+91 98765 43210</p>
            <p className="text-xs">reservations@velmoragrand.com</p>
          </div>
          <div className="mt-8 md:mt-0 text-center md:text-right">
            <p className="text-[11px] uppercase tracking-widest text-sand-800 mb-2">
              Information
            </p>
            <p className="text-xs text-ink-800/80 mb-1">
              Hotel: 24/7 Operations
            </p>
            <p className="text-xs text-ink-800/80">
              Dining: 7:00 AM - 11:30 PM
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-800/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-ink-800/50">
          <p>© 2026 Velmora Grand Palace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/admin" className="hover:text-ink-800 transition-colors">
              Admin
            </a>
            <a href="#" className="hover:text-ink-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-ink-800 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-ink-800 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <main className="bg-sand-100 min-h-screen text-ink-800 overflow-x-hidden selection:bg-ink-800 selection:text-white">
      <Navbar />
      <Hero />
      <Introduction />
      <Stay />
      <Dining />
      <Wellness />
      <BookingSection />
      <Testimonials />
      <Footer />
    </main>
  );
}
