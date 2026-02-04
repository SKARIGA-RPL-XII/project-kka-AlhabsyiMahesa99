import { supabase } from "@/lib/supabase";

interface CreateCategoryPayload {
  name: string;
  points: number;
  imageFile: File;
}

export async function createCategory({
  name,
  points,
  imageFile,
}: CreateCategoryPayload) {
  // 1. Upload image ke storage
  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `categories/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("waste_categories")
    .upload(filePath, imageFile);

  if (uploadError) {
    throw new Error("Gagal upload gambar");
  }

  // 2. Ambil public URL
  const { data: imageData } = supabase.storage
    .from("waste_categories")
    .getPublicUrl(filePath);

  // 3. Insert ke table
  const { error: insertError } = await supabase
    .from("waste_categories")
    .insert({
      name,
      points_per_kg: points,
      image_url: imageData.publicUrl,
    });

  if (insertError) {
    throw new Error("Gagal menyimpan kategori");
  }

  return true;
}