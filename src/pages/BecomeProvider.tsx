import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { facilities as allFacilities, cities } from "@/data/rooms";
import { CheckCircle, Crown, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type PlanType = "normal" | "premium" | null;

const BecomeProvider = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState<PlanType>(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const premiumPlans = [
    { id: "1month", label: "1 Month", price: 29 },
    { id: "3months", label: "3 Months", price: 59 },
    { id: "1year", label: "1 Year", price: 99 },
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    roomName: "",
    city: "",
    pincode: "",
    location: "",
    price: "",
    facilities: [] as string[],
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleFacility = (f: string) =>
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.roomName || !form.city || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (planType === "premium" && !selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("provider_submissions").insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      room_name: form.roomName,
      city: form.city,
      location: form.location || null,
      pincode: form.pincode || null,
      price: parseInt(form.price),
      facilities: form.facilities,
      submitted_by: user?.id || null,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
      return;
    }
    setSubmitted(true);
    toast.success("Your listing has been submitted for review!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-24 max-w-lg mx-auto section-padding text-center">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Submission Received!</h1>
            <p className="text-muted-foreground mb-8">
              Your {planType === "premium" ? "premium" : "normal"} room listing has been submitted and is pending approval.
            </p>
            <Button onClick={() => { setSubmitted(false); setPlanType(null); }} variant="outline">
              Submit Another Listing
            </Button>
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    );
  }

  // Plan selection screen
  if (!planType) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-24 max-w-3xl mx-auto section-padding">
          <ScrollReveal>
            <h1 className="text-3xl font-bold mb-2 text-center">Become a Room Provider</h1>
            <p className="text-muted-foreground mb-10 text-center">
              Choose a plan that suits your needs and start listing your rooms on ROOM HAI.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Normal Plan */}
              <button
                onClick={() => setPlanType("normal")}
                className="group relative rounded-2xl border-2 border-border bg-card p-8 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <User className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">Normal Plan</h2>
                <p className="text-2xl font-bold text-primary mb-3">Free</p>
                <p className="text-sm text-muted-foreground mb-6">
                  List your room for free with basic visibility. Great for getting started.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Basic room listing</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Standard visibility</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Contact details shown</li>
                </ul>
                <div className="mt-6 w-full h-11 rounded-lg bg-secondary text-foreground font-semibold flex items-center justify-center text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Get Started Free
                </div>
              </button>

              {/* Premium Plan */}
              <button
                onClick={() => setPlanType("premium")}
                className="group relative rounded-2xl border-2 border-accent bg-card p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-accent/10"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-xl font-bold mb-2">Premium Plan</h2>
                <p className="text-2xl font-bold text-accent mb-3">Starting ₹29</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Boost your listing with premium features and priority placement.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Priority listing placement</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Featured badge on listing</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Enhanced visibility</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Priority support</li>
                </ul>
                <div className="mt-6 w-full h-11 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center justify-center text-sm group-hover:brightness-110 transition-all">
                  Go Premium
                </div>
              </button>
            </div>
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24 max-w-2xl mx-auto section-padding">
        <ScrollReveal>
          <button onClick={() => setPlanType(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 transition-colors">
            ← Back to plans
          </button>
          <h1 className="text-3xl font-bold mb-2">
            {planType === "premium" ? "Premium Provider Listing" : "Normal Provider Listing"}
          </h1>
          <p className="text-muted-foreground mb-10">
            Fill in the details below to list your room on ROOM HAI.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-semibold mb-4">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your phone number" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-semibold mb-4">Room Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Room / PG Name *</label>
                  <input type="text" value={form.roomName} onChange={(e) => update("roomName", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Sunrise PG for Boys" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">City *</label>
                  <select value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Pin Code</label>
                  <input type="text" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} maxLength={6} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 400058" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location / Area</label>
                  <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Andheri West" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price per Month (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 8500" />
                </div>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium mb-2 block">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {allFacilities.map((f) => (
                    <button key={f} type="button" onClick={() => toggleFacility(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.facilities.includes(f) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {planType === "premium" && (
              <div className="bg-card rounded-2xl border border-accent/50 p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-accent" />
                  Choose a Subscription Plan *
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {premiumPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative rounded-xl border-2 p-5 text-center transition-all duration-200 ${
                        selectedPlan === plan.id
                          ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                          : "border-border bg-background hover:border-accent/40"
                      }`}
                    >
                      {plan.id === "1year" && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                      <div className="text-sm font-medium text-muted-foreground mb-1">{plan.label}</div>
                      <div className="text-2xl font-bold">₹{plan.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Listing for Review"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your listing will be reviewed by our team before being published.
            </p>
          </form>
        </ScrollReveal>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeProvider;
