import { supabase } from "../Utils/supabase";

export async function uploadImageToSupabase(file) {
  if (!file) throw new Error("No file provided");

  // sanitize filename
  const sanitizedFilename = file.name
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");

  const filePath = sanitizedFilename;

  // upload to your existing public bucket
  const { data, error } = await supabase.storage
    .from("livreluxe-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // overwrite duplicates
    });

  if (error) throw error;

  // get public URL
  const { data: publicUrlData } = supabase.storage
    .from("livreluxe-files")
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    filename: sanitizedFilename,
  };
}
