
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase';
import { LogIn, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginPage() {
  var [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (email == "admin@gmail.com")
      {
        email = "tcedocs2025@gmail.com"
      }
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful' });
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      // Check if the email is admin@gmail.com (abstracted)
      if (resetEmail !== "admin@gmail.com") {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Password reset is only available for admin accounts.',
        });
        setResetLoading(false);
        return;
      }

      // Convert admin@gmail.com to the actual admin email
      const actualEmail = "tcedocs2025@gmail.com";
      
      await sendPasswordResetEmail(auth, actualEmail);
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });
      
      setForgotPasswordOpen(false);
      setResetEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                  <KeyRound className="mr-1 h-3 w-3" />
                  Forgot Password? (Admin Only)
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Reset Admin Password</DialogTitle>
                  <DialogDescription>
                    Enter your admin email to receive a password reset link. This feature is only available for admin accounts.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Admin Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="mail@mail.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Only admin account is allowed for password reset.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setForgotPasswordOpen(false)}
                      className="flex-1"
                      disabled={resetLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={resetLoading}
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
           
        </CardContent>
      </Card>
    </div>
  );
}
