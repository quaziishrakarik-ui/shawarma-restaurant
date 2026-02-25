import { Phone, MessageCircle, MapPin, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const { data: locations, isLoading } = useLocations();

  return (
    <div>
      <PageHeader
        tagline="Get in Touch"
        title="Contact Us"
        imageUrl={(settings as any)?.contact_header_image_url}
      />

      {/* Social Links */}
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center gap-4 mb-10"
        >
          {settings?.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-border/50 text-sm tracking-wide hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Facebook className="h-5 w-5" /> Facebook
            </a>
          )}
          {settings?.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-border/50 text-sm tracking-wide hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Instagram className="h-5 w-5" /> Instagram
            </a>
          )}
        </motion.div>
      </div>

      {/* Location Cards - white bg with stroke/glow */}
      <section className="pb-20">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72" />)}
            </div>
          ) : locations && locations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="border border-primary/20 shadow-[0_0_30px_-10px_hsl(var(--primary)_/_0.12)] overflow-hidden">
                    <CardContent className="p-6 space-y-3">
                      <h2 className="font-display text-lg font-medium">{loc.name}</h2>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                          <span>{loc.address}</span>
                        </div>
                        <a href={`tel:${loc.phone}`} className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors">
                          <Phone className="h-4 w-4 text-primary" /> {loc.phone}
                        </a>
                        {loc.whatsapp_link && (
                          <a href={loc.whatsapp_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-sm hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp: {loc.whatsapp_number}
                          </a>
                        )}
                      </div>
                      {loc.maps_embed && (
                        <div
                          className="overflow-hidden mt-3 w-full max-w-full [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!min-w-0"
                          style={{ maxHeight: "180px", overflow: "hidden" }}
                          dangerouslySetInnerHTML={{
                            __html: loc.maps_embed
                              .replace(/width="[^"]*"/g, 'width="100%"')
                              .replace(/height="[^"]*"/g, 'height="180"')
                              .replace(/style="[^"]*"/g, 'style="width:100%;max-width:100%;height:180px;border:0"'),
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-light text-lg">No locations added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
