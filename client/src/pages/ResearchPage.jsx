import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import ResearchCard from '../components/cards/ResearchCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Microscope } from 'lucide-react';

export default function ResearchPage() {
  const { profile } = useOutletContext() || {};
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = profile?.name
      ? `Research Areas & Projects | ${profile.name}`
      : 'Research Areas & Projects | Academic Portfolio';

    const fetchResearch = async () => {
      try {
        const res = await portfolioService.getResearch();
        if (res.data) {
          setResearchList(res.data);
        }
      } catch (err) {
        console.error('Error fetching research:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Inquiry & Methodology"
        title="Research Areas & Projects"
        subtitle="Explorations, computational models, laboratory investigations, and foundational studies."
      />

      {loading ? (
        <LoadingState message="Loading research projects..." />
      ) : researchList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchList.map((item) => (
            <ResearchCard key={item._id} research={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No research projects listed yet"
          description="Detailed methodologies, research questions, and project summaries will appear here once configured."
          icon={Microscope}
        />
      )}
    </div>
  );
}
