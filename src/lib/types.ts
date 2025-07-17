
export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';

export type Document = {
  id: string;
  name: string;
  userId: string;
  userEmail: string;
  uploadDate: any; // Firestore timestamp
  status: DocumentStatus;
  suggestion?: string;
  url?: string; // This is now optional as we link to a folder
};
