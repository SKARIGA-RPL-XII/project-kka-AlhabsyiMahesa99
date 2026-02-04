import { supabase } from "@/lib/supabase";

interface UpdateCategoryPayload {
  id: number;
  name: string;
  points: number;
  imageFile?: File | null;
  oldImageUrl?: string | null;
}

export async function updateCategory({
  id,
  name,
  points,
  imageFile,
  oldImageUrl,
}: UpdateCategoryPayload) {
  let imageUrl = oldImageUrl;

  // kalau upload image baru
  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("waste_categories")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error("Gagal upload gambar");
    }

    const { data } = supabase.storage
      .from("waste_categories")
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  // update table
  const { error } = await supabase
    .from("waste_categories")
    .update({
      name,
      points_per_kg: points,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Gagal update kategori");
  }

  return true;
}