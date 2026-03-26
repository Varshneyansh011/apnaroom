import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.jpeg";
import { ComplaintDialog } from "@/components/ComplaintDialog";
import { UrgentBookingDialog } from "@/components/UrgentBookingDialog";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cities", label: "Cities" },
  { to: "/become-provider", label: "Become a Provider" },
];

const INSTAGRAM_URL = "https://www.instagram.com/room_hai247?igsh=MWZzcmRpeWhuYnp2";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 section-padding">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <img src={logoImg} alt="ROOM HAI logo" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-foreground">ROOM</span>
            <span className="text-accent">HAI</span>
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-pink-500 transition-colors"
            aria-label="Follow us on Instagram"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <ComplaintDialog />
          <UrgentBookingDialog />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-primary flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border animate-reveal-up">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-primary flex items-center gap-2">
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            {user ? (
              <Button size="sm" variant="ghost" onClick={() => { signOut(); setOpen(false); }} className="mt-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => { navigate("/auth"); setOpen(false); }} className="mt-2">
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
