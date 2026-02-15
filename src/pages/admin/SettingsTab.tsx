import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload } from "lucide-react";

export default function SettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setForm({
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        about_title: settings.about_title,
        about_description: settings.about_description,
        locations_section_title: settings.locations_section_title,
        facebook_url: settings.facebook_url || "",
        instagram_url: settings.instagram_url || "",
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        background_color: settings.background_color,
      });
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update(form)
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved" });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    }
  };

  const handleImageUpload = async (field: string, file: File) => {
    setUploading(field);
    const ext = file.name.split(".").pop();
    const path = `${field}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
    await supabase.from("site_settings").update({ [field]: urlData.publicUrl }).eq("id", settings!.id);
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast({ title: "Image uploaded" });
    setUploading(null);
  };

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>;

  const imageFields = [
    { key: "hero_image_url", label: "Hero Background Image" },
    { key: "about_image_url", label: "About Image" },
    { key: "logo_url", label: "Logo" },
    { key: "favicon_url", label: "Favicon" },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Website Settings</h1>

      {/* Site Name */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Site Name</h2>
        <div className="space-y-2">
          <Label>Site Name (shown in navbar & browser tab)</Label>
          <Input value={form.seo_title || ""} onChange={(e) => handleChange("seo_title", e.target.value)} />
        </div>
      </div>

      {/* Text fields */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Hero Section</h2>
        <div className="space-y-2">
          <Label>Hero Title</Label>
          <Input value={form.hero_title || ""} onChange={(e) => handleChange("hero_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Hero Subtitle</Label>
          <Input value={form.hero_subtitle || ""} onChange={(e) => handleChange("hero_subtitle", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">About Section</h2>
        <div className="space-y-2">
          <Label>About Title</Label>
          <Input value={form.about_title || ""} onChange={(e) => handleChange("about_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>About Description</Label>
          <Textarea rows={4} value={form.about_description || ""} onChange={(e) => handleChange("about_description", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Locations Section Title</Label>
          <Input value={form.locations_section_title || ""} onChange={(e) => handleChange("locations_section_title", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Social Media</h2>
        <div className="space-y-2">
          <Label>Facebook URL</Label>
          <Input value={form.facebook_url || ""} onChange={(e) => handleChange("facebook_url", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Instagram URL</Label>
          <Input value={form.instagram_url || ""} onChange={(e) => handleChange("instagram_url", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">SEO</h2>
        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input value={form.seo_title || ""} onChange={(e) => handleChange("seo_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea rows={2} value={form.seo_description || ""} onChange={(e) => handleChange("seo_description", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Colors (HSL format)</h2>
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <Input value={form.primary_color || ""} onChange={(e) => handleChange("primary_color", e.target.value)} placeholder="24 80% 50%" />
        </div>
        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <Input value={form.secondary_color || ""} onChange={(e) => handleChange("secondary_color", e.target.value)} placeholder="45 90% 55%" />
        </div>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <Input value={form.background_color || ""} onChange={(e) => handleChange("background_color", e.target.value)} placeholder="0 0% 100%" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? "Saving..." : "Save Settings"}
      </Button>

      {/* Image uploads */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Images</h2>
        {imageFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            {settings?.[key as keyof typeof settings] && (
              <img
                src={settings[key as keyof typeof settings] as string}
                alt={label}
                className="h-24 w-auto rounded border object-cover"
              />
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                disabled={uploading === key}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(key, file);
                }}
              />
              {uploading === key && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
