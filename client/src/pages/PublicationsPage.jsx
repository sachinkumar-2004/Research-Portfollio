import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import PublicationCard from '../components/cards/PublicationCard';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { BookOpen, Search, Filter, RotateCcw } from 'lucide-react';

export default function PublicationsPage() {
  const { profile } = useOutletContext() || {};
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    document.title = profile?.name
      ? `Publications & Scholarship | ${profile.name}`
      : 'Publications & Scholarship | Academic Portfolio';

    const fetchPublications = async () => {
      try {
        const res = await portfolioService.getPublications();
        if (res.data) {
          setPublications(res.data);
        }
      } catch (err) {
        console.error('Error fetching publications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  // Compute unique years and publication types for filter dropdowns
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(publications.map((p) => p.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [publications]);

  const availableTypes = useMemo(() => {
    return Array.from(new Set(publications.map((p) => p.publicationType).filter(Boolean)));
  }, [publications]);

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Search matching title, authors, journal, doi, researchArea
      const authorsText = Array.isArray(pub.authors) ? pub.authors.join(' ') : pub.authors || '';
      const searchableText = `${pub.title} ${authorsText} ${pub.journal || ''} ${pub.doi || ''} ${
        pub.researchArea || ''
      }`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());

      const matchesYear = selectedYear === 'all' || pub.year === Number(selectedYear);
      const matchesType = selectedType === 'all' || pub.publicationType === selectedType;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [publications, searchQuery, selectedYear, selectedType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedType('all');
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        badge="Scholarship"
        title="Publications & Scholarly Articles"
        subtitle="Peer-reviewed papers, preprints, journal articles, and academic monographs."
      />

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, journal, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Year dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Type dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Types</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {(searchQuery || selectedYear !== 'all' || selectedType !== 'all') && (
            <button
              onClick={handleResetFilters}
              title="Reset filters"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Publications Listing */}
      {loading ? (
        <LoadingState message="Loading publications..." />
      ) : filteredPublications.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            Showing {filteredPublications.length} publication
            {filteredPublications.length === 1 ? '' : 's'}
          </div>
          {filteredPublications.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </div>
      ) : publications.length > 0 ? (
        <EmptyState
          title="No matching publications found"
          description="Try adjusting your search terms or resetting filters to view all entries."
          icon={Search}
        />
      ) : (
        <EmptyState
          title="No publications cataloged yet"
          description="Publications, preprint papers, and journal articles will appear here."
          icon={BookOpen}
        />
      )}
    </div>
  );
}
