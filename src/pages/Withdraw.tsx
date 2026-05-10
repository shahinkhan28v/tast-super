import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { requestWithdrawal } from '../lib/dataService';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard,
  Building,
  Smartphone,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Withdraw() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState<number>(500); // Default to min
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minWithdrawal = 500;

  const paymentMethods = [
    { id: 'bkash', name: 'bkash', icon: Smartphone, color: 'text-[#D12053] bg-[#FDE8EE]' },
    { id: 'nagad', name: 'Nagad', icon: Smartphone, color: 'text-[#F15A22] bg-[#FEF0E9]' },
    { id: 'rocket', name: 'Rocket', icon: Smartphone, color: 'text-[#8C3494] bg-[#F4EBF5]' },
    { id: 'paypal', name: 'PayPal', icon: CreditCard, color: 'text-[#003087] bg-[#E6EBF3]' },
    { id: 'upi', name: 'UPI (India)', icon: CreditCard, color: 'text-[#097939] bg-[#E7F2EB]' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, color: 'text-zinc-600 bg-zinc-100' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    if (!method || !details) {
      setError('Please fill all fields');
      return;
    }
    if (amount < minWithdrawal) {
      setError(`Minimum withdrawal is ${minWithdrawal} points`);
      return;
    }
    if (profile.points < amount) {
      setError('Insufficient points');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await requestWithdrawal(profile.uid, amount, 'USD', method, details);
      setSuccess(true);
      setTimeout(() => navigate('/history'), 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-200"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-black text-zinc-900">Request Submitted!</h2>
          <p className="text-zinc-500 mt-2">Your withdrawal request is being processed. It usually takes 24-48 hours to approve.</p>
        </div>
        <button 
          onClick={() => navigate('/history')}
          className="bg-zinc-900 text-white px-8 py-3 rounded-2xl font-bold"
        >
          View History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Withdraw Points</h2>
        <p className="text-slate-500 text-xs">Min. 500 Pts • 24-48h Approval</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Available to Withdraw</p>
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-700">{profile?.points || 0}</span>
            <span className="text-slate-400 font-bold text-xs">pts</span>
        </div>
        <p className="mt-1 text-slate-400 text-xs font-medium italic">Approximate Value: ${(profile?.points || 0) / 100} USD</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Select Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setMethod(pm.name)}
                className={cn(
                  "p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5",
                  method === pm.name ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500" : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs", pm.color)}>
                  <pm.icon className="w-5 h-5" />
                </div>
                <span className={cn("text-[10px] font-bold truncate w-full px-1", method === pm.name ? "text-indigo-700" : "text-slate-600")}>{pm.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Amount (Pts)</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Account Info</label>
            <input 
              type="text" 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Number or Email"
            />
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg flex items-center gap-2 text-[11px] font-bold">
            <Info className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white h-12 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-normal font-medium italic">Note: Verified payments ensure safe fund transfers. Double-check your details before submitting to avoid delays.</p>
      </div>
    </div>
  );
}
