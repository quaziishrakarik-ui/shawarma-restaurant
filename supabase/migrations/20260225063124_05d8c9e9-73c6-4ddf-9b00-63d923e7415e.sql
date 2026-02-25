
-- Add special_offer_category_id to menu_items
ALTER TABLE public.menu_items
ADD COLUMN special_offer_category_id uuid REFERENCES public.special_offer_categories(id) ON DELETE SET NULL;

-- Drop special_offer_items table and its policies
DROP POLICY IF EXISTS "Admin delete special_offer_items" ON public.special_offer_items;
DROP POLICY IF EXISTS "Admin insert special_offer_items" ON public.special_offer_items;
DROP POLICY IF EXISTS "Admin update special_offer_items" ON public.special_offer_items;
DROP POLICY IF EXISTS "Public read special_offer_items" ON public.special_offer_items;
DROP TABLE IF EXISTS public.special_offer_items;
