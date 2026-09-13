import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import ExpertiseCard from '../components/cards/ExpertiseCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Cpu } from 'lucide-react';

export default function ExpertisePage() {
  const { profile } = useOutletContext() || {};
  const [expertiseList, setExpertiseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    document.title = profile?.name
      ? `Expertise & Instrumentation | ${profile.name}`
      : 'Expertise & Instrumentation | Swayang Priya Mahanta';

    const fetchExpertise = async () => {
      try {
        const res = await portfolioService.getExpertise();
        if (res.data && Array.isArray(res.data)) {
          setExpertiseList(res.data);
        }
      } catch (err) {
        console.error('Error fetching expertise:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertise();
  }, [profile]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    expertiseList.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [expertiseList]);

  const filteredList = useMemo(() => {
    if (selectedCategory === 'All') return expertiseList;
    return expertiseList.filter(
      (item) => item.category && item.category.trim() === selectedCategory
    );
  }, [expertiseList, selectedCategory]);

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Capability & Apparatus"
        title="Expertise & Instrumentation"
        subtitle="Specialized laboratory instrumentation, experimental techniques, computational workflows, and core technical proficiencies."
      />

      {/* Category Filter Pills (when multiple categories exist) */}
      {!loading && categories.length > 2 && (
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading expertise and instrumentation..." />
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredList.map((item) => (
            <ExpertiseCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No expertise records found"
          description="Specialized laboratory instrumentation, methodologies, and technical capabilities will appear here once added."
          icon={Cpu}
        />
      )}
    </div>
  );
}
