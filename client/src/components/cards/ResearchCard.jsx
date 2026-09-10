import React from 'react';
import { Microscope, Layers, BookOpen, Star } from 'lucide-react';

export default function ResearchCard({ research }) {
  if (!research) return null;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900 ${
        research.featured
          ? 'border-indigo-200 dark:border-indigo-900/60 shadow-xs ring-1 ring-indigo-500/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {research.image && (
        <div className="h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
          <img
            src={research.image}
            alt={research.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <Microscope className="w-3.5 h-3.5" />
            <span>Research Area</span>
          </div>
          {research.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured Project
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
          {research.title}
        </h3>

        {research.shortDescription && (
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {research.shortDescription}
          </p>
        )}

        {research.description && (
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {research.description}
          </p>
        )}

        {/* Methods */}
        {research.methods && research.methods.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Methods & Techniques</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {research.methods.map((method, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Publications */}
        {research.relatedPublicationIds && research.relatedPublicationIds.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Related Publications</span>
            </div>
            <ul className="space-y-1.5">
              {research.relatedPublicationIds.map((pub, idx) => {
                if (!pub || typeof pub === 'string') return null;
                return (
                  <li key={pub._id || idx} className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      [{pub.year || 'Pub'}]
                    </span>{' '}
                    {pub.title}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
