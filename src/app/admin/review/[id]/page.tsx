'use client';

import { useRouter } from 'next/navigation';
import { documents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Check, X, User, Calendar, FileType, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DocumentReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const document = documents.find(d => d.id === params.id);

  if (!document) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Document Not Found</h2>
        <p className="text-muted-foreground">The document you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const handleApprove = () => {
    // In a real app, update the document status in the database
    toast({
      title: "Document Approved",
      description: `"${document.name}" has been marked as approved.`,
      className: "bg-accent text-accent-foreground border-accent",
    });
    router.push('/admin');
  };

  const handleReject = () => {
    // In a real app, update the document status in the database
    toast({
      variant: "destructive",
      title: "Document Rejected",
      description: `"${document.name}" has been marked as rejected.`,
    });
    router.push('/admin');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Document Viewer</CardTitle>
            <CardDescription>Review the contents of the document below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[70vh] bg-muted rounded-md flex items-center justify-center overflow-hidden border">
              <Image 
                src={document.url} 
                alt={`Preview of ${document.name}`}
                width={850}
                height={1100}
                className="object-contain w-full h-full"
                data-ai-hint="document contract"
              />
            </div>
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
                <span>Submitted by: <strong className="font-semibold">{document.user}</strong></span>
            </div>
            <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>Uploaded on: <strong className="font-semibold">{document.uploadDate}</strong></span>
            </div>
            <div className="flex items-start gap-3 text-sm">
                <FileType className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>File Type: <strong className="font-semibold">{document.type}</strong></span>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleApprove} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
              <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button onClick={handleReject} variant="destructive" className="w-full">
              <X className="mr-2 h-4 w-4" /> Reject
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
