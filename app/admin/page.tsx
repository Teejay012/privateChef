"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Stats {
  totalUsers: number; totalChefs: number; totalRevenue: number;
  pendingBookings: number; confirmedBookings: number; completedBookings: number;
  cancelledBookings: number; totalBookings: number;
}
interface Booking {
  _id: string; userName: string; chefName: string; date: string; time: string;
  guests: number; status: string; totalAmount: number; paymentStatus: string; mood: string; isSOS: boolean;
}
interface Chef {
  _id: string; name: string; avatar: string; specialty: string; rating: number;
  totalBookings: number; pricePerEvent: number; available: boolean; earnings: number; color: string; badge: string;
}
interface DayRevenue { day: string; revenue: number; }

const STATUS_COLOR: Record<string, string> = {
  pending: "#ffc14a", confirmed: "#00d4b4", "in-progress": "#a855f7",
  completed: "#00d4b4", cancelled: "#ff5a28",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "bookings" | "chefs" | "users">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<DayRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingChef, setUpdatingChef] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [addChefOpen, setAddChefOpen] = useState(false);
  const [newChef, setNewChef] = useState({
    name: "", avatar: "", specialty: "", bio: "", location: "",
    cuisines: "", tags: "", pricePerEvent: 250, badge: "CHEF",
    countryBadge: "🌍", cuisineCountry: "", yearsExperience: 5,
    languages: "English", theaterMode: false, sosAvailable: false, color: "teal",
  });
  const [addingChef, setAddingChef] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, chefsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/chefs"),
      ]);
      const statsData = await statsRes.json();
      const chefsData = await chefsRes.json();
      if (statsData.stats) {
        setStats(statsData.stats);
        setBookings(statsData.recentBookings || []);
        setRevenueByDay(statsData.revenueByDay || []);
      }
      setChefs(Array.isArray(chefsData) ? chefsData : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const toggleAvailability = async (chef: Chef) => {
    setUpdatingChef(chef._id);
    await fetch(`/api/chefs/${chef._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !chef.available }),
    });
    setChefs(cs => cs.map(c => c._id === chef._id ? { ...c, available: !c.available } : c));
    setUpdatingChef(null);
  };

  const deleteChef = async (id: string) => {
    if (!confirm("Delete this chef permanently?")) return;
    await fetch("/api/admin/chefs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setChefs(cs => cs.filter(c => c._id !== id));
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBookings(bs => bs.map(b => b._id === id ? { ...b, status: newStatus } : b));
  };

  const handleAddChef = async () => {
    setAddingChef(true);
    try {
      const body = {
        ...newChef,
        cuisines: newChef.cuisines.split(",").map(s => s.trim()).filter(Boolean),
        tags: newChef.tags.split(",").map(s => s.trim()).filter(Boolean),
        languages: newChef.languages.split(",").map(s => s.trim()).filter(Boolean),
        rating: 4.8, totalReviews: 0, totalBookings: 0, earnings: 0,
        signatureLocked: true, available: true, reviews: [],
      };
      const res = await fetch("/api/chefs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setAddChefOpen(false);
        setNewChef({ name: "", avatar: "", specialty: "", bio: "", location: "", cuisines: "", tags: "", pricePerEvent: 250, badge: "CHEF", countryBadge: "🌍", cuisineCountry: "", yearsExperience: 5, languages: "English", theaterMode: false, sosAvailable: false, color: "teal" });
        fetchData();
      }
    } catch (e) { console.error(e); }
    setAddingChef(false);
  };

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);
  const filteredBookings = bookingFilter === "all" ? bookings : bookings.filter(b => b.status === bookingFilter);
  const ac = (color: string) => color === "fire" ? "#ff5a28" : color === "gold" ? "#ffc14a" : "#00d4b4";

  if (loading || !stats) return (
    <main className="min-h-screen" style={{ background: "#020408" }}>
      <Navbar />
      <div className="pt-32 flex justify-center">
        <div className="font-mono-custom text-xs text-[#00d4b4] tracking-widest animate-pulse">LOADING ADMIN...</div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen" style={{ background: "#020408" }}>
      <Navbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="font-mono-custom text-xs text-[#ff5a28] tracking-[0.4em] mb-2 uppercase">◆ Admin Panel</div>
            <h1 className="font-display text-3xl text-white">CHEFHAUS <span className="text-fire">CONTROL CENTER</span></h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="/api/seed" target="_blank" rel="noreferrer" className="btn-ghost text-xs py-2 px-4">Seed Demo Data</a>
            <button onClick={fetchData} className="btn-primary text-xs py-2 px-4">↻ Refresh</button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { v: `$${stats.totalRevenue.toLocaleString()}`, l: "Total Revenue", c: "#00d4b4" },
            { v: stats.totalBookings, l: "Total Bookings", c: "#ffc14a" },
            { v: stats.totalChefs, l: "Active Chefs", c: "#a855f7" },
            { v: stats.totalUsers, l: "Registered Users", c: "#ff5a28" },
            { v: stats.pendingBookings, l: "Pending", c: "#ffc14a" },
            { v: stats.confirmedBookings, l: "Confirmed", c: "#00d4b4" },
            { v: stats.completedBookings, l: "Completed", c: "#00d4b4" },
            { v: stats.cancelledBookings, l: "Cancelled", c: "#ff5a28" },
          ].map((s, i) => (
            <div key={i} className="glow-teal p-5" style={{ background: "#0a1520" }}>
              <div className="font-display text-2xl mb-1" style={{ color: s.c }}>{s.v}</div>
              <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a] tracking-widest uppercase">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="glow-teal p-6 mb-8" style={{ background: "#0a1520" }}>
          <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest mb-6">REVENUE — LAST 7 DAYS</div>
          <div className="flex items-end gap-3 h-32">
            {revenueByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="font-mono-custom text-[0.6rem] text-[#5a7a8a]">${d.revenue}</div>
                <div className="w-full transition-all duration-700 relative group" style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 80)}px`, background: "linear-gradient(to top, #00d4b4, #00a8ff)", opacity: d.revenue === 0 ? 0.2 : 1 }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity" style={{ background: "#fff" }} />
                </div>
                <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a]">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-px border-b border-[rgba(255,255,255,0.06)] mb-8">
          {(["overview", "bookings", "chefs", "users"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="font-display text-xs tracking-widest px-6 py-4 transition-colors"
              style={{ color: tab === t ? "#ff5a28" : "#5a7a8a", borderBottom: tab === t ? "2px solid #ff5a28" : "2px solid transparent" }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent bookings */}
            <div className="glow-teal p-6" style={{ background: "#0a1520" }}>
              <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest mb-5">RECENT BOOKINGS</div>
              <div className="flex flex-col gap-3">
                {bookings.slice(0, 6).map(b => (
                  <div key={b._id} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)]">
                    <div>
                      <div className="font-display text-xs text-white tracking-wide">{b.userName} → {b.chefName}</div>
                      <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a] mt-0.5">
                        {new Date(b.date).toLocaleDateString()} · {b.guests} guests {b.isSOS && "· ⚡ SOS"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm" style={{ color: "#00d4b4" }}>${b.totalAmount}</span>
                      <span className="font-mono-custom text-[0.6rem]" style={{ color: STATUS_COLOR[b.status] }}>{b.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top chefs */}
            <div className="glow-teal p-6" style={{ background: "#0a1520" }}>
              <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest mb-5">TOP PERFORMING CHEFS</div>
              <div className="flex flex-col gap-3">
                {chefs.slice(0, 6).map((chef, i) => (
                  <div key={chef._id} className="flex items-center gap-4 py-3 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="font-display text-lg w-6 text-center" style={{ color: i < 3 ? "#ffc14a" : "#2a4a5a" }}>#{i + 1}</span>
                    <div className="w-9 h-9 flex items-center justify-center font-display text-xs border" style={{ background: `${ac(chef.color)}18`, color: ac(chef.color), borderColor: `${ac(chef.color)}44` }}>{chef.avatar}</div>
                    <div className="flex-1">
                      <div className="font-display text-xs text-white tracking-wide">{chef.name}</div>
                      <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a]">{chef.totalBookings} bookings · ★{chef.rating}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm" style={{ color: ac(chef.color) }}>${chef.earnings}</div>
                      <div className="font-mono-custom text-[0.55rem] text-[#2a4a5a]">earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === "bookings" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(f => (
                <button key={f} onClick={() => setBookingFilter(f)}
                  className="font-mono-custom text-xs px-4 py-2 border tracking-widest transition-all"
                  style={{ borderColor: bookingFilter === f ? "#ff5a28" : "#2a4a5a", color: bookingFilter === f ? "#ff5a28" : "#5a7a8a", background: bookingFilter === f ? "rgba(255,90,40,0.08)" : "transparent" }}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="glow-teal overflow-hidden" style={{ background: "#0a1520" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {["Guest", "Chef", "Date", "Guests", "Mood", "Amount", "Status", "Actions"].map(h => (
                      <th key={h} className="font-mono-custom text-[0.6rem] text-[#2a4a5a] tracking-widest text-left px-4 py-4">{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b._id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,212,180,0.02)] transition-colors">
                      <td className="px-4 py-3 font-display text-xs text-white tracking-wide">{b.userName}</td>
                      <td className="px-4 py-3 text-[#5a7a8a] text-xs">{b.chefName}</td>
                      <td className="px-4 py-3 font-mono-custom text-[0.65rem] text-[#5a7a8a]">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-mono-custom text-[0.65rem] text-[#5a7a8a]">{b.guests}</td>
                      <td className="px-4 py-3"><span className="tag tag-teal" style={{ fontSize: "0.55rem" }}>{b.mood}</span></td>
                      <td className="px-4 py-3 font-display text-sm text-[#00d4b4]">${b.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono-custom text-[0.6rem]" style={{ color: STATUS_COLOR[b.status] }}>{b.status.toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3">
                        {b.status === "pending" && (
                          <button onClick={() => updateBookingStatus(b._id, "confirmed")}
                            className="font-mono-custom text-[0.6rem] text-[#00d4b4] hover:underline tracking-widest mr-3">CONFIRM</button>
                        )}
                        {b.status === "confirmed" && (
                          <button onClick={() => updateBookingStatus(b._id, "completed")}
                            className="font-mono-custom text-[0.6rem] text-[#ffc14a] hover:underline tracking-widest mr-3">COMPLETE</button>
                        )}
                        {!["cancelled", "completed"].includes(b.status) && (
                          <button onClick={() => updateBookingStatus(b._id, "cancelled")}
                            className="font-mono-custom text-[0.6rem] text-[#ff5a28] hover:underline tracking-widest">CANCEL</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="text-center py-12 font-mono-custom text-xs text-[#2a4a5a] tracking-widest">NO BOOKINGS FOUND</div>
              )}
            </div>
          </div>
        )}

        {/* CHEFS TAB */}
        {tab === "chefs" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest">{chefs.length} CHEFS TOTAL</div>
              <button onClick={() => setAddChefOpen(!addChefOpen)} className="btn-primary text-xs py-2 px-5">
                {addChefOpen ? "✕ Cancel" : "+ Add Chef"}
              </button>
            </div>

            {/* Add chef form */}
            {addChefOpen && (
              <div className="glow-fire p-8 mb-6" style={{ background: "#0a1520" }}>
                <div className="font-mono-custom text-xs text-[#ff5a28] tracking-widest mb-6">ADD NEW CHEF</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { k: "name", p: "Full Name", label: "NAME" },
                    { k: "avatar", p: "e.g. JD", label: "AVATAR INITIALS" },
                    { k: "specialty", p: "e.g. Modern Japanese", label: "SPECIALTY" },
                    { k: "location", p: "City · Country", label: "LOCATION" },
                    { k: "badge", p: "e.g. MICHELIN ★", label: "BADGE" },
                    { k: "cuisineCountry", p: "e.g. Japan", label: "COUNTRY" },
                    { k: "countryBadge", p: "🇯🇵", label: "FLAG EMOJI" },
                    { k: "cuisines", p: "Japanese, Sushi (comma-separated)", label: "CUISINES" },
                    { k: "tags", p: "Omakase, Fine Dining (comma-separated)", label: "TAGS" },
                    { k: "languages", p: "English, Japanese", label: "LANGUAGES" },
                  ].map(f => (
                    <div key={f.k}>
                      <label>{f.label}</label>
                      <input value={(newChef as Record<string,unknown>)[f.k] as string}
                        onChange={e => setNewChef(c => ({ ...c, [f.k]: e.target.value }))}
                        placeholder={f.p} />
                    </div>
                  ))}
                  <div>
                    <label>PRICE PER EVENT ($)</label>
                    <input type="number" value={newChef.pricePerEvent} onChange={e => setNewChef(c => ({ ...c, pricePerEvent: +e.target.value }))} />
                  </div>
                  <div>
                    <label>YEARS EXPERIENCE</label>
                    <input type="number" value={newChef.yearsExperience} onChange={e => setNewChef(c => ({ ...c, yearsExperience: +e.target.value }))} />
                  </div>
                </div>
                <div className="mb-4">
                  <label>BIO</label>
                  <textarea value={newChef.bio} onChange={e => setNewChef(c => ({ ...c, bio: e.target.value }))} rows={3} placeholder="Chef biography..." style={{ resize: "none" }} />
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newChef.theaterMode} onChange={e => setNewChef(c => ({ ...c, theaterMode: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#ffc14a" }} />
                    <span className="font-mono-custom text-xs text-[#5a7a8a]">Theater Mode Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newChef.sosAvailable} onChange={e => setNewChef(c => ({ ...c, sosAvailable: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#ff5a28" }} />
                    <span className="font-mono-custom text-xs text-[#5a7a8a]">SOS Available</span>
                  </label>
                  <div>
                    <label>COLOR THEME</label>
                    <select value={newChef.color} onChange={e => setNewChef(c => ({ ...c, color: e.target.value }))}
                      style={{ background: "#060d14", border: "1px solid rgba(0,212,180,0.15)", color: "#f0f4f8", padding: "8px 12px" }}>
                      <option value="teal">Teal</option>
                      <option value="fire">Fire</option>
                      <option value="gold">Gold</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleAddChef} disabled={addingChef || !newChef.name || !newChef.specialty} className="btn-fire">
                  {addingChef ? "ADDING..." : "ADD CHEF →"}
                </button>
              </div>
            )}

            {/* Chef table */}
            <div className="glow-teal overflow-hidden" style={{ background: "#0a1520" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {["Chef", "Specialty", "Price", "Rating", "Bookings", "Earnings", "Status", "Actions"].map(h => (
                      <th key={h} className="font-mono-custom text-[0.6rem] text-[#2a4a5a] tracking-widest text-left px-4 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chefs.map(chef => (
                    <tr key={chef._id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,212,180,0.02)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center font-display text-xs border" style={{ background: `${ac(chef.color)}18`, color: ac(chef.color), borderColor: `${ac(chef.color)}44` }}>{chef.avatar}</div>
                          <span className="font-display text-xs text-white tracking-wide">{chef.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5a7a8a] max-w-[120px] truncate">{chef.specialty}</td>
                      <td className="px-4 py-3 font-display text-sm" style={{ color: ac(chef.color) }}>${chef.pricePerEvent}</td>
                      <td className="px-4 py-3 font-mono-custom text-xs text-[#ffc14a]">★ {chef.rating}</td>
                      <td className="px-4 py-3 font-mono-custom text-xs text-[#5a7a8a]">{chef.totalBookings}</td>
                      <td className="px-4 py-3 font-display text-sm text-[#00d4b4]">${chef.earnings}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono-custom text-[0.6rem]" style={{ color: chef.available ? "#00d4b4" : "#ff5a28" }}>
                          {chef.available ? "ACTIVE" : "OFFLINE"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <button onClick={() => toggleAvailability(chef)} disabled={updatingChef === chef._id}
                          className="font-mono-custom text-[0.6rem] tracking-widest hover:underline"
                          style={{ color: chef.available ? "#ffc14a" : "#00d4b4" }}>
                          {updatingChef === chef._id ? "..." : chef.available ? "DEACTIVATE" : "ACTIVATE"}
                        </button>
                        <button onClick={() => deleteChef(chef._id)}
                          className="font-mono-custom text-[0.6rem] text-[#ff5a28] hover:underline tracking-widest">DEL</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {chefs.length === 0 && (
                <div className="text-center py-12">
                  <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest mb-4">NO CHEFS IN DATABASE</div>
                  <a href="/api/seed" target="_blank" rel="noreferrer" className="btn-primary inline-block text-xs">Seed Demo Chefs</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="glow-teal p-8" style={{ background: "#0a1520" }}>
            <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest mb-6">REGISTERED USERS — {stats.totalUsers} TOTAL</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Registered", value: stats.totalUsers, color: "#00d4b4" },
                { label: "Total Bookings Made", value: stats.totalBookings, color: "#ffc14a" },
                { label: "Avg Bookings / User", value: stats.totalUsers > 0 ? (stats.totalBookings / stats.totalUsers).toFixed(1) : "0", color: "#a855f7" },
              ].map(s => (
                <div key={s.label} className="p-6 border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#060d14" }}>
                  <div className="font-display text-3xl mb-2" style={{ color: s.color }}>{s.value}</div>
                  <div className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest">{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-xs text-[#2a4a5a] font-mono-custom leading-relaxed">
              Full user management (edit roles, ban, export) would connect to /api/user with admin-level access. For this demo, user data is stored in MongoDB and accessible via the API.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
