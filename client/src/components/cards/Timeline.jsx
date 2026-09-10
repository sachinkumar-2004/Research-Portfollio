import React from 'react';
import { Calendar, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react';

export default function Timeline({ items = [], type = 'education' }) {
  if (!items || items.length === 0) return null;

  const isEducation = type === 'education';

  return (
    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 sm:pl-8 space-y-8 my-4">
      {items.map((item, index) => {
        const Icon = isEducation ? GraduationCap : Briefcase;
        const mainTitle = isEducation ? item.degree : item.position;
        const subtitle = isEducation ? item.field : null;
        const institution = isEducation ? item.institution : item.organization;
        const dateRange = isEducation
          ? `${item.startYear || ''} ${
              item.endYear ? `– ${item.endYear}` : ''
            }`.trim()
          : `${item.startDate || ''} ${
              item.endDate ? `– ${item.endDate}` : ''
            }`.trim();

        return (
          <div key={item._id || index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
              <Icon className="w-3 h-3" />
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
                  {mainTitle}
                </h3>
                {dateRange && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3 h-3" />
                    {dateRange}
                  </span>
                )}
              </div>

              {subtitle && (
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                  {subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                {institution && (
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {institution}
                  </span>
                )}
                {item.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
