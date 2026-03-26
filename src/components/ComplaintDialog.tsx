import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ComplaintDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("complaints").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to submit complaint. Please try again.");
      return;
    }

    toast.success("Complaint submitted successfully! We'll review it soon.");
    setForm({ name: "", phone: "", email: "", message: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Raise Complaint"
            >
              <AlertTriangle className="h-5 w-5" />
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Raise Complaint</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Raise a Complaint
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint-name">Name *</Label>
            <Input id="complaint-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaint-phone">Phone Number *</Label>
            <Input id="complaint-phone" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} maxLength={10} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaint-email">Email (optional)</Label>
            <Input id="complaint-email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaint-message">Complaint Message *</Label>
            <Textarea id="complaint-message" placeholder="Describe your complaint..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} rows={4} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
