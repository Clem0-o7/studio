
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Check, MessageSquare, X, User, Calendar, FileType, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Document } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const G_DRIVE_FOLDER_URL = "https://drive.google.com/drive/u/5/folders/18tppk1V3BX5aliGjhLwuRHUPNdt-GSaT";

export function DocumentReviewClient({ document }: { document: Document }) {
  const router = useRouter();
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const updateDocumentStatus = async (status: 'Approved' | 'Rejected', statusMessage: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'documents', document.id);
      await updateDoc(docRef, { 
        status: status,
        suggestion: suggestion || null,
      });
      toast({
        title: statusMessage,
        description: `"${document.name}" has been marked as ${status.toLowerCase()}.`,
        className: status === 'Approved' ? "bg-accent text-accent-foreground border-accent" : undefined,
        variant: status === 'Rejected' ? "destructive" : "default",
      });
      router.push('/admin');
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the document status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleApprove = () => {
    updateDocumentStatus('Approved', 'Document Approved');
  };

  const handleApproveWithSuggestion = () => {
    if (!suggestion.trim()) {
      toast({
        variant: "destructive",
        title: "Suggestion Required",
        description: "Please provide a suggestion before approving.",
      });
      return;
    }
    updateDocumentStatus('Approved', 'Document Approved with Suggestions');
  };

  const handleRejectWithSuggestion = () => {
    if (!suggestion.trim()) {
      toast({
        variant: "destructive",
        title: "Suggestion Required",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    updateDocumentStatus('Rejected', 'Document Rejected with Suggestion');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="h-full">
           <CardHeader>
            <CardTitle>Review Document</CardTitle>
            <CardDescription>
                Check the shared Google Drive folder for the uploaded document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <FileType className="h-4 w-4" />
              <AlertTitle>Manual Document Retrieval</AlertTitle>
              <AlertDescription>
                This system tracks document metadata. The actual file should be located in the shared Google Drive folder.
                <br />
                Document Name: <strong>{document.name}</strong>
              </AlertDescription>
            </Alert>

            <Button asChild className="mt-4 w-full">
              <a href={G_DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Open Google Drive Folder
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="truncate">{document.name}</CardTitle>
            <CardDescription>Details and actions for this document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>Submitted by: <strong className="font-semibold">{document.userEmail}</strong></span>
            </div>
            <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>Uploaded on: <strong className="font-semibold">{new Date(document.uploadDate).toLocaleDateString()}</strong></span>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
                <Label htmlFor="suggestion">Suggestions / Rejection Reason</Label>
                <Textarea 
                    id="suggestion" 
                    placeholder="Provide feedback here..." 
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    disabled={loading}
                />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-0">
            <Button onClick={handleApprove} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground" disabled={loading}>
              <Check className="mr-2 h-4 w-4" /> {loading ? "Approving..." : "Approve"}
            </Button>
             <Button onClick={handleApproveWithSuggestion} className="w-full" variant="secondary" disabled={loading}>
              <MessageSquare className="mr-2 h-4 w-4" /> {loading ? "Approving..." : "Approve with Suggestions"}
            </Button>
            <Button onClick={handleRejectWithSuggestion} variant="destructive" className="w-full" disabled={loading}>
              <X className="mr-2 h-4 w-4" /> {loading ? "Rejecting..." : "Reject with Suggestion"}
            </Button>
            <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to List</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
