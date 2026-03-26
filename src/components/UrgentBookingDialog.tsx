import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "919335580253";

export function UrgentBookingDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", roomType: "", budget: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.roomType || !form.budget.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const message = `🚀 *Urgent Booking Request*%0A%0A👤 Name: ${encodeURIComponent(form.name.trim())}%0A📞 Phone: ${encodeURIComponent(form.phone.trim())}%0A🏙️ City: ${encodeURIComponent(form.city.trim())}%0A🏠 Room Type: ${encodeURIComponent(form.roomType)}%0A💰 Budget: ₹${encodeURIComponent(form.budget.trim())}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    toast.success("Redirecting to WhatsApp...");
    setForm({ name: "", phone: "", city: "", roomType: "", budget: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="Urgent Booking"
            >
              <Zap className="h-5 w-5" />
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Urgent Booking</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" /> Urgent Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-name">Name *</Label>
            <Input id="booking-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-phone">Phone Number *</Label>
            <Input id="booking-phone" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} maxLength={10} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-city">City *</Label>
            <Input id="booking-city" placeholder="e.g. Greater Noida" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label>Room Type *</Label>
            <Select value={form.roomType} onValueChange={(v) => setForm({ ...form, roomType: v })}>
              <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Room">Single Room</SelectItem>
                <SelectItem value="Shared Room">Shared Room</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="1 BHK">1 BHK</SelectItem>
                <SelectItem value="2 BHK">2 BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-budget">Budget (₹/month) *</Label>
            <Input id="booking-budget" placeholder="e.g. 5000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value.replace(/\D/g, "") })} maxLength={10} required />
          </div>
          <Button type="submit" variant="hero" className="w-full">
            <Zap className="h-4 w-4" /> Send via WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
