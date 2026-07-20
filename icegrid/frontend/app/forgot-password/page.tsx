'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedCard, Input, Button } from '../components/UI';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{message: string, reset_token_demo?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedCard>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-foreground/60 text-sm">Enter your email to receive a reset link</p>
      </div>

      {!successData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1 relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="mt-6">
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
          <p className="text-foreground/80">{successData.message}</p>
          {successData.reset_token_demo && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-left mt-4">
              <p className="text-xs text-indigo-300 font-semibold mb-1">DEMO MODE TOKEN:</p>
              <code className="text-xs text-indigo-200 break-all">{successData.reset_token_demo}</code>
              <div className="mt-3">
                <Link 
                  href={`/reset-password?token=${successData.reset_token_demo}`}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md text-white transition-colors"
                >
                  Use Token
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </AnimatedCard>
  );
}
