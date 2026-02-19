import { Phone, MessageCircle, Facebook, Instagram, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: locations } = useLocations();
  const firstLocation = locations?.[0];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "hsl(30 15% 8%)", color: "hsl(30 10% 85%)" }}>
      {/* Decorative top border */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(38 72% 50% / 0.5), transparent)" }} />

      <div className="container py-16 grid gap-12 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-semibold text-white">
            {settings?.seo_title || "Restaurant"}
          </h3>
          <p className="text-sm leading-relaxed opacity-60 max-w-xs">
            {settings?.seo_description}
          </p>
          <div className="flex gap-3 pt-2">
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-medium text-white">Quick Links</h4>
          <nav className="flex flex-col gap-3">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Our Menu" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-medium text-white">Visit Us</h4>
          {firstLocation && (
            <div className="space-y-3 text-sm opacity-60">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <span>{firstLocation.address}</span>
              </div>
              <a href={`tel:${firstLocation.phone}`} className="flex items-center gap-3 hover:opacity-100 hover:text-primary transition-all duration-300">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{firstLocation.phone}</span>
              </a>
              {firstLocation.whatsapp_link && (
                <a href={firstLocation.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-100 hover:text-primary transition-all duration-300">
                  <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-40">
          <span>© {new Date().getFullYear()} {settings?.seo_title || "Restaurant"}. All rights reserved.</span>
          <span className="tracking-[0.15em] uppercase">Crafted with passion</span>
        </div>
      </div>
    </footer>
  );
}
