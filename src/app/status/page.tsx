import { documents } from '@/lib/mock-data';
import type { Document, DocumentStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle2, XCircle, Hourglass } from 'lucide-react';

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


export default function StatusPage() {
  const userDocuments = documents; // In a real app, this would be filtered by the current user

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
                <TableHead className="w-[50%]">Document Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userDocuments.map((doc: Document) => (
                <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{doc.name}</span>
                    </div>
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell className="text-right">
                        <StatusBadge status={doc.status} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
