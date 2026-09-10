import React from 'react';
import {
  GraduationCap,
  Mail,
  FileText,
  Globe,
  BookOpen
} from 'lucide-react';
import { LinkedinIcon, ResearchGateIcon, OrcidIcon } from './Icons';

export default function SocialLinks({ profile, size = 'md', className = '' }) {
  if (!profile) return null;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentIconClass = iconSizes[size] || iconSizes.md;

  const links = [
    {
      label: 'Google Scholar',
      url: profile.googleScholarUrl,
      icon: GraduationCap,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
    },
    {
      label: 'ORCID',
      url: profile.orcid,
      icon: OrcidIcon,
      color: 'hover:text-emerald-600 dark:hover:text-emerald-400',
    },
    {
      label: 'ResearchGate',
      url: profile.researchGateUrl,
      icon: ResearchGateIcon,
      color: 'hover:text-emerald-600 dark:hover:text-emerald-400',
    },
    {
      label: 'LinkedIn',
      url: profile.linkedinUrl,
      icon: LinkedinIcon,
      color: 'hover:text-sky-600 dark:hover:text-sky-400',
    },
    {
      label: 'NISER Profile',
      url: profile.niserProfileUrl,
      icon: Globe,
      color: 'hover:text-amber-600 dark:hover:text-amber-400',
    },
    {
      label: 'Email',
      url: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
      color: 'hover:text-rose-600 dark:hover:text-rose-400',
    },
    {
      label: 'Curriculum Vitae',
      url: profile.cvUrl,
      icon: FileText,
      color: 'hover:text-indigo-600 dark:hover:text-indigo-400',
    },
  ].filter((item) => Boolean(item.url));

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            className={`p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 ${link.color}`}
          >
            <Icon className={currentIconClass} />
            <span className="sr-only">{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
