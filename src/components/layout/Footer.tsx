import { Phone, MessageCircle, Facebook, Instagram, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: locations } = useLocations();
  const firstLocation = locations?.[0];

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 grid gap-8 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-lg text-primary mb-2">
            {settings?.seo_title || "Restaurant"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {settings?.seo_description}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          {firstLocation && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{firstLocation.address}</span>
              </div>
              <a href={`tel:${firstLocation.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{firstLocation.phone}</span>
              </a>
              {firstLocation.whatsapp_link && (
                <a href={firstLocation.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings?.seo_title || "Restaurant"}. All rights reserved.
      </div>
    </footer>
  );
}
