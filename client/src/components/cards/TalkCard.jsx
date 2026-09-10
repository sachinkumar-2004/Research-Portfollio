import React from 'react';
import { Calendar, MapPin, Building, FileText, Video, Mic } from 'lucide-react';

export default function TalkCard({ talk }) {
  if (!talk) return null;

  const formattedDate = talk.date
    ? new Date(talk.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
          <Mic className="w-3 h-3" />
          {talk.type || 'Invited Talk'}
        </span>
        {formattedDate && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold font-serif text-slate-900 dark:text-slate-100">
        {talk.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        {talk.eventName && (
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {talk.eventName}
          </span>
        )}
        {talk.institution && (
          <span className="inline-flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" />
            {talk.institution}
          </span>
        )}
        {talk.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {talk.location}
          </span>
        )}
      </div>

      {talk.description && (
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {talk.description}
        </p>
      )}

      {(talk.slidesUrl || talk.videoUrl) && (
        <div className="mt-4 pt-3 flex items-center gap-4 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
          {talk.slidesUrl && (
            <a
              href={talk.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              View Slides
            </a>
          )}
          {talk.videoUrl && (
            <a
              href={talk.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
            >
              <Video className="w-3.5 h-3.5" />
              Watch Recording
            </a>
          )}
        </div>
      )}
    </div>
  );
}
