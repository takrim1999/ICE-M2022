'use client';

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedCard, Button } from './components/UI';
import { LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated, logout, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-foreground/50">Loading...</motion.div>;
  }

  return (
    <AnimatedCard className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Dashboard</h1>
          <p className="text-foreground/60">Welcome back to your account.</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <User className="text-indigo-400" />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
          <h2 className="font-semibold text-lg">Account Details</h2>
          <div className="text-sm text-foreground/70">
            <p className="flex justify-between items-center py-2 border-b border-white/5">
              <span>Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-medium">Active</span>
            </p>
            <p className="flex justify-between items-center py-2 border-b border-white/5">
              <span>Role</span>
              <span className="text-foreground">User</span>
            </p>
            <p className="flex justify-between items-center py-2">
              <span>Token</span>
              <span className="font-mono text-xs truncate w-32">{token?.substring(0, 16)}...</span>
            </p>
          </div>
        </div>

        <Button onClick={logout} className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50">
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </AnimatedCard>
  );
}
