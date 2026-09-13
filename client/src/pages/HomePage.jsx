import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import ProfileHero from '../components/common/ProfileHero';
import SectionHeading from '../components/common/SectionHeading';
import ResearchCard from '../components/cards/ResearchCard';
import PublicationCard from '../components/cards/PublicationCard';
import ExpertiseCard from '../components/cards/ExpertiseCard';
import TalkCard from '../components/cards/TalkCard';
import AwardCard from '../components/cards/AwardCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import portfolioService from '../api/portfolioService';
import { Microscope, BookOpen, Cpu, Mic, Award, Mail, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { profile, profileLoading, profileError } = useOutletContext();
  const [research, setResearch] = useState([]);
  const [publications, setPublications] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [talks, setTalks] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `${profile.name} | NISER Research Scholar`
      : 'Swayang Priya Mahanta | NISER Research Scholar';

    const fetchHomeData = async () => {
      try {
        const [resResearch, resPubs, resExpertise, resTalks, resAwards] = await Promise.allSettled([
          portfolioService.getResearch(),
          portfolioService.getPublications(),
          portfolioService.getExpertise(),
          portfolioService.getTalks(),
          portfolioService.getAwards(),
        ]);

        if (resResearch.status === 'fulfilled' && resResearch.value.data) {
          setResearch(resResearch.value.data.slice(0, 2));
        }
        if (resPubs.status === 'fulfilled' && resPubs.value.data) {
          // prioritize featured publications or recent
          const pubs = resPubs.value.data;
          const featured = pubs.filter((p) => p.featured);
          setPublications(featured.length > 0 ? featured.slice(0, 3) : pubs.slice(0, 3));
        }
        if (resExpertise.status === 'fulfilled' && resExpertise.value.data) {
          const items = resExpertise.value.data;
          const featured = items.filter((e) => e.featured);
          setExpertise(featured.length > 0 ? featured.slice(0, 3) : items.slice(0, 3));
        }
        if (resTalks.status === 'fulfilled' && resTalks.value.data) {
          setTalks(resTalks.value.data.slice(0, 2));
        }
        if (resAwards.status === 'fulfilled' && resAwards.value.data) {
          setAwards(resAwards.value.data.slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [profile]);

  if (profileError && !profile) {
    return (
      <ErrorState
        title="Unable to load researcher profile"
        message="Please check your network connection and try refreshing."
      />
    );
  }

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <ProfileHero profile={profile} loading={profileLoading} />

      {/* 1. Short About Section */}
      {profile?.biography && (
        <section>
          <SectionHeading
            badge="Overview"
            title="Scholarly Background"
            actionText="Read Full Biography"
            actionHref="/about"
          />
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300">
            <p className="line-clamp-4">{profile.biography}</p>
          </div>
        </section>
      )}

      {/* 2. Research Areas */}
      <section>
        <SectionHeading
          badge="Inquiry"
          title="Research Areas & Projects"
          subtitle="Core investigative themes, theoretical modeling, and ongoing scientific projects."
          actionText="View All Research"
          actionHref="/research"
        />
        {loading ? (
          <LoadingState message="Loading research areas..." />
        ) : research.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {research.map((item) => (
              <ResearchCard key={item._id} research={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Research themes in progress"
            description="Detailed descriptions of research projects and methodology will appear here once published."
            icon={Microscope}
            actionText="Explore Research Page"
            actionHref="/research"
          />
        )}
      </section>

      {/* 3. Selected Publications */}
      <section>
        <SectionHeading
          badge="Scholarship"
          title="Selected Publications"
          subtitle="Peer-reviewed journal articles, conference papers, and preprints."
          actionText="Browse All Publications"
          actionHref="/publications"
        />
        {loading ? (
          <LoadingState message="Loading publications..." />
        ) : publications.length > 0 ? (
          <div className="space-y-4">
            {publications.map((pub) => (
              <PublicationCard key={pub._id} publication={pub} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Publications archive"
            description="Scholarly papers and peer-reviewed articles will be listed here as they are indexed."
            icon={BookOpen}
            actionText="Go to Publications"
            actionHref="/publications"
          />
        )}
      </section>

      {/* 4. Expertise & Instrumentation Preview */}
      {expertise.length > 0 && (
        <section>
          <SectionHeading
            badge="Capability & Apparatus"
            title="Expertise & Instrumentation"
            subtitle="Core experimental techniques, specialized instrumentation, and laboratory capabilities."
            actionText="View All Expertise"
            actionHref="/expertise"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item) => (
              <ExpertiseCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Recent Talks & Conferences */}
      <section>
        <SectionHeading
          badge="Dissemination"
          title="Recent Talks & Conferences"
          subtitle="Invited lectures, seminars, and international conference presentations."
          actionText="View Talks & Conferences"
          actionHref="/talks"
        />
        {loading ? (
          <LoadingState message="Loading talks..." />
        ) : talks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {talks.map((talk) => (
              <TalkCard key={talk._id} talk={talk} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Presentations & Seminars"
            description="Conference records, invited seminars, and presentation slides will be available here."
            icon={Mic}
            actionText="Visit Talks & Conferences"
            actionHref="/talks"
          />
        )}
      </section>

      {/* 5. Selected Awards */}
      <section>
        <SectionHeading
          badge="Recognition"
          title="Honors & Fellowships"
          subtitle="Recognitions, academic fellowships, and research grants."
          actionText="View All Awards"
          actionHref="/awards"
        />
        {loading ? (
          <LoadingState message="Loading awards..." />
        ) : awards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award) => (
              <AwardCard key={award._id} award={award} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Honors & Recognition"
            description="Awards, doctoral fellowships, and grants will be recorded here."
            icon={Award}
            actionText="Visit Awards Page"
            actionHref="/awards"
          />
        )}
      </section>

      {/* 6. Contact CTA */}
      <section className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200/50 dark:border-blue-900/40">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
          Academic Collaborations & Inquiries
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Interested in research discussions, academic collaborations, or conference invitations?
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
