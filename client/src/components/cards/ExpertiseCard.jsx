import React from 'react';
import { Cpu, Star, Sparkles, Wrench } from 'lucide-react';

export default function ExpertiseCard({ item }) {
  const [imageError, setImageError] = React.useState(false);

  if (!item) return null;

  const hasImage = Boolean(item.imageUrl && !imageError);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900 flex flex-col ${
        item.featured
          ? 'border-blue-200 dark:border-blue-900/60 shadow-xs ring-1 ring-blue-500/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="h-48 sm:h-52 w-full overflow-hidden bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-center">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-300 dark:text-slate-600/80 bg-slate-100/60 dark:bg-slate-800/30">
            <Cpu className="w-10 h-10 stroke-[1.25]" />
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category / Icon & Featured Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>{item.category || 'Instrumentation & Expertise'}</span>
            </div>

            {item.featured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Core / Featured
              </span>
            )}
          </div>

          {/* Title with optional icon indicator */}
          <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
            {item.icon && <span className="mr-2 text-base">{item.icon}</span>}
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
