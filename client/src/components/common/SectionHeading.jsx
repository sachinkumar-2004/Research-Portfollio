import React from 'react';

export default function SectionHeading({
  title,
  subtitle,
  badge,
  actionText,
  actionHref,
  centered = false,
  className = '',
}) {
  return (
    <div
      className={`mb-8 ${
        centered ? 'text-center' : 'flex flex-col sm:flex-row sm:items-end sm:justify-between'
      } ${className}`}
    >
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-1 mb-2 text-xs font-medium tracking-wide uppercase rounded-full bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {actionText && actionHref && (
        <div className="mt-3 sm:mt-0">
          <a
            href={actionHref}
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {actionText}
            <span className="ml-1">→</span>
          </a>
        </div>
      )}
    </div>
  );
}
