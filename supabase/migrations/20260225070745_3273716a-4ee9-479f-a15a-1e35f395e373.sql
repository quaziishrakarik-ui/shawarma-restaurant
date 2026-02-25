
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS special_offer_category_id;
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS is_special_offer;
DROP TABLE IF EXISTS public.special_offer_categories;
