import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { useMenuItem } from "@/hooks/use-menu-items";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useMenuItem(id!);
  const { data: locations } = useLocations();
  const phone = locations?.[0]?.phone;

  if (isLoading) {
    return (
      <div className="container py-10 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Button asChild>
          <Link to="/menu">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link to="/menu">
          <ArrowLeft className="h-4 w-4" /> Back to Menu
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-primary">
              ${Number(item.price).toFixed(2)}
            </span>
            {!item.is_available ? (
              <Badge variant="destructive">Unavailable</Badge>
            ) : (
              <Badge variant="secondary">Available</Badge>
            )}
          </div>
          {item.categories && (
            <p className="text-sm text-muted-foreground mb-4">
              Category: {(item.categories as any).name}
            </p>
          )}
          {item.description && (
            <p className="text-muted-foreground mb-8 leading-relaxed">{item.description}</p>
          )}
          {phone && (
            <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
              <a href={`tel:${phone}`}>
                <Phone className="h-5 w-5" /> Call to Order
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
