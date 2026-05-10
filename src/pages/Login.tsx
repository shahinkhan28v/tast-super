import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';
import { Gift, Wallet, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [referralInput, setReferralInput] = useState('');

  useEffect(() => {
    const savedRef = sessionStorage.getItem('referralCode');
    if (savedRef) {
      setReferralInput(savedRef);
    }
  }, []);

  if (user) return <Navigate to="/" />;

  const handleSignIn = async () => {
    if (referralInput) {
      sessionStorage.setItem('referralCode', referralInput.toUpperCase());
    }
    try {
      await signIn();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col p-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-slate-500/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col justify-center items-center text-center max-w-sm mx-auto w-full z-10"
      >
        <div className="w-16 h-16 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
          <Gift className="w-8 h-8 text-white -rotate-12" />
        </div>
        
        <h1 className="text-3xl font-black tracking-tight mb-2 text-indigo-700">
          PointHub
        </h1>
        <p className="text-slate-500 font-medium mb-10 text-xs">
          Join 10,000+ users earning real rewards daily. Complete simple tasks and withdraw instantly.
        </p>

        {/* MLM Referral Input */}
        <div className="w-full space-y-2 mb-8 text-left">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
           <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                 <Gift className="w-4 h-4" />
              </div>
              <input 
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="ENTER CODE"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 transition-all uppercase tracking-widest placeholder:text-slate-200"
              />
           </div>
        </div>

        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 rounded-sm" />
          {loading ? 'Authenticating...' : 'Continue with Google'}
        </button>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 w-full justify-center">
             <AlertCircle className="w-4 h-4" />
             {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full mt-10">
          <FeatureCard icon={TrendingUp} label="MLM Rewards" />
          <FeatureCard icon={Wallet} label="Fast Payouts" />
        </div>
      </motion.div>

      <footer className="mt-auto text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest py-8 z-10">
        Trusted by 10,000+ Active Users Worldwide
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm transition-transform hover:scale-105">
      <Icon className="w-6 h-6 text-indigo-600" />
      <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{label}</span>
    </div>
  );
}
