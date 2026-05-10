import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Search, Bell, User, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import BackButton from '../BackButton';

export default function AdminLayout() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname === '/admin' || location.pathname === '/admin/';

  const roleLabel = profile?.role === 'super_admin' ? 'Super Admin' : (profile?.role === 'admin' ? 'Administrator' : 'Moderator');

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {!isDashboard && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-2 mr-2"
                id="admin-back-button"
              >
                <ChevronLeft size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Back</span>
              </button>
            )}
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{profile?.name || 'Administrator'}</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1.5">{roleLabel}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 border border-indigo-500">
                {profile?.name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
