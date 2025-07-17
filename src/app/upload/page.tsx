
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
import { mockDocuments } from "@/lib/mock-data";

const formSchema = z.object({
  documentFile: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "A document file is required."),
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

    const fileName = values.documentFile[0].name;

    // Simulate API call to upload file
    setTimeout(() => {
        // Add to mock data
        mockDocuments.unshift({
            id: `doc_${Date.now()}`,
            name: fileName,
            userId: user.uid,
            userEmail: user.email || 'unknown@example.com',
            uploadDate: new Date().toISOString(),
            status: 'Pending',
            url: '#', // Mock URL
        });

        toast({
            title: "Upload Successful!",
            description: `Your document "${fileName}" has been submitted for review.`,
        });

        form.reset();
        setLoading(false);
    }, 1500);
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Select a document from your computer to submit for approval.
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
                    <FormLabel>Document File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
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
