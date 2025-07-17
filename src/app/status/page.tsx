
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Document, DocumentStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle2, XCircle, Hourglass } from 'lucide-react';
import { withAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDocuments } from '@/lib/mock-data';

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  switch (status) {
    case 'Approved':
      return (
        <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground gap-2 border-transparent">
          <CheckCircle2 className="h-4 w-4" />
          Approved
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge variant="destructive" className="gap-2">
          <XCircle className="h-4 w-4" />
          Rejected
        </Badge>
      );
    case 'Pending':
      return (
        <Badge variant="secondary" className="gap-2">
          <Hourglass className="h-4 w-4" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


function StatusPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // Simulate fetching documents for the current user from mock data
    setTimeout(() => {
        const userDocuments = mockDocuments.filter(doc => doc.userId === user.uid);
        setDocuments(userDocuments);
        setLoading(false);
    }, 500);
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Status</CardTitle>
        <CardDescription>Here is a list of your uploaded documents and their current approval status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Document Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Suggestion</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                    <TableCell colSpan={4}>
                       <Skeleton className="h-8 w-full" />
                    </TableCell>
                </TableRow>
              ) : documents.length > 0 ? (
                documents.map((doc: Document) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{doc.suggestion || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={doc.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    You have not uploaded any documents yet.
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

export default withAuth(StatusPage);
