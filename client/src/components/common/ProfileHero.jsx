import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileDown, UserCheck, Sparkles } from 'lucide-react';
import SocialLinks from './SocialLinks';

export default function ProfileHero({ profile, loading = false }) {
  if (loading || !profile) {
    return (
      <section className="pt-2 sm:pt-4 pb-8 sm:pb-10 border-b border-slate-200/80 dark:border-slate-800/80 mb-8 sm:mb-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
            <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="space-y-2">
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-2/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-76 xl:h-76 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </section>
    );
  }

  const name = profile?.name || 'Swayang Priya Mahanta';
  const designation = profile?.designation || 'NISER Research Scholar';
  const institution = profile?.institution || 'National Institute of Science Education and Research (NISER)';
  const bio = profile?.shortBio || '';

  return (
    <section className="pt-2 sm:pt-4 pb-8 sm:pb-10 border-b border-slate-200/80 dark:border-slate-800/80 mb-8 sm:mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
        {/* Left column: Bio and actions */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Portfolio & Research Archive</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {name}
            </h1>
            {designation && (
              <p className="text-base sm:text-lg lg:text-xl font-medium text-slate-700 dark:text-slate-300 font-serif">
                {designation}
              </p>
            )}
            {institution && (
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {institution}
              </p>
            )}
          </div>

          {bio && (
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-sans">
              {bio}
            </p>
          )}

          {/* Research Interests Tags */}
          {profile?.researchInterests && profile.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {profile.researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
            >
              <span>Explore Research</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/publications"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Publications</span>
            </Link>

            {profile?.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs sm:text-sm font-medium transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>Curriculum Vitae</span>
              </a>
            ) : (
              <Link
                to="/cv"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs sm:text-sm font-medium transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>CV Overview</span>
              </Link>
            )}
          </div>

          {/* Academic Profiles & Social Links */}
          <div className="pt-1">
            <SocialLinks profile={profile} size="md" />
          </div>
        </div>

        {/* Right column: Profile photo or tasteful academic insignia */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
          {profile?.profileImage ? (
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-76 xl:h-76 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={profile.profileImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-76 xl:h-76 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <UserCheck className="w-8 h-8" />
              </div>
              {institution && (
                <span className="font-serif font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-snug">
                  {institution.includes('(') ? institution.split('(')[1].replace(')', '') : institution}
                </span>
              )}
              {designation && (
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {designation}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
