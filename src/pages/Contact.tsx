import { Phone, MessageCircle, MapPin, Facebook, Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const { data: locations, isLoading } = useLocations();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>

      {/* Social */}
      <div className="flex justify-center gap-4 mb-10">
        {settings?.facebook_url && (
          <Button variant="outline" size="lg" asChild className="gap-2">
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5" /> Facebook
            </a>
          </Button>
        )}
        {settings?.instagram_url && (
          <Button variant="outline" size="lg" asChild className="gap-2">
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" /> Instagram
            </a>
          </Button>
        )}
      </div>

      {/* Locations */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      ) : locations && locations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((loc) => (
            <Card key={loc.id}>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">{loc.name}</h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <a href={`tel:${loc.phone}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                    <Phone className="h-4 w-4" /> {loc.phone}
                  </a>
                  {loc.whatsapp_link && (
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <a href={loc.whatsapp_link} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" /> WhatsApp: {loc.whatsapp_number}
                      </a>
                    </Button>
                  )}
                </div>
                {loc.maps_embed && (
                  <div
                    className="rounded overflow-hidden mt-2"
                    dangerouslySetInnerHTML={{ __html: loc.maps_embed }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No locations added yet.</p>
      )}
    </div>
  );
}
