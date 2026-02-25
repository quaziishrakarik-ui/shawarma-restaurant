import { useState } from "react";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useCategories } from "@/hooks/use-categories";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

const emptyForm = {
  name: "", description: "", price: "", category_id: "", image_url: "",
  is_available: true, is_featured: false, tag: "",
};

export default function MenuItemsTab() {
  const { data: items, isLoading } = useMenuItems();
  const { data: categories } = useCategories();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleChange = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const buildPayload = () => ({
    name: form.name,
    description: form.description || null,
    price: parseFloat(form.price) || 0,
    category_id: form.category_id || null,
    is_available: form.is_available,
    is_featured: form.is_featured,
    tag: form.tag || null,
  });

  const handleAdd = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("menu_items").insert(buildPayload());
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Menu item added" });
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    setForm(emptyForm);
    setShowAdd(false);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from("menu_items").update(buildPayload()).eq("id", editingId);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Menu item updated" });
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Menu item deleted" });
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
  };

  const handleImageUpload = async (itemId: string, file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `menu/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
    await supabase.from("menu_items").update({ image_url: urlData.publicUrl }).eq("id", itemId);
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    toast({ title: "Image uploaded" });
    setUploading(false);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setShowAdd(false);
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category_id: item.category_id || "",
      image_url: item.image_url || "",
      is_available: item.is_available,
      is_featured: item.is_featured,
      tag: item.tag || "",
    });
  };

  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
        <div className="space-y-1"><Label>Price</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => handleChange("price", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} /></div>
      <div className="space-y-1"><Label>Tag <span className="text-muted-foreground text-xs">(e.g. "20% off", "New")</span></Label><Input value={form.tag} onChange={(e) => handleChange("tag", e.target.value)} placeholder="Optional tag label" /></div>
      <div className="space-y-1">
        <Label>Category</Label>
        <Select value={form.category_id} onValueChange={(v) => handleChange("category_id", v)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2"><Switch checked={form.is_available} onCheckedChange={(v) => handleChange("is_available", v)} /><Label>Available</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => handleChange("is_featured", v)} /><Label>Featured</Label></div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1"><Check className="h-4 w-4" />{saving ? "Saving..." : "Save"}</Button>
        <Button onClick={onCancel} variant="outline" size="sm" className="gap-1"><X className="h-4 w-4" />Cancel</Button>
      </div>
    </div>
  );

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={() => { setShowAdd(true); setForm(emptyForm); setEditingId(null); }} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showAdd && (
        <Card><CardContent className="p-4">
          <h3 className="font-semibold mb-3">New Menu Item</h3>
          {renderForm(handleAdd, () => { setShowAdd(false); setForm(emptyForm); })}
        </CardContent></Card>
      )}

      {items?.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            {editingId === item.id ? (
              <>
                <h3 className="font-semibold mb-3">Edit Menu Item</h3>
                {renderForm(handleUpdate, () => { setEditingId(null); setForm(emptyForm); })}
              </>
            ) : (
              <div className="flex gap-4">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="h-20 w-20 rounded object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">৳{Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {item.categories && <Badge variant="outline" className="text-xs">{(item.categories as any).name}</Badge>}
                    {!item.is_available && <Badge variant="destructive" className="text-xs">Unavailable</Badge>}
                    {item.is_featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                    
                    {item.tag && <Badge variant="outline" className="text-xs">{item.tag}</Badge>}
                  </div>
                  {/* Image upload */}
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      className="text-xs h-8"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(item.id, file);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {(!items || items.length === 0) && !showAdd && (
        <p className="text-muted-foreground text-center py-8">No menu items yet.</p>
      )}
    </div>
  );
}
