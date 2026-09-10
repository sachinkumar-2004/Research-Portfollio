import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function DashboardCard({
  title,
  count,
  countLabel = 'records',
  statusText,
  description,
  icon: Icon,
  color = 'blue',
}) {
  const colorStyles = {
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/40',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/40',
    teal: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/40',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
  };

  const badgeStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {Icon && (
            <div className={`p-2.5 rounded-xl border ${badgeStyle}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          {count !== undefined ? (
            <>
              <span className="text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
                {count}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {countLabel}
              </span>
            </>
          ) : statusText ? (
            <span className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
              {statusText}
            </span>
          ) : null}
        </div>

        {description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>Active module</span>
        <span className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
          Ready
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
