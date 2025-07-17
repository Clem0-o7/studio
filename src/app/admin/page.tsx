
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Document, DocumentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, FileType, CheckCircle2, XCircle, Hourglass, Filter, X } from 'lucide-react';
import { withAuth, getUsernameFromEmail } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllDocumentsFromFirestore } from '@/lib/firebaseService';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { debugDocuments } from '@/lib/debugUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  switch (status) {
    case 'Approved':
      return (
        <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground gap-2 border-transparent">
          <CheckCircle2 className="h-4 w-4" />
          Approved
        </Badge>
      );
    case 'Declined':
      return (
        <Badge variant="destructive" className="gap-2">
          <XCircle className="h-4 w-4" />
          Declined
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


function AdminDashboardPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const allDocuments = await getAllDocumentsFromFirestore();
        setDocuments(allDocuments);
        setFilteredDocuments(allDocuments);
        
        // Debug: Log document structure
        console.log('=== ADMIN DEBUG ===');
        await debugDocuments();
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documents. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  // Filter documents based on user, status, and search query
  useEffect(() => {
    let filtered = documents;

    // Filter by user
    if (userFilter !== 'all') {
      filtered = filtered.filter(doc => doc.userEmail === userFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Filter by search query (document name)
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, userFilter, statusFilter, searchQuery]);

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(new Set(documents.map(doc => doc.userEmail)))
    .map(email => ({
      email,
      username: getUsernameFromEmail(email)
    }))
    .sort((a, b) => a.username.localeCompare(b.username));

  const clearFilters = () => {
    setUserFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>Review and manage all document submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
          {(userFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim()) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters active
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            {(userFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim()) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Upload Date-Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin Action Time</TableHead>
                <TableHead>Suggestions</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={7}>
                        <Skeleton className="h-8 w-full" />
                    </TableCell>
                </TableRow>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc: Document) => (
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
                        {getUsernameFromEmail(doc.userEmail)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(doc.uploadDate).toLocaleDateString()}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(doc.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell>
                      {doc.adminDecisionDate && doc.status !== 'Pending' ? (
                        <div className="text-sm">
                          <div>{new Date(doc.adminDecisionDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground text-xs">
                            {new Date(doc.adminDecisionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {doc.adminDecisionBy && (
                              <div>by {getUsernameFromEmail(doc.adminDecisionBy)}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[200px]">
                      <div className="truncate" title={doc.suggestion || '-'}>
                        {doc.suggestion || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link href={`/admin/review/${doc.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    {documents.length === 0 
                      ? "No documents have been submitted yet."
                      : "No documents match the current filters."
                    }
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
