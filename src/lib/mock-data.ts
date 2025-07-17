import type { Document } from './types';

export const documents: Document[] = [
  { id: '1', name: 'Q1_Financial_Report.pdf', user: 'Alice Johnson', uploadDate: '2024-07-15', status: 'Approved', type: 'PDF', url: 'https://placehold.co/850x1100.png' },
  { id: '2', name: 'Marketing_Proposal_v2.docx', user: 'Bob Williams', uploadDate: '2024-07-18', status: 'Pending', type: 'Word', url: 'https://placehold.co/850x1100.png' },
  { id: '3', name: 'Company_ID_Scan.jpg', user: 'Charlie Brown', uploadDate: '2024-07-20', status: 'Pending', type: 'Image', url: 'https://placehold.co/600x400.png' },
  { id: '4', name: 'Legal_Agreement.pdf', user: 'Diana Prince', uploadDate: '2024-07-21', status: 'Rejected', type: 'PDF', url: 'https://placehold.co/850x1100.png' },
  { id: '5', name: 'Project_Blueprints.pdf', user: 'Eve Adams', uploadDate: '2024-07-22', status: 'Pending', type: 'PDF', url: 'https://placehold.co/850x1100.png' },
];
