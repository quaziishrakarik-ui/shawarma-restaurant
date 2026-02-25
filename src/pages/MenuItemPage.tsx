import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useMenuItem } from "@/hooks/use-menu-items";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useMenuItem(id!);
  const { data: locations } = useLocations();
  const [callDialogOpen, setCallDialogOpen] = useState(false);

  if (isLoading) {
    return (
        <div className="pt-20">
        <div className="container py-16 max-w-5xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid gap-12 md:grid-cols-2">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-20 container py-20 text-center">
        <h1 className="text-3xl font-display font-semibold mb-4">Item not found</h1>
        <Button asChild variant="outline" className="rounded-none px-8 py-5 text-xs tracking-[0.2em] uppercase">
          <Link to="/menu">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container py-16 max-w-5xl">
        <Button variant="ghost" asChild className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/menu">
            <ArrowLeft className="h-4 w-4" /> Back to Menu
          </Link>
        </Button>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-lg pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-lg pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">{item.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-body font-medium text-primary">
                ৳{Number(item.price).toFixed(2)}
              </span>
              {!item.is_available ? (
                <Badge variant="destructive" className="rounded-none text-[10px] tracking-wider uppercase">Unavailable</Badge>
              ) : (
                <Badge className="rounded-none text-[10px] tracking-wider uppercase bg-primary/10 text-primary border-0">Available</Badge>
              )}
            </div>
            {item.categories && (
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                {(item.categories as any).name}
              </p>
            )}
            {item.description && (
              <p className="text-muted-foreground mb-10 leading-relaxed text-lg font-light">{item.description}</p>
            )}
            {locations && locations.length > 0 && (
              <Button
                size="lg"
                onClick={() => setCallDialogOpen(true)}
                className="gap-3 rounded-none px-10 py-7 text-xs tracking-[0.15em] uppercase w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_10px_40px_-10px_hsl(38_72%_50%_/_0.3)]"
              >
                <Phone className="h-4 w-4" /> Call to Order
              </Button>
            )}

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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
