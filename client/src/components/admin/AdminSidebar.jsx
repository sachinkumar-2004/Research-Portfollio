import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Microscope,
  BookOpen,
  Cpu,
  Mic,
  Presentation,
  Award,
  GraduationCap,
  Briefcase,
  Image as ImageIcon,
  X
} from 'lucide-react';

export default function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Research', path: '/admin/research', icon: Microscope },
    { name: 'Publications', path: '/admin/publications', icon: BookOpen },
    { name: 'Expertise', path: '/admin/expertise', icon: Cpu },
    { name: 'Talks', path: '/admin/talks', icon: Mic },
    { name: 'Conferences', path: '/admin/conferences', icon: Presentation },
    { name: 'Awards', path: '/admin/awards', icon: Award },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            A
          </div>
          <div>
            <span className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm block leading-tight">
              Admin Portal
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Portfolio CMS
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        NISER Academic CMS v1.0
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/60 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div
            className="w-72 max-w-[80vw] h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
