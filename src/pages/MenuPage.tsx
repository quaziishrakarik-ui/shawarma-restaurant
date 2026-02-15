import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useCategories } from "@/hooks/use-categories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: items, isLoading: itemsLoading } = useMenuItems(selectedCategory);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(undefined)}
        >
          All
        </Button>
        {catLoading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-20 rounded-md" />)
          : categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
      </div>

      {/* Items Grid */}
      {itemsLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/menu/${item.id}`}>
                <Card
                  className={`overflow-hidden group hover:shadow-lg transition-shadow ${
                    !item.is_available ? "opacity-60" : ""
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
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
                    {!item.is_available && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.categories && (
                          <span className="text-xs text-muted-foreground">
                            {(item.categories as any).name}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        ${Number(item.price).toFixed(2)}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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
        <p className="text-center text-muted-foreground py-10">No menu items found.</p>
      )}
    </div>
  );
}
