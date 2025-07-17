
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DocumentReviewClient } from './DocumentReviewClient';
import { withAuth } from '@/hooks/use-auth';
import type { Document } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function DocumentReviewPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "documents", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() } as Document);
        } else {
          setError("Document not found.");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);


  if (loading) {
    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-16 w-1/2" />
                <Skeleton className="h-[70vh] w-full" />
            </div>
            <div className="lg:col-span-1 space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  if (error || !document) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">{error || 'Document Not Found'}</h2>
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

export default withAuth(DocumentReviewPage, { adminOnly: true });
