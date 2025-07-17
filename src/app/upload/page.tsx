
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { withAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  document: z.any().refine((files) => files?.length > 0, "A document is required."),
});

function UploadPage() {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Upload Successful!",
      description: `Your document "${values.document[0].name}" has been submitted for review.`,
    });
    form.reset();
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-lg">
        <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Select a file to upload for approval. Supports images, PDFs, etc.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Document File</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={(e) => field.onChange(e.target.files)} 
                            className="file:text-primary file:font-semibold"
                        />
                    </FormControl>
                    <FormDescription>
                        This file will be securely stored and reviewed.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Submit for Review
                </Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}

export default withAuth(UploadPage);
