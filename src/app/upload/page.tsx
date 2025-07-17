
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { withAuth, useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const G_DRIVE_FOLDER_URL = "https://drive.google.com/drive/u/5/folders/18tppk1V3BX5aliGjhLwuRHUPNdt-GSaT";

const formSchema = z.object({
  documentName: z.string().min(1, "Document name is required."),
});

function UploadPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to upload." });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "documents"), {
        name: values.documentName,
        userId: user.uid,
        userEmail: user.email,
        uploadDate: serverTimestamp(),
        status: "Pending",
      });

      toast({
        title: "Submission Successful!",
        description: `Your document "${values.documentName}" has been logged. Please upload the file to Google Drive.`,
      });
      form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error logging your document. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Submit Document</CardTitle>
          <CardDescription>
            Log your document here, then upload the file to the shared Google Drive folder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <ExternalLink className="h-4 w-4" />
            <AlertTitle>Two-Step Process</AlertTitle>
            <AlertDescription>
              1. Enter the document name below and click submit.
              <br />
              2. Open the Google Drive folder and upload the corresponding file.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="documentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document File Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Financial_Report_Q1.pdf"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4">
                 <Button type="submit" className="w-full" disabled={loading}>
                    <Upload className="mr-2 h-4 w-4" /> {loading ? "Submitting..." : "Submit to Registry"}
                </Button>
                 <Button variant="secondary" asChild>
                    <a href={G_DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Open Google Drive Folder
                    </a>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(UploadPage);
