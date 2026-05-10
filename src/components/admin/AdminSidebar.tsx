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
  Puzzle,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

import { AdminPermission } from '../../types';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
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
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[101] w-72 bg-slate-900 text-slate-400 flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 select-none border-r border-slate-800",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/50">
              PH
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tight leading-none text-lg">PointHub</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Control</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.filter(item => !item.permission || hasPermission(item.permission)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all group",
                isActive 
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
                  : "hover:bg-slate-800/80 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className={cn("w-3 h-3 opacity-0 transition-all", "group-hover:opacity-100 group-hover:translate-x-1")} />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all group border border-rose-500/20"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
