import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMenuItems(categoryId?: string) {
  return useQuery({
    queryKey: ["menu-items", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("menu_items")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useFeaturedItems() {
  return useQuery({
    queryKey: ["menu-items", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, categories(name)")
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu-item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, categories(name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
