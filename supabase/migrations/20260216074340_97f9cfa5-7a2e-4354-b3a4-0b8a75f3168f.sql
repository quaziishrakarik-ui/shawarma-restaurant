
-- Add how_we_cook JSONB column for the About page section
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS how_we_cook jsonb NOT NULL DEFAULT '[
  {"title": "Fresh Ingredients", "description": "We source the freshest ingredients from local farms and trusted suppliers every single day.", "image_url": ""},
  {"title": "Traditional Recipes", "description": "Our recipes have been passed down through generations, preserving authentic flavors and techniques.", "image_url": ""},
  {"title": "Crafted with Love", "description": "Every dish is prepared with care and passion by our experienced chefs.", "image_url": ""}
]'::jsonb;
