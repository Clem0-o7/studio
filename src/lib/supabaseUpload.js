// src/utils/supabaseUpload.js
import { supabase } from './supabaseClient';

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param {File} file - The file to upload
 * @param {string} path - Path inside the bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadImageToSupabase(file, path) {
  const bucket = 'test'; // ✅ your bucket name

  // Validate file type (allow jpg, jpeg, png, gif)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    console.error('Unsupported file type:', file.type, file);
    throw new Error('Only JPG, PNG, and GIF images are allowed.');
  }
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    console.error('File too large:', file.size, file);
    throw new Error('Image must be less than 5MB.');
  }

  // Log file and path for debugging
  console.log('Uploading file:', file, 'to path:', path);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error('Upload error:', error, 'File:', file, 'Path:', path);
    throw new Error('Image upload failed');
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData?.publicUrl || '';
}
