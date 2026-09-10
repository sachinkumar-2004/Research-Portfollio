import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { FileText, Download, ExternalLink, GraduationCap, Building, User } from 'lucide-react';

export default function CvPage() {
  const { profile, profileLoading } = useOutletContext();

  useEffect(() => {
    document.title = profile?.name
      ? `Curriculum Vitae | ${profile.name}`
      : 'Curriculum Vitae | Academic Portfolio';
  }, [profile]);

  const cvUrl = profile?.cvUrl;

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Curriculum Vitae"
        title="Curriculum Vitae"
        subtitle="Comprehensive academic record including doctoral research, publications, presentations, and academic appointments."
      />

      {/* Academic Summary Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        {profileLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="h-16 bg-slate-100 dark:bg-slate-950/60 rounded-xl" />
              <div className="h-16 bg-slate-100 dark:bg-slate-950/60 rounded-xl" />
              <div className="h-16 bg-slate-100 dark:bg-slate-950/60 rounded-xl" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  {profile?.name || 'Academic Portfolio'}
                </h2>
                {(profile?.designation || profile?.institution) && (
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                    {profile?.designation ? profile.designation : ''}
                    {profile?.designation && profile?.institution ? ' • ' : ''}
                    {profile?.institution ? profile.institution : ''}
                  </p>
                )}
              </div>

              {cvUrl && (
                <div className="flex items-center gap-3">
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV (PDF)</span>
                  </a>
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Tab</span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Current Affiliation</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {profile?.department && profile?.institution
                    ? `${profile.department}, ${profile.institution}`
                    : profile?.institution || profile?.department || 'Affiliation details'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Designation / Role</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {profile?.designation || 'Academic Researcher'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Location</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {profile?.location || 'Location details'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Embedded Viewer or Empty State */}
      {profileLoading ? (
        <div className="h-[400px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center text-slate-400 text-sm">
          Loading document preview...
        </div>
      ) : cvUrl ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">Curriculum Vitae Document Preview</span>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Full Screen Preview ↗
            </a>
          </div>
          <iframe
            src={cvUrl}
            title="Curriculum Vitae"
            className="w-full h-[750px] border-none"
          />
        </div>
      ) : (
        <EmptyState
          title="CV document not linked yet"
          description="A direct link to download the curriculum vitae PDF will appear here once the profile URL is configured."
          icon={FileText}
        />
      )}
    </div>
  );
}
