import { useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

export default function CategoriesTab() {
  const { data: categories, isLoading } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const sortOrder = (categories?.length || 0);
    const { error } = await supabase.from("categories").insert({ name: name.trim(), sort_order: sortOrder });
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Category added" });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setName("");
    setShowAdd(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("categories").update({ name: name.trim() }).eq("id", editingId);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Category updated" });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setEditingId(null);
    setName("");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Category deleted" });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { setShowAdd(true); setName(""); setEditingId(null); }} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showAdd && (
        <Card><CardContent className="p-4 flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="flex-1" />
          <Button onClick={handleAdd} disabled={saving} size="sm"><Check className="h-4 w-4" /></Button>
          <Button onClick={() => { setShowAdd(false); setName(""); }} variant="outline" size="sm"><X className="h-4 w-4" /></Button>
        </CardContent></Card>
      )}

      {categories?.map((cat) => (
        <Card key={cat.id}>
          <CardContent className="p-4 flex items-center gap-3">
            {editingId === cat.id ? (
              <>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
                <Button onClick={handleUpdate} disabled={saving} size="sm"><Check className="h-4 w-4" /></Button>
                <Button onClick={() => { setEditingId(null); setName(""); }} variant="outline" size="sm"><X className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{cat.name}</span>
                <Button variant="ghost" size="icon" onClick={() => { setEditingId(cat.id); setName(cat.name); setShowAdd(false); }}><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {(!categories || categories.length === 0) && !showAdd && (
        <p className="text-muted-foreground text-center py-8">No categories yet.</p>
      )}
    </div>
  );
}
