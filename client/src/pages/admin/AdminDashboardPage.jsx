import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/admin/DashboardCard';
import LoadingState from '../../components/common/LoadingState';
import portfolioService from '../../api/portfolioService';
import {
  User,
  Microscope,
  BookOpen,
  Cpu,
  Mic,
  Presentation,
  Award,
  GraduationCap,
  Briefcase,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const [counts, setCounts] = useState({
    profile: null,
    research: 0,
    publications: 0,
    expertise: 0,
    talks: 0,
    conferences: 0,
    awards: 0,
    education: 0,
    experience: 0,
    gallery: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Overview | Academic Portfolio CMS';

    const fetchAllCounts = async () => {
      try {
        const [
          resProfile,
          resResearch,
          resPubs,
          resExpertise,
          resTalks,
          resConfs,
          resAwards,
          resEdu,
          resExp,
          resGallery,
        ] = await Promise.allSettled([
          portfolioService.getProfile(),
          portfolioService.getResearch(),
          portfolioService.getPublications(),
          portfolioService.getExpertise(),
          portfolioService.getTalks(),
          portfolioService.getConferences(),
          portfolioService.getAwards(),
          portfolioService.getEducation(),
          portfolioService.getExperience(),
          portfolioService.getGallery(),
        ]);

        setCounts({
          profile: resProfile.status === 'fulfilled' && resProfile.value.data ? resProfile.value.data : null,
          research: resResearch.status === 'fulfilled' && Array.isArray(resResearch.value.data) ? resResearch.value.data.length : 0,
          publications: resPubs.status === 'fulfilled' && Array.isArray(resPubs.value.data) ? resPubs.value.data.length : 0,
          expertise: resExpertise.status === 'fulfilled' && Array.isArray(resExpertise.value.data) ? resExpertise.value.data.length : 0,
          talks: resTalks.status === 'fulfilled' && Array.isArray(resTalks.value.data) ? resTalks.value.data.length : 0,
          conferences: resConfs.status === 'fulfilled' && Array.isArray(resConfs.value.data) ? resConfs.value.data.length : 0,
          awards: resAwards.status === 'fulfilled' && Array.isArray(resAwards.value.data) ? resAwards.value.data.length : 0,
          education: resEdu.status === 'fulfilled' && Array.isArray(resEdu.value.data) ? resEdu.value.data.length : 0,
          experience: resExp.status === 'fulfilled' && Array.isArray(resExp.value.data) ? resExp.value.data.length : 0,
          gallery: resGallery.status === 'fulfilled' && Array.isArray(resGallery.value.data) ? resGallery.value.data.length : 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Academic Portfolio Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Welcome, Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Logged in as <span className="font-medium text-slate-800 dark:text-slate-200">{admin?.email || 'admin'}</span>. Use the modules below to review and manage your academic records.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shrink-0 text-xs">
          {counts.profile ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Profile Unconfigured</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview Grid */}
      {loading ? (
        <LoadingState message="Fetching repository metrics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Researcher Profile"
            statusText={counts.profile?.name || 'Not Configured'}
            description={counts.profile?.designation || 'Main bio, contact details, and institutional affiliation.'}
            icon={User}
            color="blue"
          />

          <DashboardCard
            title="Research Projects"
            count={counts.research}
            countLabel="projects"
            description="Active research areas, methodologies, and laboratory projects."
            icon={Microscope}
            color="indigo"
          />

          <DashboardCard
            title="Publications"
            count={counts.publications}
            countLabel="articles"
            description="Journal papers, conference proceedings, preprints, and book chapters."
            icon={BookOpen}
            color="purple"
          />

          <DashboardCard
            title="Expertise & Tools"
            count={counts.expertise}
            countLabel="items"
            description="Laboratory instrumentation, experimental apparatus, and specialized workflows."
            icon={Cpu}
            color="teal"
          />

          <DashboardCard
            title="Invited Talks"
            count={counts.talks}
            countLabel="talks"
            description="Guest lectures, departmental seminars, and keynote addresses."
            icon={Mic}
            color="teal"
          />

          <DashboardCard
            title="Conferences"
            count={counts.conferences}
            countLabel="events"
            description="Oral conference presentations and international poster sessions."
            icon={Presentation}
            color="amber"
          />

          <DashboardCard
            title="Awards & Honors"
            count={counts.awards}
            countLabel="honors"
            description="Doctoral fellowships, research grants, and scientific honors."
            icon={Award}
            color="rose"
          />

          <DashboardCard
            title="Education"
            count={counts.education}
            countLabel="degrees"
            description="Doctoral degree, academic qualifications, and university history."
            icon={GraduationCap}
            color="blue"
          />

          <DashboardCard
            title="Academic Experience"
            count={counts.experience}
            countLabel="appointments"
            description="Research appointments, teaching experience, and affiliations."
            icon={Briefcase}
            color="indigo"
          />

          <DashboardCard
            title="Gallery & Media"
            count={counts.gallery}
            countLabel="images"
            description="Laboratory photographs, conference events, and field visits."
            icon={ImageIcon}
            color="emerald"
          />
        </div>
      )}
    </div>
  );
}
