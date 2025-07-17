
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { withAuth, useAuth } from "@/hooks/use-auth";
import { uploadPdfToSupabase } from "@/lib/supabasePdfUpload";
import { addDocumentToFirestore } from "@/lib/firebaseService";

const formSchema = z.object({
  documentFile: z
    .any()
    .refine((files) => files?.length === 1, "A document file is required.")
    .refine((files) => files?.[0]?.type === "application/pdf", "Only PDF files are allowed.")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "File size must be less than 10MB."),
});

function UploadPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentFile: undefined,
    },
  });

  const fileRef = form.register("documentFile");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to upload." });
      return;
    }

    setLoading(true);

    try {
      const file = values.documentFile[0];
      const fileName = file.name;

      // Upload PDF to Supabase Storage
      const fileUrl = await uploadPdfToSupabase(file, user.uid, fileName);

      // Save document metadata to Firebase Firestore
      const documentData = {
        name: fileName,
        userId: user.uid,
        userEmail: user.email || 'unknown@example.com',
        uploadDate: new Date().toISOString(),
        status: 'Pending',
        url: fileUrl,
        fileSize: file.size,
        fileType: file.type
      };

      const documentId = await addDocumentToFirestore(documentData);

      toast({
        title: "Upload Successful!",
        description: `Your document "${fileName}" has been submitted for review.`,
      });

      form.reset();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while uploading your document.";
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Select a PDF document from your computer to submit for approval. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="documentFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document File (PDF only)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,application/pdf"
                        {...fileRef}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                <Upload className="mr-2 h-4 w-4" /> {loading ? "Uploading..." : "Upload and Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(UploadPage);
