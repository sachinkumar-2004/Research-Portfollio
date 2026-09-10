import React from 'react';
import { Award as Trophy, ExternalLink, Building } from 'lucide-react';

export default function AwardCard({ award }) {
  if (!award) return null;

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200/50 dark:border-amber-900/40">
          <Trophy className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {award.year || 'Honor'}
            </span>
            {award.type && (
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {award.type}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
            {award.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>{award.organization}</span>
          </div>

          {award.description && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {award.description}
            </p>
          )}

          {award.url && (
            <a
              href={award.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Award Details</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
