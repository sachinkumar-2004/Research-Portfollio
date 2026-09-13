import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import AwardCard from '../components/cards/AwardCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Award as Trophy } from 'lucide-react';

export default function AwardsPage() {
  const { profile } = useOutletContext() || {};
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `Awards & Fellowships | ${profile.name}`
      : 'Awards & Fellowships | Swayang Priya Mahanta';

    const fetchAwards = async () => {
      try {
        const res = await portfolioService.getAwards();
        if (res.data) {
          setAwards(res.data);
        }
      } catch (err) {
        console.error('Error fetching awards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Honors & Grants"
        title="Awards, Fellowships & Recognitions"
        subtitle="Scholarships, doctoral research fellowships, travel grants, and academic honors."
      />

      {loading ? (
        <LoadingState message="Loading awards and honors..." />
      ) : awards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awards.map((award) => (
            <AwardCard key={award._id} award={award} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No awards recorded yet"
          description="Fellowships, academic awards, and scientific honors will appear in this section."
          icon={Trophy}
        />
      )}
    </div>
  );
}
