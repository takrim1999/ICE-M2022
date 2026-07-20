'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatedCard, Input, Button } from '../components/UI';
import { Lock, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset_token: token, new_password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs text-foreground/60 ml-1">Reset Token</label>
        <Input
          type="text"
          placeholder="Paste token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-1 relative">
        <label className="text-xs text-foreground/60 ml-1 mt-2 block">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !token} className="mt-6">
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AnimatedCard>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
        <p className="text-foreground/60 text-sm">Enter your token and new password</p>
      </div>

      <Suspense fallback={<div className="text-center text-foreground/50">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </AnimatedCard>
  );
}
