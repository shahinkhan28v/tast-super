import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Share2,
  ShieldCheck,
  Image as ImageIcon,
  MessageSquare,
  Puzzle,
  X,
  Sidebar as SidebarIcon,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

import { AdminPermission } from '../../types';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  icon: any;
  label: string;
  permission?: AdminPermission;
}

interface Category {
  label: string;
  items: NavItem[];
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { logout, hasPermission } = useAuth();
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('adminSidebarMinimized') === 'true';
  });
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Main': true,
    'Users': true,
    'Content': true,
    'System': true
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarMinimized', String(isMinimized));
  }, [isMinimized]);

  const categories: Category[] = [
    {
      label: 'Main',
      items: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      label: 'Users',
      items: [
        { to: '/admin/users', icon: Users, label: 'User List', permission: 'manage_users' },
        { to: '/admin/withdrawals', icon: CreditCard, label: 'Payout Requests', permission: 'manage_withdrawals' },
        { to: '/admin/admins', icon: ShieldCheck, label: 'Staff Roles', permission: 'manage_admins' },
      ]
    },
    {
      label: 'Content',
      items: [
        { to: '/admin/quizzes', icon: Puzzle, label: 'Quiz Center', permission: 'manage_tasks' },
        { to: '/admin/tasks', icon: Gift, label: 'Offers & Tasks', permission: 'manage_tasks' },
        { to: '/admin/banners', icon: ImageIcon, label: 'Promotions', permission: 'manage_banners' },
        { to: '/admin/support', icon: MessageSquare, label: 'Help Desk', permission: 'manage_support' },
      ]
    },
    {
      label: 'System',
      items: [
        { to: '/admin/wheel', icon: RotateCw, label: 'Lucky Wheel', permission: 'manage_settings' },
        { to: '/admin/referrals', icon: Share2, label: 'Referral Engine', permission: 'manage_settings' },
        { to: '/admin/settings', icon: Settings, label: 'Global Setup', permission: 'manage_settings' },
      ]
    }
  ];

  const toggleCategory = (label: string) => {
    if (isMinimized) {
      setIsMinimized(false);
      setExpandedCategories(prev => ({ ...prev, [label]: true }));
      return;
    }
    setExpandedCategories(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[101] bg-slate-900 text-slate-400 flex flex-col h-full transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 select-none border-r border-white/5",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        isMinimized ? "w-20" : "w-72"
      )}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5 h-16 lg:h-20 shrink-0 overflow-hidden">
          <div className={cn("flex items-center gap-3 transition-opacity duration-300", isMinimized ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              PH
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tight leading-none text-lg">PointHub</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-indigo-500/10 rounded-full">Admin Panel</span>
            </div>
          </div>
          
          <button 
            onClick={() => isMinimized ? setIsMinimized(false) : setIsMinimized(true)}
            className={cn(
              "p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all hidden lg:flex",
              isMinimized && "mx-auto ring-1 ring-slate-800"
            )}
          >
            {isMinimized ? <SidebarIcon size={20} /> : <ChevronLeft size={20} />}
          </button>

          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories & Items */}
        <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {categories.map((cat) => {
            const visibleItems = cat.items.filter(item => !item.permission || hasPermission(item.permission));
            if (visibleItems.length === 0) return null;

            const isExpanded = expandedCategories[cat.label];

            return (
              <div key={cat.label} className="space-y-1">
                {/* Category Header */}
                {!isMinimized ? (
                  <button 
                    onClick={() => toggleCategory(cat.label)}
                    className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors group"
                  >
                    <span>{cat.label}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronDown size={12} />
                    </motion.div>
                  </button>
                ) : (
                  <div className="h-[1px] bg-slate-800/50 mx-2 mb-4" />
                )}

                <AnimatePresence initial={false}>
                  {(isExpanded || isMinimized) && (
                    <motion.div
                      initial={isMinimized ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1"
                    >
                      {visibleItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/admin'}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all group relative",
                            isMinimized ? "justify-center" : "justify-start",
                            isActive 
                              ? "bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]" 
                              : "hover:bg-slate-800/50 hover:text-slate-200"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
                          {!isMinimized && (
                            <>
                              <span className="flex-1 text-[11px] uppercase tracking-wider">{item.label}</span>
                              <ChevronRight className={cn("w-3 h-3 opacity-0 transition-all", "group-hover:opacity-100 group-hover:translate-x-1")} />
                            </>
                          )}
                          
                          {/* Tooltip for Minimized State */}
                          {isMinimized && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[200] border border-white/5">
                              {item.label}
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className={cn(
              "flex items-center gap-3 p-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all group active:scale-95",
              isMinimized ? "justify-center w-full" : "w-full border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
            )}
          >
            <LogOut className={cn("w-5 h-5 transition-transform group-hover:scale-110", isMinimized ? "text-rose-500" : "")} />
            {!isMinimized && <span>Exit Admin</span>}
            
            {isMinimized && (
               <div className="absolute left-full ml-4 px-3 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[200]">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
