
'use client';

import Link from 'next/link';
import { FileText, Shield, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <FileText className="h-6 w-6" />
          <span className="font-headline">DocuApprove</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/upload">Upload</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/status">Status</Link>
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
