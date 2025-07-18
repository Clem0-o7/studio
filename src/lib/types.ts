
export type DocumentStatus = 'Pending' | 'Approved' | 'Declined';

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
  adminDecisionDate?: string; // ISO 8601 date string for when admin made the decision
  adminDecisionBy?: string; // Email of admin who made the decision
  reason?: string; // Reason for document upload provided by user
};
