import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  Gift, 
  LogOut,
  RotateCw,
  ChevronRight,
  TrendingUp,
  Share2,
  ShieldCheck,
  Image as ImageIcon,
  MessageSquare,
  Puzzle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

import { AdminPermission } from '../../types';

export default function AdminSidebar() {
  const { logout, hasPermission } = useAuth();

  const navItems: { to: string; icon: any; label: string; permission?: AdminPermission }[] = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users', permission: 'manage_users' },
    { to: '/admin/withdrawals', icon: CreditCard, label: 'Withdrawals', permission: 'manage_withdrawals' },
    { to: '/admin/admins', icon: ShieldCheck, label: 'Administrators', permission: 'manage_admins' },
    { to: '/admin/quizzes', icon: Puzzle, label: 'Quiz Master', permission: 'manage_tasks' },
    { to: '/admin/support', icon: MessageSquare, label: 'Support Feed', permission: 'manage_support' },
    { to: '/admin/banners', icon: ImageIcon, label: 'Banner Manager', permission: 'manage_banners' },
    { to: '/admin/tasks', icon: Gift, label: 'Tasks & Rewards', permission: 'manage_tasks' },
    { to: '/admin/wheel', icon: RotateCw, label: 'Wheel Architect', permission: 'manage_settings' },
    { to: '/admin/referrals', icon: Share2, label: 'Referral System', permission: 'manage_settings' },
    { to: '/admin/settings', icon: Settings, label: 'System Settings', permission: 'manage_settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col h-screen sticky top-0 shrink-0 select-none border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/50">
          PH
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black tracking-tight leading-none text-lg">PointHub</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Control</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.filter(item => !item.permission || hasPermission(item.permission)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-tight transition-all group",
              isActive 
                ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
                : "hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110")} />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className={cn("w-3 h-3 opacity-0 transition-all", "group-hover:opacity-100 group-hover:translate-x-1")} />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-tight text-rose-400 hover:bg-rose-500/10 transition-all group"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
}
