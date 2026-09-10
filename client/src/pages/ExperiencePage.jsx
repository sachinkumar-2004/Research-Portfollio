import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import Timeline from '../components/cards/Timeline';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { GraduationCap, Briefcase } from 'lucide-react';

export default function ExperiencePage() {
  const { profile } = useOutletContext() || {};
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `Education & Experience | ${profile.name}`
      : 'Education & Experience | Academic Portfolio';

    const fetchData = async () => {
      try {
        const [resEdu, resExp] = await Promise.allSettled([
          portfolioService.getEducation(),
          portfolioService.getExperience(),
        ]);

        if (resEdu.status === 'fulfilled' && resEdu.value.data) {
          setEducation(resEdu.value.data);
        }
        if (resExp.status === 'fulfilled' && resExp.value.data) {
          setExperience(resExp.value.data);
        }
      } catch (err) {
        console.error('Error fetching education/experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      <SectionHeading
        badge="Academic History"
        title="Education & Academic Experience"
        subtitle="Formal academic degrees, research appointments, teaching assistantships, and professional history."
      />

      {/* Section 1: Academic Education */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Education & Academic Qualifications
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Loading education history..." />
        ) : education.length > 0 ? (
          <Timeline items={education} type="education" />
        ) : (
          <EmptyState
            title="No education records found"
            description="Academic degrees and qualifications will be listed here."
            icon={GraduationCap}
          />
        )}
      </section>

      {/* Section 2: Research & Academic Experience */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Research Appointments & Professional Experience
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Loading experience history..." />
        ) : experience.length > 0 ? (
          <Timeline items={experience} type="experience" />
        ) : (
          <EmptyState
            title="No experience records found"
            description="Research positions, fellowships, and academic appointments will be listed here."
            icon={Briefcase}
          />
        )}
      </section>
    </div>
  );
}
