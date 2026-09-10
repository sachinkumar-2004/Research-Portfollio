import React, { useEffect, useState, useMemo } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Presentation,
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  Globe
} from 'lucide-react';

const PRESENTATION_TYPES = [
  'Oral Presentation',
  'Poster',
  'Invited Presentation',
  'Other'
];

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    conferenceName: '',
    location: '',
    date: '',
    presentationType: 'Oral Presentation',
    description: '',
    posterUrl: '',
    slidesUrl: '',
    conferenceUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchConferences = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getConferences();
      if (res.data) {
        setConferences(res.data);
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      setFetchError('Unable to load conferences from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Conferences Management | Academic Portfolio CMS';
    fetchConferences();
  }, []);

  // Filtered conferences
  const filteredConferences = useMemo(() => {
    return conferences.filter((conf) => {
      const searchableText = `${conf.title || ''} ${conf.conferenceName || ''} ${
        conf.location || ''
      } ${conf.description || ''}`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());
      const matchesType = filterType === 'all' || conf.presentationType === filterType;

      return matchesSearch && matchesType;
    });
  }, [conferences, searchQuery, filterType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  // Open modal for adding a new conference
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      conferenceName: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      presentationType: 'Oral Presentation',
      description: '',
      posterUrl: '',
      slidesUrl: '',
      conferenceUrl: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing conference
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      conferenceName: item.conferenceName || '',
      location: item.location || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      presentationType: item.presentationType || 'Oral Presentation',
      description: item.description || '',
      posterUrl: item.posterUrl || '',
      slidesUrl: item.slidesUrl || '',
      conferenceUrl: item.conferenceUrl || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Presentation / Paper Title is required.');
      return;
    }
    if (!formData.conferenceName.trim()) {
      setFormError('Conference Name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateConference(editingItem._id, formData);
        setAlertMessage({
          type: 'success',
          text: `Conference entry "${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createConference(formData);
        setAlertMessage({
          type: 'success',
          text: `Conference entry "${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchConferences();
    } catch (err) {
      console.error('Error saving conference:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save conference entry. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const promptDelete = (item) => {
    setDeletingId(item._id);
    setDeletingTitle(item.title);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deleteConference(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Conference record deleted successfully.',
      });
      setDeletingId(null);
      setDeletingTitle('');
      await fetchConferences();
    } catch (err) {
      console.error('Error deleting conference:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete conference record.',
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
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Portfolio CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Conferences & Symposia Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage national and international conference participations, oral papers, and poster presentations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/talks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Conference</span>
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
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by presentation title, conference name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Presentation Types</option>
            {PRESENTATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {(searchQuery || filterType !== 'all') && (
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
        <LoadingState message="Loading conference records..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load conferences"
          message={fetchError}
          onRetry={fetchConferences}
        />
      ) : conferences.length === 0 ? (
        <EmptyState
          title="No conferences cataloged yet"
          description="Click 'Add Conference' above to record your first conference presentation or poster."
          icon={Presentation}
          actionText="Add Conference"
          actionHref="#"
        />
      ) : filteredConferences.length === 0 ? (
        <EmptyState
          title="No matching conferences found"
          description="Try adjusting your search criteria or resetting the filter."
          icon={Search}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing {filteredConferences.length} of {conferences.length} conference
              {conferences.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredConferences.map((item) => {
              const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : null;

              return (
                <div
                  key={item._id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-900/40">
                        {item.presentationType || 'Oral Presentation'}
                      </span>

                      {formattedDate && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
                      {item.title}
                    </h3>

                    {/* Conference Name & Location */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.conferenceName}
                      </span>

                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.location}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 font-serif">
                        {item.description}
                      </p>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {item.conferenceUrl && (
                        <a
                          href={item.conferenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline font-medium"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Conference Website</span>
                        </a>
                      )}
                      {item.slidesUrl && (
                        <a
                          href={item.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Presentation Slides</span>
                        </a>
                      )}
                      {item.posterUrl && (
                        <a
                          href={item.posterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Poster View</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
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
              );
            })}
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
            className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Conference Entry' : 'Add New Conference Entry'}
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
                  htmlFor="conf-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Presentation / Paper Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="conf-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Exotic Excitations and Majorana Fermions in 1D Superconducting Wires"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Conference Name */}
              <div>
                <label
                  htmlFor="conf-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Conference / Symposium Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="conf-name"
                  name="conferenceName"
                  type="text"
                  required
                  placeholder="e.g. APS March Meeting 2025 / International Condensed Matter Conference"
                  value={formData.conferenceName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Presentation Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="conf-type"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Presentation Type
                  </label>
                  <select
                    id="conf-type"
                    name="presentationType"
                    value={formData.presentationType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {PRESENTATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="conf-date"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Date
                  </label>
                  <input
                    id="conf-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="conf-location"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Location / City & Country
                </label>
                <input
                  id="conf-location"
                  name="location"
                  type="text"
                  placeholder="e.g. Los Angeles, CA, USA / Berlin, Germany"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="conf-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Session Description / Contribution Summary
                </label>
                <textarea
                  id="conf-desc"
                  name="description"
                  rows={3}
                  placeholder="Summary of presentation topic, session chair information, and audience feedback..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-serif"
                />
              </div>

              {/* URLs: Conference URL, Slides URL, Poster URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="conf-url"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Conference URL
                  </label>
                  <input
                    id="conf-url"
                    name="conferenceUrl"
                    type="url"
                    placeholder="https://march.aps.org/..."
                    value={formData.conferenceUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="conf-slides"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Slides URL
                  </label>
                  <input
                    id="conf-slides"
                    name="slidesUrl"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={formData.slidesUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="conf-poster"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Poster URL
                  </label>
                  <input
                    id="conf-poster"
                    name="posterUrl"
                    type="url"
                    placeholder="https://figshare.com/... or image link"
                    value={formData.posterUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
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
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Conference Entry'}</span>
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
                Are you sure you want to delete the conference entry{' '}
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
                  <span>Delete Conference</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
