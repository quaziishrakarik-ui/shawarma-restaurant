import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Location = Tables<"locations">;

const emptyForm = { name: "", address: "", phone: "", whatsapp_number: "", whatsapp_link: "", maps_embed: "" };

export default function LocationsTab() {
  const { data: locations, isLoading } = useLocations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleChange = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleAdd = async () => {
    if (!form.name || !form.address || !form.phone) {
      toast({ title: "Name, address and phone are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("locations").insert(form);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Location added" });
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    setForm(emptyForm);
    setShowAdd(false);
  };

  const startEdit = (loc: Location) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      address: loc.address,
      phone: loc.phone,
      whatsapp_number: loc.whatsapp_number || "",
      whatsapp_link: loc.whatsapp_link || "",
      maps_embed: loc.maps_embed || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from("locations").update(form).eq("id", editingId);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Location updated" });
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Location deleted" });
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
        <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label>Address</Label><Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label>WhatsApp Number</Label><Input value={form.whatsapp_number} onChange={(e) => handleChange("whatsapp_number", e.target.value)} /></div>
        <div className="space-y-1"><Label>WhatsApp Link</Label><Input value={form.whatsapp_link} onChange={(e) => handleChange("whatsapp_link", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label>Google Maps Embed</Label><Textarea rows={3} value={form.maps_embed} onChange={(e) => handleChange("maps_embed", e.target.value)} placeholder='<iframe src="..." />' /></div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1"><Check className="h-4 w-4" />{saving ? "Saving..." : "Save"}</Button>
        <Button onClick={onCancel} variant="outline" size="sm" className="gap-1"><X className="h-4 w-4" />Cancel</Button>
      </div>
    </div>
  );

  if (isLoading) return <div className="space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Locations</h1>
        <Button onClick={() => { setShowAdd(true); setForm(emptyForm); setEditingId(null); }} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showAdd && (
        <Card><CardContent className="p-4">
          <h3 className="font-semibold mb-3">New Location</h3>
          {renderForm(handleAdd, () => { setShowAdd(false); setForm(emptyForm); })}
        </CardContent></Card>
      )}

      {locations?.map((loc) => (
        <Card key={loc.id}>
          <CardContent className="p-4">
            {editingId === loc.id ? (
              <>
                <h3 className="font-semibold mb-3">Edit Location</h3>
                {renderForm(handleUpdate, () => { setEditingId(null); setForm(emptyForm); })}
              </>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{loc.name}</h3>
                  <p className="text-sm text-muted-foreground">{loc.address}</p>
                  <p className="text-sm text-muted-foreground">{loc.phone}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(loc)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(loc.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {(!locations || locations.length === 0) && !showAdd && (
        <p className="text-muted-foreground text-center py-8">No locations yet. Add your first branch.</p>
      )}
    </div>
  );
}
