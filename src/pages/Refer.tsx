import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';
import { 
  Users, 
  Copy, 
  Check, 
  CreditCard, 
  Heart, 
  ArrowRight,
  Gift,
  Target,
  TrendingUp,
  Share2,
  PieChart,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getAppSettings } from '../lib/dataService';
import { AppSettings } from '../types';

export default function Refer() {
  const { profile } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    getAppSettings().then(setSettings);
  }, []);

  const shareUrl = `${window.location.origin}/?ref=${profile?.referralCode || ''}`;

  const handleCopyLink = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const mlmLevels = [
    { level: 'Level 1', count: profile?.referralCountL1 || 0, label: 'Direct Referrals', color: 'bg-indigo-600' },
    { level: 'Level 2', count: profile?.referralCountL2 || 0, label: 'Indirect L2', color: 'bg-emerald-500' },
    { level: 'Level 3', count: profile?.referralCountL3 || 0, label: 'Indirect L3', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-1 mb-8 pt-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Refer & Build Network</h2>
        <p className="text-slate-500 text-sm font-medium">Earn passive income across 3 levels of your network!</p>
      </div>

      {/* MLM Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        {mlmLevels.map((lvl, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
             <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5", lvl.color)}>
                <Users className="w-5 h-5" />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lvl.level}</p>
                <p className="text-lg font-black text-slate-800">{lvl.count}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Dedicated Referral Code Box */}
      <div className="bg-white p-6 rounded-[2.5rem] border-4 border-dashed border-indigo-100 flex flex-col items-center gap-4 shadow-sm relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
           <Gift className="w-12 h-12 text-indigo-600" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Your Referral Code</p>
        <div className="flex items-center gap-4">
           <div className="bg-indigo-50 px-8 py-4 rounded-3xl border-2 border-indigo-100">
              <code className="text-4xl font-black tracking-[0.2em] text-indigo-700">{profile?.referralCode || '------'}</code>
           </div>
           <button 
             onClick={handleCopyCode}
             className="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-90 transition-all"
           >
             {copiedCode ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
           </button>
        </div>
        {copiedCode && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest"
          >
            Code Copied to Clipboard!
          </motion.p>
        )}
      </div>

      {/* Referral Link Card */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
           <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white border border-white/20">
              <Share2 className="w-10 h-10" />
           </div>

           <div className="text-center space-y-2 w-full">
              <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">Your Network Invitation Link</p>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-4 rounded-2xl w-full">
                 <code className="text-sm font-bold text-white truncate flex-1 opacity-80">{shareUrl}</code>
                 <button 
                   onClick={handleCopyLink}
                   className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-90 shrink-0"
                 >
                   {copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                 </button>
              </div>
           </div>

           <button 
             className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all hover:bg-indigo-50"
           >
             Invite My Friends
             <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-black text-slate-800 tracking-tight">Referral Earnings</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Commission</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-emerald-600">{profile?.referralEarnings || 0}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pts</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Passive Income Multiplier</span>
               </div>
               <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-tight">Active</div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-indigo-50/50 p-4 rounded-2xl text-center italic border border-indigo-50">
               "Earn commissions whenever your referrals complete tasks. The bigger your tree, the higher your earnings!"
            </p>
         </div>
      </div>
      
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Commission Structure</h4>
         <div className="space-y-2">
            {[
              { label: 'Direct Referral', value: `${settings?.mlmLevel1Percent || 10}%` },
              { label: 'Level 2 Indirect', value: `${settings?.mlmLevel2Percent || 5}%` },
              { label: 'Level 3 Indirect', value: `${settings?.mlmLevel3Percent || 2}%` },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 px-4">
                 <span className="text-xs font-bold text-slate-600">{row.label}</span>
                 <span className="text-xs font-black text-indigo-600">{row.value}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
