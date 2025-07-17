
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Document } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, FileType } from 'lucide-react';
import { withAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDocuments } from '@/lib/mock-data';

function AdminDashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching all documents for admin
    setLoading(true);
    setTimeout(() => {
        setDocuments(mockDocuments);
        setLoading(false);
    }, 500);
  }, []);

  const pendingDocuments = documents.filter(d => d.status === 'Pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>Review and approve pending document submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={4}>
                        <Skeleton className="h-8 w-full" />
                    </TableCell>
                </TableRow>
              ) : pendingDocuments.length > 0 ? (
                pendingDocuments.map((doc: Document) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileType className="h-4 w-4 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {doc.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link href={`/admin/review/${doc.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No pending documents to review.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default withAuth(AdminDashboardPage, { adminOnly: true });
