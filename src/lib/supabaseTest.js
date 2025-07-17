// Simple test to verify Firebase connection and document retrieval
import { supabase } from './supabaseClient';
import { getAllDocumentsFromFirestore, getUserDocumentsFromFirestore } from './firebaseService';

/**
 * Test Supabase connection and bucket access
 */
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Buckets error:', bucketsError);
      return { success: false, error: bucketsError };
    }
    
    console.log('Available buckets:', buckets);
    
    // Test specific bucket access
    const { data: files, error: filesError } = await supabase.storage
      .from('test')
      .list('', { limit: 1 });
    
    if (filesError) {
      console.error('Files error:', filesError);
      return { success: false, error: filesError };
    }
    
    console.log('Test bucket access successful');
    return { success: true, buckets, files };
    
  } catch (error) {
    console.error('Connection test error:', error);
    return { success: false, error };
  }
}

/**
 * Test Firebase Firestore connection
 */
export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase Firestore connection...');
    
    // Test getting all documents
    const allDocs = await getAllDocumentsFromFirestore();
    console.log('All documents count:', allDocs.length);
    
    return { success: true, documentCount: allDocs.length };
    
  } catch (error) {
    console.error('Firebase connection test error:', error);
    return { success: false, error };
  }
}
