import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  LayoutDashboard, Home as HomeIcon, List, Users, CheckCircle, XCircle,
  Plus, Edit, Trash2, LogOut, ArrowLeft, Eye, EyeOff, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

type Tab = "overview" | "rooms" | "submissions" | "complaints";

interface RoomRow {
  id: string;
  name: string;
  city: string;
  area: string;
  price: number;
  gender: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

interface SubmissionRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  room_name: string;
  city: string;
  location: string | null;
  price: number;
  facilities: string[] | null;
  status: string;
  created_at: string;
}

interface ComplaintRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    const [roomsRes, subsRes, complaintsRes] = await Promise.all([
      supabase.from("rooms").select("*").order("created_at", { ascending: false }),
      supabase.from("provider_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("complaints").select("*").order("created_at", { ascending: false }),
    ]);
    if (roomsRes.data) setRooms(roomsRes.data);
    if (subsRes.data) setSubmissions(subsRes.data);
    if (complaintsRes.data) setComplaints(complaintsRes.data as ComplaintRow[]);
    setLoadingData(false);
  };

  const toggleRoomActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("rooms").update({ is_active: !current }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(current ? "Room deactivated" : "Room activated");
    fetchData();
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Delete this room permanently?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Room deleted");
    fetchData();
  };

  const updateSubmissionStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("provider_submissions")
      .update({ status, reviewed_by: user!.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }

    if (status === "approved") {
      const sub = submissions.find((s) => s.id === id);
      if (sub) {
        await supabase.from("rooms").insert({
          name: sub.room_name,
          city: sub.city,
          area: sub.location || sub.city,
          price: sub.price,
          facilities: sub.facilities || [],
          gender: "unisex",
          type: "PG",
          owner_phone: sub.phone,
          description: `Listed by ${sub.name}. Contact: ${sub.phone}`,
        });
      }
    }
    toast.success(`Submission ${status}`);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const newComplaintsCount = complaints.filter((c) => c.status === "new").length;
  const activeRooms = rooms.filter((r) => r.is_active).length;

  const updateComplaintStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("complaints").update({ status } as any).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Complaint marked as ${status}`);
    fetchData();
  };

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "rooms" as Tab, label: "Rooms", icon: List },
    { id: "submissions" as Tab, label: `Submissions${pendingCount ? ` (${pendingCount})` : ""}`, icon: Users },
    { id: "complaints" as Tab, label: `Complaints${newComplaintsCount ? ` (${newComplaintsCount})` : ""}`, icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between section-padding">
        <div className="flex items-center gap-3">
          <HomeIcon className="h-5 w-5 text-accent" />
          <span className="font-bold">ROOM HAI</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" /> Site
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 min-h-[calc(100vh-3.5rem)] bg-card border-r border-border p-4">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                tab === t.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
          {tab === "overview" && (
            <ScrollReveal>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Rooms", value: rooms.length, color: "text-primary" },
                  { label: "Active Rooms", value: activeRooms, color: "text-success" },
                  { label: "Pending Submissions", value: pendingCount, color: "text-accent" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {pendingCount > 0 && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
                  <p className="font-medium text-sm">
                    You have {pendingCount} pending provider submission{pendingCount > 1 ? "s" : ""} to review.
                  </p>
                  <button onClick={() => setTab("submissions")} className="text-sm text-accent hover:underline mt-1">
                    Review now →
                  </button>
                </div>
              )}

              <h2 className="font-semibold mb-3">Recent Rooms</h2>
              <div className="space-y-2">
                {rooms.slice(0, 5).map((room) => (
                  <div key={room.id} className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-sm">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{room.area}, {room.city} · ₹{room.price.toLocaleString("en-IN")}/mo</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${room.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {room.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
                {rooms.length === 0 && <p className="text-muted-foreground text-sm">No rooms yet.</p>}
              </div>
            </ScrollReveal>
          )}

          {tab === "rooms" && (
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Rooms</h1>
              </div>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : rooms.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-2">No rooms in the database yet.</p>
                  <p className="text-sm text-muted-foreground">Approve provider submissions or add rooms manually.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {room.area}, {room.city} · ₹{room.price.toLocaleString("en-IN")}/mo · {room.type} · {room.gender}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRoomActive(room.id, room.is_active)}
                          title={room.is_active ? "Deactivate" : "Activate"}
                        >
                          {room.is_active ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteRoom(room.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          )}

          {tab === "submissions" && (
            <ScrollReveal>
              <h1 className="text-2xl font-bold mb-6">Provider Submissions</h1>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : submissions.length === 0 ? (
                <p className="text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold">{sub.room_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sub.location ? `${sub.location}, ` : ""}{sub.city} · ₹{sub.price.toLocaleString("en-IN")}/mo
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                          sub.status === "pending" ? "bg-accent/10 text-accent" :
                          sub.status === "approved" ? "bg-success/10 text-success" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        <p>Submitted by: {sub.name} · {sub.phone}{sub.email ? ` · ${sub.email}` : ""}</p>
                        {sub.facilities && sub.facilities.length > 0 && (
                          <p className="mt-1">Facilities: {sub.facilities.join(", ")}</p>
                        )}
                      </div>
                      {sub.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateSubmissionStatus(sub.id, "approved")}>
                            <CheckCircle className="h-4 w-4" /> Approve & Add Room
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => updateSubmissionStatus(sub.id, "rejected")}>
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          )}

          {tab === "complaints" && (
            <ScrollReveal>
              <h1 className="text-2xl font-bold mb-6">Complaints</h1>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : complaints.length === 0 ? (
                <p className="text-muted-foreground">No complaints yet.</p>
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div key={c.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {c.phone}{c.email ? ` · ${c.email}` : ""} · {new Date(c.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                          c.status === "new" ? "bg-accent/10 text-accent" :
                          c.status === "resolved" ? "bg-success/10 text-success" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{c.message}</p>
                      {c.status === "new" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateComplaintStatus(c.id, "resolved")}>
                            <CheckCircle className="h-4 w-4" /> Resolve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => updateComplaintStatus(c.id, "dismissed")}>
                            <XCircle className="h-4 w-4" /> Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
