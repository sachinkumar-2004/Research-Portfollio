import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import SocialLinks from '../components/common/SocialLinks';
import { Mail, Building, MapPin, Globe, GraduationCap, Phone } from 'lucide-react';
import { LinkedinIcon, ResearchGateIcon, OrcidIcon } from '../components/common/Icons';

export default function ContactPage() {
  const { profile, profileLoading } = useOutletContext();

  useEffect(() => {
    document.title = profile?.name
      ? `Contact & Academic Inquiries | ${profile.name}`
      : 'Contact & Academic Inquiries | Swayang Priya Mahanta';
  }, [profile]);

  const email = profile?.email;
  const phone = profile?.phone;
  const institution = profile?.institution || '';
  const department = profile?.department || '';
  const location = profile?.location || '';

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Connect"
        title="Contact & Academic Inquiries"
        subtitle="For research collaboration inquiries, preprint requests, academic visits, or seminar invitations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Direct Academic Inquiries
          </h2>

          {profileLoading ? (
            <div className="space-y-5 animate-pulse">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-52 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Email
                  </span>
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="text-sm sm:text-base font-medium text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      {email}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-600 dark:text-slate-400 italic">
                      Email address not listed yet
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Phone (only when configured) */}
              {phone && (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Mobile
                    </span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-sm sm:text-base font-medium text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Institution */}
              {(institution || department) && (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Institution & Department
                    </span>
                    {institution && (
                      <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                        {institution}
                      </p>
                    )}
                    {department && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {department}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              {location && (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Campus Address
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Academic Network Profiles */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Scholarly Profiles & Web
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Follow publications, preprints, citations, and professional updates across academic networks:
          </p>

          <div className="space-y-3">
            {profile?.googleScholarUrl && (
              <a
                href={profile.googleScholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Google Scholar Profile
                  </span>
                </div>
                <span className="text-slate-400 text-xs">Visit ↗</span>
              </a>
            )}

            {profile?.orcid && (
              <a
                href={profile.orcid}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <OrcidIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ORCID Profile
                  </span>
                </div>
                <span className="text-slate-400 text-xs">Visit ↗</span>
              </a>
            )}

            {profile?.researchGateUrl && (
              <a
                href={profile.researchGateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <ResearchGateIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ResearchGate Profile
                  </span>
                </div>
                <span className="text-slate-400 text-xs">Visit ↗</span>
              </a>
            )}

            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-700 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <LinkedinIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    LinkedIn Network
                  </span>
                </div>
                <span className="text-slate-400 text-xs">Visit ↗</span>
              </a>
            )}

            {profile?.niserProfileUrl && (
              <a
                href={profile.niserProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Official NISER Directory
                  </span>
                </div>
                <span className="text-slate-400 text-xs">Visit ↗</span>
              </a>
            )}
          </div>

          <div className="pt-2">
            <SocialLinks profile={profile} size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
