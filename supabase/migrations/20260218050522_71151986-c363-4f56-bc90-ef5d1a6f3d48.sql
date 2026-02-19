
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS menu_header_image_url text DEFAULT NULL;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_header_image_url text DEFAULT NULL;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_header_image_url text DEFAULT NULL;
