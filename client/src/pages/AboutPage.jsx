import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import Timeline from '../components/cards/Timeline';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Building, MapPin, Mail, GraduationCap, Phone } from 'lucide-react';

export default function AboutPage() {
  const { profile, profileLoading } = useOutletContext();
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `About & Academic Journey | ${profile.name}`
      : 'About & Academic Journey | Academic Portfolio';

    const fetchEducation = async () => {
      try {
        const res = await portfolioService.getEducation();
        if (res.data) {
          setEducation(res.data);
        }
      } catch (err) {
        console.error('Error fetching education:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [profile]);

  return (
    <div className="space-y-12">
      <SectionHeading
        badge="Profile"
        title="About & Academic Journey"
        subtitle="Scholarly background, academic affiliations, research pursuits, and qualifications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Biography and Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">
              Biography
            </h3>
            {profileLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
              </div>
            ) : profile?.biography ? (
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-700 dark:text-slate-300 font-sans">
                {profile.biography.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            ) : profile?.shortBio ? (
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {profile.shortBio}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                Researcher biography and academic profile details will be updated here.
              </p>
            )}
          </div>

          {/* Research Interests */}
          {profile?.researchInterests && profile.researchInterests.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4">
                Research Focus & Key Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Academic Timeline / Education */}
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-2">
              Academic Background & Education
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Degrees, doctoral studies, and institutional affiliations.
            </p>

            {loading ? (
              <LoadingState message="Loading education records..." />
            ) : education.length > 0 ? (
              <Timeline items={education} type="education" />
            ) : (
              <EmptyState
                title="Education timeline"
                description="Academic qualification history will be listed here."
                icon={GraduationCap}
              />
            )}
          </div>
        </div>

        {/* Right: Affiliation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Affiliation & Department
            </h4>

            {profileLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm">
                {profile?.designation && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      Designation
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {profile.designation}
                    </span>
                  </div>
                )}

                {profile?.institution && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      Institution
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1.5 mt-0.5">
                      <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      {profile.institution}
                    </span>
                  </div>
                )}

                {profile?.department && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      School / Department
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {profile.department}
                    </span>
                  </div>
                )}

                {profile?.location && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      Location
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {profile.location}
                    </span>
                  </div>
                )}

                {profile?.email && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      Academic Email
                    </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile?.phone && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      Mobile Number
                    </span>
                    <a
                      href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {profile.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
