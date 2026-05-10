import React, { useEffect, useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  DollarSign, 
  Target, 
  Gift, 
  Video,
  Info,
  CheckCircle,
  Database,
  Lock,
  Mail,
  Smartphone,
  Network,
  FileText,
  ExternalLink,
  Megaphone
} from 'lucide-react';
import { getAppSettings, updateAppSettings } from '../../lib/dataService';
import { AppSettings } from '../../types';
import { cn } from '../../lib/utils';

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAppSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await updateAppSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AppSettings, value: string | number | boolean) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) return <div>Loading config...</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">System Configuration</h1>
        <p className="text-slate-500 text-sm font-medium">Control point algorithms, payout gates, and system behavior</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Economy Settings */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                   <Mail className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Communication</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Access</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Public Support Email</label>
                   <div className="relative">
                       <input 
                         type="email"
                         value={settings?.supportEmail || ''}
                         onChange={(e) => updateField('supportEmail', e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:font-medium"
                         placeholder="e.g. support@pointhub.com"
                       />
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                   <DollarSign className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Economy & Conversion</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rates</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Points per $1.00 USD</label>
                   <div className="relative">
                       <input 
                         type="number"
                         value={settings?.conversionRate}
                         onChange={(e) => updateField('conversionRate', Number(e.target.value))}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 tracking-tighter">PTS/USD</span>
                   </div>
                 </div>

                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Minimum Withdrawal Limit</label>
                   <div className="relative">
                       <input 
                         type="number"
                         value={settings?.minWithdrawal}
                         onChange={(e) => updateField('minWithdrawal', Number(e.target.value))}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 tracking-tighter">POINTS</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* ADSTERRA & PROMO */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                   <Megaphone className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Ads & Promotion</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advertising Streams</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Promotional Headline (Dashboard)</label>
                   <input 
                      type="text"
                      value={settings?.promotionalText || ''}
                      onChange={(e) => updateField('promotionalText', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="e.g. Join our Telegram for bonus codes!"
                   />
                 </div>

                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Adsterra Direct Link (Dashboard)</label>
                   <div className="relative group">
                       <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                       <input 
                         type="text"
                         value={settings?.adsterraDashboardBanner || ''}
                         onChange={(e) => updateField('adsterraDashboardBanner', e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         placeholder="Paste Adsterra Link"
                       />
                   </div>
                 </div>

                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Adsterra Direct Link (Task Popup)</label>
                   <div className="relative group">
                       <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                       <input 
                         type="text"
                         value={settings?.adsterraTaskPopupBanner || ''}
                         onChange={(e) => updateField('adsterraTaskPopupBanner', e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         placeholder="Paste Adsterra Link"
                       />
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* MLM & Referral Settings */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                   <Network className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Multi-Level Marketing</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Commission</p>
                 </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Base Referral Bonus (Fixed)</label>
                   <div className="relative">
                       <input 
                         type="number"
                         value={settings?.referralBonus}
                         onChange={(e) => updateField('referralBonus', Number(e.target.value))}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 tracking-tighter">PTS</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 1 %</label>
                       <input 
                          type="number"
                          value={settings?.mlmLevel1Percent}
                          onChange={(e) => updateField('mlmLevel1Percent', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-slate-700 text-sm focus:border-indigo-500"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 2 %</label>
                       <input 
                          type="number"
                          value={settings?.mlmLevel2Percent}
                          onChange={(e) => updateField('mlmLevel2Percent', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-slate-700 text-sm focus:border-indigo-500"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 3 %</label>
                       <input 
                          type="number"
                          value={settings?.mlmLevel3Percent}
                          onChange={(e) => updateField('mlmLevel3Percent', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-slate-700 text-sm focus:border-indigo-500"
                       />
                    </div>
                 </div>
               </div>
            </div>

            {/* POLICY & LEGAL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                   <FileText className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Policy & Legal</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Governance</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">About Footer Text</label>
                   <textarea 
                      value={settings?.footerAbout || ''}
                      onChange={(e) => updateField('footerAbout', e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all resize-none"
                   />
                 </div>

                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Terms & Conditions</label>
                   <textarea 
                      value={settings?.termsAndConditions || ''}
                      onChange={(e) => updateField('termsAndConditions', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-medium text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all resize-none"
                   />
                 </div>

                 <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Privacy Policy</label>
                   <textarea 
                      value={settings?.privacyPolicy || ''}
                      onChange={(e) => updateField('privacyPolicy', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-medium text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all resize-none"
                   />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <div className="flex items-start gap-4">
             <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
             <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-900">Finalize Global State</p>
                <p className="text-[10px] text-indigo-700/70 font-medium">Updating these settings will instantly affect all active users and transaction processing. Use caution when modifying conversion rates.</p>
             </div>
          </div>
          <button 
            type="submit"
            disabled={saving}
            className={cn(
              "px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-3",
              success ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
            )}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 
             success ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : success ? 'Config Applied' : 'Commit Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
