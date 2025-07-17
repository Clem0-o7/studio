export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';

export type Document = {
  id: string;
  name: string;
  user: string;
  uploadDate: string;
  status: DocumentStatus;
  type: 'PDF' | 'Image' | 'Word';
  url: string;
};
