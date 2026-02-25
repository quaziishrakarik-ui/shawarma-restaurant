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
import { Plus, Trash2 } from "lucide-react";

interface TitleLine {
  text: string;
  color: string;
}

interface HowWeCookItem {
  title: string;
  description: string;
  image_url: string;
}

export default function SettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [titleLines, setTitleLines] = useState<TitleLine[]>([]);
  const [howWeCook, setHowWeCook] = useState<HowWeCookItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setForm({
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_tagline: (settings as any).hero_tagline || "Authentic Middle Eastern",
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
        footer_bg_color: (settings as any).footer_bg_color || "220 20% 92%",
      });
      const lines = (settings as any).hero_title_lines;
      if (lines) {
        setTitleLines(typeof lines === "string" ? JSON.parse(lines) : lines);
      }
      const cook = (settings as any).how_we_cook;
      if (cook) {
        setHowWeCook(typeof cook === "string" ? JSON.parse(cook) : cook);
      }
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
      .update({ ...form, hero_title_lines: titleLines, how_we_cook: howWeCook } as any)
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
    await supabase.from("site_settings").update({ [field]: urlData.publicUrl } as any).eq("id", settings!.id);
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast({ title: "Image uploaded" });
    setUploading(null);
  };

  const handleArrayImageUpload = async (field: string, file: File, index?: number) => {
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
    const current: string[] = (settings as any)?.[field]
      ? (typeof (settings as any)[field] === "string" ? JSON.parse((settings as any)[field]) : (settings as any)[field])
      : [];
    let updated: string[];
    if (index !== undefined && index < current.length) {
      updated = [...current];
      updated[index] = urlData.publicUrl;
    } else {
      updated = [...current, urlData.publicUrl];
    }
    await supabase.from("site_settings").update({ [field]: updated } as any).eq("id", settings!.id);
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast({ title: "Image uploaded" });
    setUploading(null);
  };

  const handleRemoveArrayImage = async (field: string, index: number) => {
    const current: string[] = (settings as any)?.[field]
      ? (typeof (settings as any)[field] === "string" ? JSON.parse((settings as any)[field]) : (settings as any)[field])
      : [];
    const updated = current.filter((_, i) => i !== index);
    await supabase.from("site_settings").update({ [field]: updated } as any).eq("id", settings!.id);
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast({ title: "Image removed" });
  };

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>;

  const imageFields = [
    { key: "hero_image_url", label: "Hero Background Image (Desktop)" },
    { key: "hero_image_mobile_url", label: "Hero Background Image (Mobile)" },
    { key: "about_image_url", label: "About Image 1 (Left/Large)" },
    { key: "about_image_2_url", label: "About Image 2 (Right/Small)" },
    { key: "logo_url", label: "Logo" },
    { key: "favicon_url", label: "Favicon" },
    { key: "menu_header_image_url", label: "Menu Page Header Image" },
    { key: "about_header_image_url", label: "About Page Header Image" },
    { key: "contact_header_image_url", label: "Contact Page Header Image" },
    { key: "locations_header_image_url", label: "Locations Header Image" },
    { key: "how_we_cook_header_image_url", label: "How We Cook Header Image" },
  ];

  const getArrayImages = (field: string): string[] => {
    const val = (settings as any)?.[field];
    if (!val) return [];
    return typeof val === "string" ? JSON.parse(val) : val;
  };

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

      {/* Hero Tagline */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Hero Tagline</h2>
        <div className="space-y-2">
          <Label>Tagline (e.g. "Authentic Middle Eastern")</Label>
          <Input value={form.hero_tagline || ""} onChange={(e) => handleChange("hero_tagline", e.target.value)} />
        </div>
      </div>

      {/* Hero Title Lines */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Hero Title Lines</h2>
        <p className="text-sm text-muted-foreground">Each line of the hero title. Set text and color (HSL) for each line.</p>
        {titleLines.map((line, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label>Line {i + 1} Text</Label>
              <Input
                value={line.text}
                onChange={(e) => {
                  const updated = [...titleLines];
                  updated[i] = { ...updated[i], text: e.target.value };
                  setTitleLines(updated);
                }}
              />
            </div>
            <div className="w-40 space-y-1">
              <Label>Color (HSL)</Label>
              <Input
                value={line.color}
                placeholder="0 72% 51%"
                onChange={(e) => {
                  const updated = [...titleLines];
                  updated[i] = { ...updated[i], color: e.target.value };
                  setTitleLines(updated);
                }}
              />
            </div>
            <div
              className="h-10 w-10 rounded border shrink-0"
              style={{ backgroundColor: `hsl(${line.color})` }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTitleLines(titleLines.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTitleLines([...titleLines, { text: "", color: "0 0% 20%" }])}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add Line
        </Button>
      </div>

      {/* About Section */}
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

      {/* Social Media */}
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

      {/* SEO */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">SEO</h2>
        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea rows={2} value={form.seo_description || ""} onChange={(e) => handleChange("seo_description", e.target.value)} />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Colors (HSL format)</h2>
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex gap-2 items-center">
            <Input value={form.primary_color || ""} onChange={(e) => handleChange("primary_color", e.target.value)} placeholder="0 72% 51%" />
            <div className="h-10 w-10 rounded border shrink-0" style={{ backgroundColor: `hsl(${form.primary_color})` }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <div className="flex gap-2 items-center">
            <Input value={form.secondary_color || ""} onChange={(e) => handleChange("secondary_color", e.target.value)} placeholder="35 30% 95%" />
            <div className="h-10 w-10 rounded border shrink-0" style={{ backgroundColor: `hsl(${form.secondary_color})` }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2 items-center">
            <Input value={form.background_color || ""} onChange={(e) => handleChange("background_color", e.target.value)} placeholder="0 0% 100%" />
            <div className="h-10 w-10 rounded border shrink-0" style={{ backgroundColor: `hsl(${form.background_color})` }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Footer Background Color</Label>
          <div className="flex gap-2 items-center">
            <Input value={form.footer_bg_color || ""} onChange={(e) => handleChange("footer_bg_color", e.target.value)} placeholder="220 20% 92%" />
            <div className="h-10 w-10 rounded border shrink-0" style={{ backgroundColor: `hsl(${form.footer_bg_color})` }} />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? "Saving..." : "Save Settings"}
      </Button>

      {/* Single Image uploads */}
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
        ))}
      </div>


      {/* How We Cook Section */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">How We Cook (About Page)</h2>
        <p className="text-sm text-muted-foreground">Alternating text/image blocks shown on the About page.</p>
        {howWeCook.map((item, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Block {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => setHowWeCook(howWeCook.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) => {
                  const updated = [...howWeCook];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setHowWeCook(updated);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={item.description}
                onChange={(e) => {
                  const updated = [...howWeCook];
                  updated[i] = { ...updated[i], description: e.target.value };
                  setHowWeCook(updated);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Image</Label>
              {item.image_url && <img src={item.image_url} alt={item.title} className="h-24 w-auto rounded border object-cover" />}
              <Input
                type="file"
                accept="image/*"
                disabled={uploading === `how_we_cook_${i}`}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(`how_we_cook_${i}`);
                  const ext = file.name.split(".").pop();
                  const path = `how_we_cook/${Date.now()}.${ext}`;
                  const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
                  if (uploadError) {
                    toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
                    setUploading(null);
                    return;
                  }
                  const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
                  const updated = [...howWeCook];
                  updated[i] = { ...updated[i], image_url: urlData.publicUrl };
                  setHowWeCook(updated);
                  setUploading(null);
                  toast({ title: "Image uploaded" });
                }}
              />
              {uploading === `how_we_cook_${i}` && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHowWeCook([...howWeCook, { title: "", description: "", image_url: "" }])}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add Block
        </Button>
      </div>
    </div>
  );
}
