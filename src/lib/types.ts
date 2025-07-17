
export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';

export type Document = {
  id: string;
  name: string;
  userId: string;
  userEmail: string;
  uploadDate: string; // ISO 8601 date string
  status: DocumentStatus;
  suggestion?: string;
  url: string; 
  fileSize?: number;
  fileType?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
