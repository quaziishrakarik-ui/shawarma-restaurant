
-- Add new columns for the hero redesign
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_title_lines JSONB NOT NULL DEFAULT '[{"text": "Your Meals", "color": "0 0% 20%"}, {"text": "Cooked to", "color": "0 0% 20%"}, {"text": "Perfection.", "color": "0 80% 50%"}]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_food_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_overlay_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_bg_color TEXT NOT NULL DEFAULT '220 20% 92%';
