
-- Special offer categories
CREATE TABLE public.special_offer_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.special_offer_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read special_offer_categories" ON public.special_offer_categories FOR SELECT USING (true);
CREATE POLICY "Admin insert special_offer_categories" ON public.special_offer_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update special_offer_categories" ON public.special_offer_categories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete special_offer_categories" ON public.special_offer_categories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Special offer items
CREATE TABLE public.special_offer_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES public.special_offer_categories(id) ON DELETE SET NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.special_offer_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read special_offer_items" ON public.special_offer_items FOR SELECT USING (true);
CREATE POLICY "Admin insert special_offer_items" ON public.special_offer_items FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update special_offer_items" ON public.special_offer_items FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete special_offer_items" ON public.special_offer_items FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_special_offer_items_updated_at
  BEFORE UPDATE ON public.special_offer_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
