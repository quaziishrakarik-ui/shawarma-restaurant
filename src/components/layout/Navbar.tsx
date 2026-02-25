import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, UtensilsCrossed, Info, PhoneCall } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: PhoneCall },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const isHome = true;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-background/95 backdrop-blur-md shadow-sm";

  return (
    <>
      {/* Top navbar - desktop only for nav links, mobile shows logo only */}
      <nav
        className={`fixed z-50 w-full transition-all duration-500 ${navBg} ${
          isHome && !scrolled ? "border-b border-transparent" : "border-b border-border/50"
        }`}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.seo_title} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div
                className="h-12 w-12 rounded-full border-2 border-primary/60 flex items-center justify-center font-display text-primary font-bold text-xl"
              >
                {(settings?.seo_title || "S").charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span
                className={`font-display font-semibold text-xl tracking-wide transition-colors ${
                  isHome && !scrolled ? "text-white" : "text-foreground"
                }`}
              >
                {settings?.seo_title || "Restaurant"}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-xs font-body font-medium tracking-[0.2em] uppercase transition-colors py-2 ${
                  isHome && !scrolled
                    ? location.pathname === link.to
                      ? "text-primary"
                      : "text-white/80 hover:text-primary"
                    : location.pathname === link.to
                    ? "text-primary"
                    : "text-foreground/60 hover:text-primary"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Hide mobile hamburger - we use bottom nav now */}
          <div className="md:hidden" />
        </div>
      </nav>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_20px_-4px_hsl(var(--primary)_/_0.08)]">
        <div className="flex items-center justify-around h-16">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium tracking-wide uppercase">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 h-[2px] w-12 bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
