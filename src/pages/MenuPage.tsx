import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useCategories } from "@/hooks/use-categories";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

function ItemCard({ item, i }: { item: any; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.5 }}
    >
      <Link to={`/menu/${item.id}`}>
        <Card
          className={`overflow-hidden group border border-primary/20 shadow-[0_0_30px_-10px_hsl(var(--primary)_/_0.12)] bg-transparent transition-opacity ${
            !item.is_available ? "opacity-50" : ""
          }`}
        >
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
            {!item.is_available && (
              <Badge variant="destructive" className="absolute top-3 right-3 rounded-none text-[10px] tracking-wider uppercase">
                Unavailable
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <CardContent className="px-1 pt-5 pb-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-medium">{item.name}</h3>
                {item.categories && (
                  <span className="text-xs text-muted-foreground tracking-wide">
                    {(item.categories as any).name}
                  </span>
                )}
              </div>
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
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: items, isLoading: itemsLoading } = useMenuItems(selectedCategory);
  const { data: settings } = useSiteSettings();

  return (
    <div>
      <PageHeader
        tagline="Discover"
        title="Our Menu"
        imageUrl={(settings as any)?.menu_header_image_url}
      />

      <div className="container py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground/60 border-border hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          {catLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24" />)
            : categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground/60 border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
        </div>

        {/* Items Grid */}
        {itemsLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} i={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16 font-light text-lg">No menu items found.</p>
        )}
      </div>

    </div>
  );
}
