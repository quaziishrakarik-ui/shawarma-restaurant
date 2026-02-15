import { Phone, MessageCircle, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: locations, isLoading: locsLoading } = useLocations();

  return (
    <div className="container py-10">
      {/* About Section */}
      <section className="max-w-4xl mx-auto mb-16">
        {settingsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {settings?.about_image_url ? (
              <img
                src={settings.about_image_url}
                alt={settings.about_title}
                className="rounded-lg object-cover w-full h-80"
                loading="lazy"
              />
            ) : (
              <div className="rounded-lg bg-muted h-80 flex items-center justify-center text-muted-foreground">
                About image
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-4">{settings?.about_title}</h1>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {settings?.about_description}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Locations */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">
          {settings?.locations_section_title || "Our Locations"}
        </h2>
        {locsLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
          </div>
        ) : locations && locations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {locations.map((loc) => (
              <Card key={loc.id}>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg">{loc.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <a href={`tel:${loc.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                    <Phone className="h-4 w-4" /> {loc.phone}
                  </a>
                  {loc.whatsapp_link && (
                    <a href={loc.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <MessageCircle className="h-4 w-4" /> WhatsApp: {loc.whatsapp_number}
                    </a>
                  )}
                  {loc.maps_embed && (
                    <div
                      className="mt-3 rounded overflow-hidden"
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
      </section>
    </div>
  );
}
