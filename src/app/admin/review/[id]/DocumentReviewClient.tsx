
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Check, X, User, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Document } from '@/lib/types';
import { mockDocuments } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DocumentReviewClient({ document }: { document: Document }) {
  const router = useRouter();
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState(document.suggestion || '');
  const [loading, setLoading] = useState(false);
  const driveFolderUrl = "https://drive.google.com/drive/u/5/folders/18tppk1V3BX5aliGjhLwuRHUPNdt-GSaT";

  const updateDocumentStatus = (status: 'Approved' | 'Rejected') => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const docIndex = mockDocuments.findIndex(d => d.id === document.id);
      if (docIndex !== -1) {
        mockDocuments[docIndex].status = status;
        mockDocuments[docIndex].suggestion = suggestion || undefined;
      }
      
      toast({
        title: `Document ${status}`,
        description: `"${document.name}" has been marked as ${status.toLowerCase()}.`,
      });
      router.push('/admin');
      setLoading(false);
    }, 1000);
  };

  const handleApprove = () => {
    updateDocumentStatus('Approved');
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
    updateDocumentStatus('Approved');
  }

  const handleRejectWithSuggestion = () => {
    if (!suggestion.trim()) {
      toast({
        variant: "destructive",
        title: "Suggestion Required",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    updateDocumentStatus('Rejected');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Review Document</CardTitle>
            <CardDescription>
              Open the Google Drive folder to find and review the submitted document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertTitle>Document Review Workflow</AlertTitle>
              <AlertDescription>
                The submitted file is named <strong>{document.name}</strong>. Please find it in the shared Google Drive folder to review its contents.
              </AlertDescription>
            </Alert>

             <Button asChild className="mt-4 w-full">
              <a href={driveFolderUrl} target="_blank" rel="noopener noreferrer">
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
            <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              <Check className="mr-2 h-4 w-4" /> {loading ? "Processing..." : "Approve"}
            </Button>
            <Button onClick={handleApproveWithSuggestion} className="w-full" disabled={loading}>
              <Check className="mr-2 h-4 w-4" /> {loading ? "Processing..." : "Approve with Suggestion"}
            </Button>
            <Button onClick={handleRejectWithSuggestion} variant="destructive" className="w-full" disabled={loading}>
              <X className="mr-2 h-4 w-4" /> {loading ? "Processing..." : "Reject with Suggestion"}
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
