import React, { useEffect, useState, useMemo } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import FileUpload from '../../components/admin/FileUpload';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  RotateCcw,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUpDown,
  FileText,
  Globe,
  Tag
} from 'lucide-react';

const PUBLICATION_TYPES = [
  'Journal Article',
  'Conference Paper',
  'Preprint',
  'Book Chapter',
  'Other'
];

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    journal: '',
    publicationType: 'Journal Article',
    year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    abstract: '',
    publisherUrl: '',
    pdfUrl: '',
    googleScholarUrl: '',
    researchArea: '',
    featured: false,
    order: 0,
  });

  const [newAuthor, setNewAuthor] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchPublications = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getPublications();
      if (res.data) {
        setPublications(res.data);
      }
    } catch (err) {
      console.error('Error fetching publications:', err);
      setFetchError('Unable to load publications from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Publications Management | Academic Portfolio CMS';
    fetchPublications();
  }, []);

  // Compute available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(publications.map((p) => p.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [publications]);

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const authorsText = Array.isArray(pub.authors) ? pub.authors.join(' ') : pub.authors || '';
      const searchableText = `${pub.title || ''} ${authorsText} ${pub.journal || ''} ${pub.doi || ''} ${
        pub.researchArea || ''
      }`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());
      const matchesYear = filterYear === 'all' || pub.year === Number(filterYear);
      const matchesType = filterType === 'all' || pub.publicationType === filterType;
      const matchesFeatured =
        filterFeatured === 'all'
          ? true
          : filterFeatured === 'featured'
          ? Boolean(pub.featured)
          : !pub.featured;

      return matchesSearch && matchesYear && matchesType && matchesFeatured;
    });
  }, [publications, searchQuery, filterYear, filterType, filterFeatured]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterYear('all');
    setFilterType('all');
    setFilterFeatured('all');
  };

  // Open modal for adding a new publication
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      authors: [],
      journal: '',
      publicationType: 'Journal Article',
      year: new Date().getFullYear(),
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      abstract: '',
      publisherUrl: '',
      pdfUrl: '',
      googleScholarUrl: '',
      researchArea: '',
      featured: false,
      order: publications.length,
    });
    setNewAuthor('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing publication
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      authors: Array.isArray(item.authors) ? item.authors : [],
      journal: item.journal || '',
      publicationType: item.publicationType || 'Journal Article',
      year: item.year || new Date().getFullYear(),
      volume: item.volume || '',
      issue: item.issue || '',
      pages: item.pages || '',
      doi: item.doi || '',
      abstract: item.abstract || '',
      publisherUrl: item.publisherUrl || '',
      pdfUrl: item.pdfUrl || '',
      googleScholarUrl: item.googleScholarUrl || '',
      researchArea: item.researchArea || '',
      featured: Boolean(item.featured),
      order: item.order !== undefined ? item.order : 0,
    });
    setNewAuthor('');
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Authors tag manager
  const handleAddAuthor = (e) => {
    if (e) e.preventDefault();
    const trimmed = newAuthor.trim();
    if (trimmed && !formData.authors.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        authors: [...prev.authors, trimmed],
      }));
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (index) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  // Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Publication Title is required.');
      return;
    }
    if (!formData.year || isNaN(Number(formData.year))) {
      setFormError('A valid publication year (e.g. 2025) is required.');
      return;
    }

    const payload = {
      ...formData,
      year: Number(formData.year),
      order: Number(formData.order) || 0,
    };

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updatePublication(editingItem._id, payload);
        setAlertMessage({
          type: 'success',
          text: `Publication "${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createPublication(payload);
        setAlertMessage({
          type: 'success',
          text: `Publication "${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchPublications();
    } catch (err) {
      console.error('Error saving publication:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save publication. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete confirm handler
  const promptDelete = (item) => {
    setDeletingId(item._id);
    setDeletingTitle(item.title);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deletePublication(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Publication entry deleted successfully.',
      });
      setDeletingId(null);
      setDeletingTitle('');
      await fetchPublications();
    } catch (err) {
      console.error('Error deleting publication:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete publication.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Portfolio CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Publications Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage peer-reviewed papers, journal articles, preprints, conference proceedings, and book chapters.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/publications"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Publication</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {alertMessage.text && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm shadow-xs ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button
            onClick={() => setAlertMessage({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, journal, DOI, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Types</option>
            {PUBLICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Featured Filter */}
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Featured</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Standard</option>
          </select>

          {(searchQuery || filterYear !== 'all' || filterType !== 'all' || filterFeatured !== 'all') && (
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

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading publications catalog..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load publications"
          message={fetchError}
          onRetry={fetchPublications}
        />
      ) : publications.length === 0 ? (
        <EmptyState
          title="No publications added yet"
          description="Click 'Add Publication' above to create your first scholarly publication entry."
          icon={BookOpen}
          actionText="Add Publication"
          actionHref="#"
        />
      ) : filteredPublications.length === 0 ? (
        <EmptyState
          title="No matching publications found"
          description="Try adjusting your search criteria or resetting filters."
          icon={Search}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing {filteredPublications.length} of {publications.length} publication
              {filteredPublications.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPublications.map((item) => (
              <div
                key={item._id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40">
                      {item.year}
                    </span>

                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.publicationType || 'Journal Article'}
                    </span>

                    {item.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Featured
                      </span>
                    )}

                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3" />
                      Order: {item.order !== undefined ? item.order : 0}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
                    {item.title}
                  </h3>

                  {/* Authors */}
                  {item.authors && item.authors.length > 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {item.authors.join(', ')}
                    </p>
                  )}

                  {/* Journal & Metadata */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {item.journal && (
                      <span className="italic font-serif text-slate-700 dark:text-slate-300">
                        {item.journal}
                        {item.volume ? ` ${item.volume}` : ''}
                        {item.issue ? `(${item.issue})` : ''}
                        {item.pages ? `, pp. ${item.pages}` : ''}
                      </span>
                    )}

                    {item.doi && (
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                        DOI: {item.doi}
                      </span>
                    )}

                    {item.researchArea && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {item.researchArea}
                      </span>
                    )}
                  </div>

                  {/* Abstract Preview */}
                  {item.abstract && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 font-serif">
                      {item.abstract}
                    </p>
                  )}

                  {/* Links Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    {item.publisherUrl && (
                      <a
                        href={item.publisherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Publisher</span>
                      </a>
                    )}
                    {item.pdfUrl && (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    )}
                    {item.googleScholarUrl && (
                      <a
                        href={item.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Scholar</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => promptDelete(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Publication' : 'Add New Publication'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label
                  htmlFor="pub-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Publication Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="pub-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Topological Phase Transitions in Strongly Correlated 2D Materials"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Year & Publication Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pub-year"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Publication Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="pub-year"
                    name="year"
                    type="number"
                    required
                    min={1950}
                    max={2100}
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-type"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Publication Type
                  </label>
                  <select
                    id="pub-type"
                    name="publicationType"
                    value={formData.publicationType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {PUBLICATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Authors Tag Manager */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Authors (in order of publication)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter author name (e.g. S. Mahanta, J. Doe)..."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAuthor();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="px-3.5 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Add Author
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.authors.map((author, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs"
                    >
                      <span className="font-medium">
                        {idx + 1}. {author}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAuthor(idx)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Journal / Venue & Research Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pub-journal"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Journal / Conference / Publisher
                  </label>
                  <input
                    id="pub-journal"
                    name="journal"
                    type="text"
                    placeholder="e.g. Physical Review B / IEEE / Nature"
                    value={formData.journal}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-area"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Research Area / Category
                  </label>
                  <input
                    id="pub-area"
                    name="researchArea"
                    type="text"
                    placeholder="e.g. Condensed Matter Physics, Quantum Computing"
                    value={formData.researchArea}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Volume, Issue, Pages, DOI */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label
                    htmlFor="pub-volume"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Volume
                  </label>
                  <input
                    id="pub-volume"
                    name="volume"
                    type="text"
                    placeholder="e.g. 104"
                    value={formData.volume}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-issue"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Issue / No.
                  </label>
                  <input
                    id="pub-issue"
                    name="issue"
                    type="text"
                    placeholder="e.g. 12"
                    value={formData.issue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-pages"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Pages
                  </label>
                  <input
                    id="pub-pages"
                    name="pages"
                    type="text"
                    placeholder="e.g. 125101"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-doi"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    DOI
                  </label>
                  <input
                    id="pub-doi"
                    name="doi"
                    type="text"
                    placeholder="10.1103/PhysRevB..."
                    value={formData.doi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label
                  htmlFor="pub-abstract"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Abstract
                </label>
                <textarea
                  id="pub-abstract"
                  name="abstract"
                  rows={3}
                  placeholder="Summary abstract of the paper..."
                  value={formData.abstract}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-serif"
                />
              </div>

              {/* Publication PDF with ImageKit Upload */}
              <div className="pt-1">
                <FileUpload
                  label="Publication PDF Document (Optional)"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, pdfUrl: url }))}
                  folder="/academic-portfolio/publications"
                  accept=".pdf,application/pdf"
                  helperText="Upload preprint/published paper PDF or provide direct URL"
                />
              </div>

              {/* URLs: Publisher & Google Scholar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="pub-publisherUrl"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Publisher DOI URL
                  </label>
                  <input
                    id="pub-publisherUrl"
                    name="publisherUrl"
                    type="url"
                    placeholder="https://journals.aps.org/..."
                    value={formData.publisherUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pub-scholarUrl"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Google Scholar URL
                  </label>
                  <input
                    id="pub-scholarUrl"
                    name="googleScholarUrl"
                    type="url"
                    placeholder="https://scholar.google.com/..."
                    value={formData.googleScholarUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Order & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-center">
                <div>
                  <label
                    htmlFor="pub-order"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Display Sort Order
                  </label>
                  <input
                    id="pub-order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2.5 sm:mt-5">
                  <input
                    id="pub-featured"
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="pub-featured"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Feature this publication on homepage / highlights
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Publication'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Confirm Deletion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to delete the publication{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  "{deletingTitle}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Publication</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
