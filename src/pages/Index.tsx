import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useFeaturedItems } from "@/hooks/use-menu-items";

import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroBgDefault from "@/assets/hero-bg-default.jpg";

interface TitleLine {
  text: string;
  color: string;
}

export default function Index() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: featured, isLoading: featuredLoading } = useFeaturedItems();
  const { data: locations } = useLocations();
  const [callDialogOpen, setCallDialogOpen] = useState(false);

  const titleLines: TitleLine[] = settings?.hero_title_lines
    ? (typeof settings.hero_title_lines === "string"
        ? JSON.parse(settings.hero_title_lines)
        : settings.hero_title_lines)
    : [
        { text: "Your Shawarma", color: "0 0% 100%" },
        { text: "Cooked to", color: "0 0% 100%" },
        { text: "Perfection.", color: "38 72% 50%" },
      ];

  const heroMobileBg = (settings as any)?.hero_image_mobile_url;
  const heroBg = settings?.hero_image_url || heroBgDefault;

  const renderItemCard = (item: any, i: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.6 }}
    >
      <Link to={`/menu/${item.id}`}>
        <Card className="overflow-hidden group border border-primary/20 shadow-[0_0_30px_-10px_hsl(var(--primary)_/_0.12)] bg-transparent">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted relative">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <CardContent className="px-1 pt-5 pb-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-medium">{item.name}</h3>
              <span className="text-primary font-body font-medium text-lg">
                ৳{Number(item.price).toFixed(2)}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-light">
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[60vh] md:min-h-screen overflow-hidden">
        {/* Desktop hero bg */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 hidden md:block"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Mobile hero bg — falls back to desktop if not set */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 md:hidden"
          style={{ backgroundImage: `url(${heroMobileBg || heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(38 72% 50% / 0.6), transparent)" }} />

        <div className="container relative z-10 flex flex-col md:flex-row items-start md:items-center min-h-[60vh] md:min-h-screen py-20 pt-28 gap-12">
          {/* Mobile hero content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-left mt-16 md:mt-0 md:hidden"
          >
            {!settingsLoading && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mb-8 flex items-center gap-3"
                >
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-[10px] font-body font-medium tracking-[0.3em] uppercase text-primary">
                    {settings?.hero_tagline || "Authentic Middle Eastern"}
                  </span>
                </motion.div>

                <h1 className="mb-6">
                  {titleLines.map((line, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="block text-[2.8rem] font-display font-semibold leading-[1.15] tracking-tight"
                      style={{ color: `hsl(${line.color})` }}
                    >
                      {line.text}
                    </motion.span>
                  ))}
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <Button
                    size="sm"
                    asChild
                    className="gap-2 rounded-none px-6 py-5 text-xs font-medium tracking-[0.15em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-[0_10px_40px_-10px_hsl(38_72%_50%_/_0.4)]"
                  >
                    <Link to="/menu">
                      Explore Menu <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCallDialogOpen(true)}
                    className="gap-2 rounded-none px-6 py-5 text-xs font-medium tracking-[0.15em] uppercase bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-primary shadow-none"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call to Order
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Desktop hero content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-left mt-16 md:mt-0 hidden md:block"
          >
            {settingsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 bg-white/10" />
                <Skeleton className="h-16 w-1/2 bg-white/10" />
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mb-6 flex items-center gap-3"
                >
                  <div className="h-px w-10 bg-primary" />
                  <span className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary">
                    {settings?.hero_tagline || "Authentic Middle Eastern"}
                  </span>
                </motion.div>

                <h1 className="mb-8">
                  {titleLines.map((line, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="block text-[4rem] md:text-6xl lg:text-7xl font-display font-semibold leading-[1.1] tracking-tight"
                      style={{ color: `hsl(${line.color})` }}
                    >
                      {line.text}
                    </motion.span>
                  ))}
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-white/60 max-w-md mb-10 text-base leading-relaxed font-light"
                >
                  {settings?.hero_subtitle || "Experience the finest flavors of the Levant, crafted with centuries-old recipes and the freshest ingredients."}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <Button
                    size="lg"
                    asChild
                    className="gap-3 rounded-none px-10 py-7 text-sm font-medium tracking-[0.15em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-[0_10px_40px_-10px_hsl(38_72%_50%_/_0.4)]"
                  >
                    <Link to="/menu">
                      Explore Menu <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-body">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Call to Order Location Picker */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-center">Which location is closest to you?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {locations?.map((loc) => (
              <a
                key={loc.id}
                href={`tel:${loc.phone}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                onClick={() => setCallDialogOpen(false)}
              >
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-display font-medium">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">{loc.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Most Popular ─── */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary mb-4 block">
              From Our Kitchen
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Most Popular
            </h2>
            <div className="arabesque-divider max-w-xs mx-auto mt-6">
              <Star className="h-4 w-4 text-primary" />
            </div>
          </motion.div>

          {featuredLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item, i) => renderItemCard(item, i))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No featured items yet.</p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-14"
          >
            <Button
              asChild
              variant="outline"
              className="rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase border-foreground/20 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Link to="/menu" className="gap-3">
                View Full Menu <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── About Us ─── */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-body font-medium tracking-[0.3em] uppercase text-primary mb-4 block">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Our Story
            </h2>
            <div className="arabesque-divider max-w-xs mx-auto mt-6">
              <Star className="h-4 w-4 text-primary" />
            </div>
          </motion.div>

          <div className="md:border-0 border border-primary/20 md:shadow-none shadow-[0_0_30px_-10px_hsl(var(--primary)_/_0.12)] md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0">
            <div className="relative grid md:grid-cols-[1fr_1.3fr] items-center gap-6 md:gap-0">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 border border-primary/20 bg-card p-10 md:p-12 shadow-[0_0_40px_-10px_hsl(var(--primary)_/_0.15)] md:mr-[-4rem]"
              >
                <h3 className="text-3xl md:text-4xl font-display font-semibold mb-4 leading-tight">
                  {settings?.about_title}
                </h3>
                <div className="arabesque-divider max-w-[120px] my-5">
                  <Star className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-muted-foreground line-clamp-5 leading-relaxed font-light text-base">
                  {settings?.about_description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex items-center gap-3 justify-center"
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

              {/* Mobile about images */}
              <div className="flex md:hidden items-center gap-3 justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 max-w-[55%] overflow-hidden shadow-2xl"
                >
                  {settings?.about_image_url ? (
                    <img src={settings.about_image_url} alt={settings.about_title} className="object-cover w-full h-[24rem]" loading="lazy" />
                  ) : (
                    <div className="bg-muted h-[24rem] flex items-center justify-center text-muted-foreground">About image 1</div>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 max-w-[40%] overflow-hidden shadow-2xl"
                >
                  {(settings as any)?.about_image_2_url ? (
                    <img src={(settings as any).about_image_2_url} alt={settings?.about_title} className="object-cover w-full h-[18rem]" loading="lazy" />
                  ) : (
                    <div className="bg-muted h-[18rem] flex items-center justify-center text-muted-foreground">About image 2</div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
