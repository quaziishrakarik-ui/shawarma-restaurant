import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useFeaturedItems } from "@/hooks/use-menu-items";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: featured, isLoading: featuredLoading } = useFeaturedItems();
  const { data: locations } = useLocations();
  const firstLocation = locations?.[0];

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center min-h-[105vh] bg-cover bg-center"
        style={{
          backgroundImage: settings?.hero_image_url
            ? `url(${settings.hero_image_url})`
            : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          {settingsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto bg-white/20" />
              <Skeleton className="h-6 w-1/2 mx-auto bg-white/20" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {settings?.hero_title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {settings?.hero_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {firstLocation?.phone && (
                  <Button size="lg" asChild className="gap-2">
                    <a href={`tel:${firstLocation.phone}`}>
                      <Phone className="h-5 w-5" /> Call Now
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild className="gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <Link to="/menu">
                    View Menu <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </section>

      {/* Featured Items */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Dishes</h2>
        {featuredLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-lg" />
            ))}
          </div>
        ) : featured && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/menu/${item.id}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="shrink-0">
                          ${Number(item.price).toFixed(2)}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No featured items yet.</p>
        )}
      </section>

      {/* About Preview */}
      <section className="bg-muted/50 py-16">
        <div className="container grid gap-8 md:grid-cols-2 items-center">
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
            <h2 className="text-3xl font-bold mb-4">{settings?.about_title}</h2>
            <p className="text-muted-foreground mb-6 line-clamp-4">
              {settings?.about_description}
            </p>
            <Button asChild variant="outline">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
