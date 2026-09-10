import React, { useState } from 'react';
import { FileText, ExternalLink, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';

export default function PublicationCard({ publication }) {
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);

  if (!publication) return null;

  const authorsString = Array.isArray(publication.authors)
    ? publication.authors.join(', ')
    : publication.authors || '';

  return (
    <article
      className={`p-6 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
        publication.featured
          ? 'border-blue-300 dark:border-blue-900/60 shadow-xs ring-1 ring-blue-500/10'
          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {publication.year}
        </span>
        {publication.publicationType && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
            {publication.publicationType}
          </span>
        )}
        {publication.researchArea && (
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            • {publication.researchArea}
          </span>
        )}
        {publication.featured && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
            <Bookmark className="w-3 h-3" /> Featured
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold font-serif text-slate-900 dark:text-slate-100 leading-snug">
        {publication.title}
      </h3>

      {authorsString && (
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 font-sans">
          {authorsString}
        </p>
      )}

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 italic">
        {publication.journal && <span className="font-medium">{publication.journal}</span>}
        {publication.volume && `, Vol. ${publication.volume}`}
        {publication.issue && `(${publication.issue})`}
        {publication.pages && `, pp. ${publication.pages}`}
      </p>

      {publication.abstract && (
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <button
            onClick={() => setIsAbstractOpen(!isAbstractOpen)}
            className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-1 cursor-pointer"
          >
            <span>Abstract</span>
            {isAbstractOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          {isAbstractOpen && (
            <p className="mt-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {publication.abstract}
            </p>
          )}
        </div>
      )}

      {/* Action Links */}
      <div className="mt-4 pt-3 flex flex-wrap items-center gap-3 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
        {publication.doi && (
          <a
            href={
              publication.doi.startsWith('http')
                ? publication.doi
                : `https://doi.org/${publication.doi}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            DOI: {publication.doi}
          </a>
        )}
        {publication.publisherUrl && (
          <a
            href={publication.publisherUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Publisher
          </a>
        )}
        {publication.pdfUrl && (
          <a
            href={publication.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </a>
        )}
        {publication.googleScholarUrl && (
          <a
            href={publication.googleScholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Scholar
          </a>
        )}
      </div>
    </article>
  );
}
