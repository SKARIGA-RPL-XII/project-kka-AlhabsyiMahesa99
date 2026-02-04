import { supabase } from "@/lib/supabase";

export async function deleteCategory(id: string, imageUrl?: string | null) {
  // 1. hapus file di storage (kalau ada)
  if (imageUrl) {
    const filePath = imageUrl.split("/storage/v1/object/public/waste_categories/")[1];

    if (filePath) {
      await supabase.storage
        .from("waste_categories")
        .remove([filePath]);
    }
  }

  // 2. hapus data di database
  const { error } = await supabase
    .from("waste_categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}