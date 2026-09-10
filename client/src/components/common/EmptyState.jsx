import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records available yet',
  description = 'Entries in this section will be published as research updates and scholarly activities become available.',
  icon: Icon = Inbox,
  actionText,
  actionHref,
}) {
  return (
    <div className="py-14 px-6 text-center border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 rounded-2xl max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold font-serif text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <a
          href={actionHref}
          className="mt-5 inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {actionText} →
        </a>
      )}
    </div>
  );
}
