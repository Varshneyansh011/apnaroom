import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <HomeIcon className="h-6 w-6 text-accent" />
              <span>ROOM HAI</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Find affordable rooms and PG accommodations across India. Your next home is just a search away.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/cities", label: "Cities" },
                { to: "/become-provider", label: "Become a Provider" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <span>roomhai247@gmail.com</span>
              <span>+91 93355 80253</span>
              <span>Greater Noida, India</span>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © ROOM HAI 2026 | All rights reserved
        </div>
      </div>
    </footer>
  );
}
