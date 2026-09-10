import React from 'react';
import { Calendar, MapPin, ExternalLink, FileText, Presentation } from 'lucide-react';

export default function ConferenceCard({ conference }) {
  if (!conference) return null;

  const formattedDate = conference.date
    ? new Date(conference.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
          <Presentation className="w-3 h-3" />
          {conference.presentationType || 'Conference'}
        </span>
        {formattedDate && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold font-serif text-slate-900 dark:text-slate-100">
        {conference.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        {conference.conferenceName && (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {conference.conferenceName}
          </span>
        )}
        {conference.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {conference.location}
          </span>
        )}
      </div>

      {conference.description && (
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {conference.description}
        </p>
      )}

      {(conference.posterUrl || conference.slidesUrl || conference.conferenceUrl) && (
        <div className="mt-4 pt-3 flex flex-wrap items-center gap-4 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
          {conference.posterUrl && (
            <a
              href={conference.posterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              View Poster
            </a>
          )}
          {conference.slidesUrl && (
            <a
              href={conference.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              View Slides
            </a>
          )}
          {conference.conferenceUrl && (
            <a
              href={conference.conferenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Conference Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}
