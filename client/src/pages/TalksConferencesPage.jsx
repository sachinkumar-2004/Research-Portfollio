import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import TalkCard from '../components/cards/TalkCard';
import ConferenceCard from '../components/cards/ConferenceCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Mic, Presentation } from 'lucide-react';

export default function TalksConferencesPage() {
  const { profile } = useOutletContext() || {};
  const [talks, setTalks] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `Talks & Conferences | ${profile.name}`
      : 'Talks & Conferences | Swayang Priya Mahanta';

    const fetchData = async () => {
      try {
        const [resTalks, resConfs] = await Promise.allSettled([
          portfolioService.getTalks(),
          portfolioService.getConferences(),
        ]);

        if (resTalks.status === 'fulfilled' && resTalks.value.data) {
          setTalks(resTalks.value.data);
        }
        if (resConfs.status === 'fulfilled' && resConfs.value.data) {
          setConferences(resConfs.value.data);
        }
      } catch (err) {
        console.error('Error fetching talks/conferences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Header */}
      <SectionHeading
        badge="Academic Presentations"
        title="Talks & Conferences"
        subtitle="Invited seminars, keynote lectures, oral presentations, and conference poster sessions."
      />

      {/* Section 1: Invited Talks & Seminars */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Invited Talks, Seminars & Lectures
          </h2>
        </div>

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
            title="No invited talks listed yet"
            description="Guest lectures, departmental colloquia, and seminar records will appear here."
            icon={Mic}
          />
        )}
      </section>

      {/* Section 2: Conferences & Symposia */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Presentation className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Conference Participations & Symposia
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Loading conferences..." />
        ) : conferences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conferences.map((conf) => (
              <ConferenceCard key={conf._id} conference={conf} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No conference records listed yet"
            description="Oral presentations, symposia, and poster sessions will be archived here."
            icon={Presentation}
          />
        )}
      </section>
    </div>
  );
}
