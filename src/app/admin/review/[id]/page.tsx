
import { documents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DocumentReviewClient } from './DocumentReviewClient';


export default function DocumentReviewPage({ params }: { params: { id: string } }) {
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

  return <DocumentReviewClient document={document} />;
}
