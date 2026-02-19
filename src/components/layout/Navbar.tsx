import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const isHome = true; // All pages use transparent navbar over header images

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-background/95 backdrop-blur-md shadow-sm";

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-500 ${navBg} ${
        isHome && !scrolled ? "border-b border-transparent" : "border-b border-border/50"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.seo_title} className="h-12 w-auto" />
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

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden ${isHome && !scrolled ? "text-white hover:bg-white/10" : ""}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-background/98 backdrop-blur-md border-t border-border/50"
          >
            <div className="py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`block px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-primary ${
                      location.pathname === link.to
                        ? "text-primary border-l-2 border-primary bg-primary/5"
                        : "text-foreground/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
