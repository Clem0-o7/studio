
import type { Document } from './types';

export const mockDocuments: Document[] = [
  {
    id: 'doc_1',
    name: 'Q1_Financial_Report.pdf',
    userId: 'user123',
    userEmail: 'student@example.com',
    uploadDate: new Date('2023-10-26').toISOString(),
    status: 'Pending',
    url: '#',
  },
  {
    id: 'doc_2',
    name: 'Project_Proposal_V2.docx',
    userId: 'user456',
    userEmail: 'another.student@example.com',
    uploadDate: new Date('2023-10-25').toISOString(),
    status: 'Pending',
    url: '#',
  },
  {
    id: 'doc_3',
    name: 'Marketing_Brief.pdf',
    userId: 'user123',
    userEmail: 'student@example.com',
    uploadDate: new Date('2023-10-24').toISOString(),
    status: 'Approved',
    suggestion: 'Excellent work, no changes needed.',
    url: '#',
  },
  {
    id: 'doc_4',
    name: 'Research_Paper_Draft.docx',
    userId: 'user123',
    userEmail: 'student@example.com',
    uploadDate: new Date('2023-10-20').toISOString(),
    status: 'Declined',
    suggestion: 'Please include a bibliography and resubmit.',
    url: '#',
  },
    {
    id: 'doc_5',
    name: 'Annual_Compliance_Review.pdf',
    userId: 'user789',
    userEmail: 'third.user@example.com',
    uploadDate: new Date('2023-10-22').toISOString(),
    status: 'Pending',
    url: '#',
  },
];
