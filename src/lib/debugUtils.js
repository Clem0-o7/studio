// Debug utility for checking document structure
import { getAllDocumentsFromFirestore } from './firebaseService';

export async function debugDocuments() {
  try {
    const docs = await getAllDocumentsFromFirestore();
    console.log('=== DOCUMENT DEBUG ===');
    console.log('Total documents:', docs.length);
    
    docs.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`, {
        id: doc.id,
        name: doc.name,
        url: doc.url,
        userId: doc.userId,
        userEmail: doc.userEmail,
        status: doc.status,
        uploadDate: doc.uploadDate,
        createdAt: doc.createdAt,
        fileSize: doc.fileSize,
        fileType: doc.fileType
      });
    });
    
    return docs;
  } catch (error) {
    console.error('Debug error:', error);
    return [];
  }
}
