import { Phone, MessageCircle, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useLocations } from "@/hooks/use-locations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";

interface HowWeCookItem {
  title: string;
  description: string;
  image_url: string;
}

export default function About() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: locations, isLoading: locsLoading } = useLocations();

  const howWeCook: HowWeCookItem[] = (() => {
    const raw = (settings as any)?.how_we_cook;
    if (!raw) return [];
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  })();

  return (
    <div>
      <PageHeader
        tagline="Who We Are"
        title="Our Story"
        imageUrl={(settings as any)?.about_header_image_url}
      />

      {/* About Section */}
      <section className="container py-20 max-w-6xl">
        {settingsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="md:border-0 border border-primary/20 md:shadow-none shadow-[0_0_30px_-10px_hsl(var(--primary)_/_0.12)] md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0">
            <div className="relative grid md:grid-cols-[1fr_1.3fr] items-center gap-6 md:gap-0">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 border border-primary/20 bg-card p-10 md:p-12 shadow-[0_0_40px_-10px_hsl(var(--primary)_/_0.15)] md:mr-[-4rem]"
              >
                <span className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary mb-4 block">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">{settings?.about_title}</h2>
                <div className="arabesque-divider max-w-[120px] my-5">
                  <Star className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-light text-base">
                  {settings?.about_description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 justify-center"
              >
                <div className="flex-1 max-w-[55%] overflow-hidden shadow-2xl">
                  {settings?.about_image_url ? (
                    <img src={settings.about_image_url} alt={settings.about_title} className="object-cover w-full h-[24rem] md:h-[28rem]" loading="lazy" />
                  ) : (
                    <div className="bg-muted h-[24rem] md:h-[28rem] flex items-center justify-center text-muted-foreground">About image 1</div>
                  )}
                </div>
                <div className="flex-1 max-w-[40%] overflow-hidden shadow-2xl">
                  {(settings as any)?.about_image_2_url ? (
                    <img src={(settings as any).about_image_2_url} alt={settings?.about_title} className="object-cover w-full h-[18rem] md:h-[22rem]" loading="lazy" />
                  ) : (
                    <div className="bg-muted h-[18rem] md:h-[22rem] flex items-center justify-center text-muted-foreground">About image 2</div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* How We Cook - now above Locations */}
      {howWeCook.length > 0 && (
        <>
          <PageHeader
            tagline="Our Process"
            title="How We Cook"
            imageUrl={(settings as any)?.how_we_cook_header_image_url}
          />
          <section className="container py-20">
            <div className="max-w-5xl mx-auto space-y-12">
              {howWeCook.map((item, i) => {
                const imageLeft = i % 2 !== 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="rounded-lg overflow-hidden border border-border/50 shadow-lg"
                  >
                    <div className={`grid ${imageLeft ? 'md:grid-cols-[360px_minmax(0,1fr)]' : 'md:grid-cols-[minmax(0,1fr)_360px]'} gap-0`}>
                      {imageLeft && (
                        <div className="md:w-[360px] md:h-[320px] h-[280px] bg-muted overflow-hidden shrink-0 order-first flex items-center justify-center p-4 md:p-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="md:w-full md:h-full w-[85%] h-[85%] object-cover rounded-md md:rounded-none" loading="lazy" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">Image</div>
                          )}
                        </div>
                      )}
                      <div className="p-10 flex flex-col justify-center text-left">
                        <span className="text-xs tracking-[0.2em] uppercase text-primary mb-3 font-medium">Step {i + 1}</span>
                        <h3 className="text-2xl font-display font-medium mb-4">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed font-light">{item.description}</p>
                      </div>
                      {!imageLeft && (
                        <div className="md:w-[360px] md:h-[320px] h-[280px] bg-muted overflow-hidden shrink-0 flex items-center justify-center p-4 md:p-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="md:w-full md:h-full w-[85%] h-[85%] object-cover rounded-md md:rounded-none" loading="lazy" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">Image</div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Locations Header */}
      <PageHeader
        tagline="Find Us"
        title={settings?.locations_section_title || "Our Locations"}
        imageUrl={(settings as any)?.locations_header_image_url}
      />

      {/* Location Cards */}
      <section className="py-16">
        <div className="container">
          {locsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}
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
                      <h3 className="font-display text-lg font-medium">{loc.name}</h3>
                      <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                        <span>{loc.address}</span>
                      </div>
                      <a href={`tel:${loc.phone}`} className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors">
                        <Phone className="h-4 w-4 text-primary" /> {loc.phone}
                      </a>
                      {loc.whatsapp_link && (
                        <a href={loc.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp: {loc.whatsapp_number}
                        </a>
                      )}
                      {loc.maps_embed && (
                        <div
                          className="mt-3 overflow-hidden w-full max-w-full [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!min-w-0"
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
            <p className="text-center text-muted-foreground">No locations added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
