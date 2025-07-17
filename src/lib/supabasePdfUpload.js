// src/lib/supabasePdfUpload.js
import { supabase } from './supabaseClient';

/**
 * Uploads a PDF document to Supabase Storage and returns the public URL.
 * @param {File} file - The PDF file to upload
 * @param {string} userId - The user ID for organizing files
 * @param {string} fileName - The original filename
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadPdfToSupabase(file, userId, fileName) {
  const bucket = 'test'; // Using the same bucket as images
  
  // Validate file type (allow PDF only)
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    console.error('Unsupported file type:', file.type, file);
    throw new Error('Only PDF files are allowed.');
  }
  
  // Validate file size (max 10MB for PDFs)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    console.error('File too large:', file.size, file);
    throw new Error('PDF file must be less than 10MB.');
  }

  // Create a unique file path with timestamp to avoid conflicts
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `documents/${userId}/${timestamp}-${sanitizedFileName}`;

  // Log file and path for debugging
  console.log('Uploading PDF file:', file, 'to path:', filePath);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('PDF upload error:', error, 'File:', file, 'Path:', filePath);
    throw new Error(`PDF upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl || '';
}

/**
 * Deletes a PDF document from Supabase Storage.
 * @param {string} fileUrl - The public URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deletePdfFromSupabase(fileUrl) {
  const bucket = 'test';
  
  try {
    // Extract the file path from the public URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('documents')).join('/');
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('PDF deletion error:', error);
      throw new Error(`PDF deletion failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw error;
  }
}
