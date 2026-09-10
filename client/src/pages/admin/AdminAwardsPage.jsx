import React, { useEffect, useState, useMemo } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Award,
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
  Building2,
  Globe
} from 'lucide-react';

const AWARD_TYPES = [
  'Award',
  'Fellowship',
  'Grant',
  'Scholarship',
  'Recognition',
  'Other'
];

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: new Date().getFullYear(),
    type: 'Award',
    description: '',
    url: '',
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchAwards = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getAwards();
      if (res.data) {
        setAwards(res.data);
      }
    } catch (err) {
      console.error('Error fetching awards:', err);
      setFetchError('Unable to load awards from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Awards Management | Academic Portfolio CMS';
    fetchAwards();
  }, []);

  // Compute unique years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(awards.map((a) => a.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [awards]);

  // Filtered awards
  const filteredAwards = useMemo(() => {
    return awards.filter((award) => {
      const searchableText = `${award.title || ''} ${award.organization || ''} ${
        award.description || ''
      }`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());
      const matchesType = filterType === 'all' || award.type === filterType;
      const matchesYear = filterYear === 'all' || award.year === Number(filterYear);

      return matchesSearch && matchesType && matchesYear;
    });
  }, [awards, searchQuery, filterType, filterYear]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterYear('all');
  };

  // Open modal for adding a new award
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      organization: '',
      year: new Date().getFullYear(),
      type: 'Award',
      description: '',
      url: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing award
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      year: item.year || new Date().getFullYear(),
      type: item.type || 'Award',
      description: item.description || '',
      url: item.url || '',
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
      setFormError('Award Title is required.');
      return;
    }
    if (!formData.organization.trim()) {
      setFormError('Organization is required.');
      return;
    }
    if (formData.year && (isNaN(Number(formData.year)) || Number(formData.year) < 1900 || Number(formData.year) > 2100)) {
      setFormError('Please enter a valid year between 1900 and 2100.');
      return;
    }

    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : undefined,
    };

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateAward(editingItem._id, payload);
        setAlertMessage({
          type: 'success',
          text: `Award "${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createAward(payload);
        setAlertMessage({
          type: 'success',
          text: `Award "${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchAwards();
    } catch (err) {
      console.error('Error saving award:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save award. Please check your inputs and try again.'
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
      await portfolioService.deleteAward(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Award record deleted successfully.',
      });
      setDeletingId(null);
      setDeletingTitle('');
      await fetchAwards();
    } catch (err) {
      console.error('Error deleting award:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete award.',
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
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Portfolio CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Awards & Honors Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage academic awards, research fellowships, travel grants, scholarships, and recognitions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/awards"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Award</span>
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
            placeholder="Search by award title, granting body, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
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
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Types</option>
            {AWARD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {(searchQuery || filterType !== 'all' || filterYear !== 'all') && (
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
        <LoadingState message="Loading awards records..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load awards"
          message={fetchError}
          onRetry={fetchAwards}
        />
      ) : awards.length === 0 ? (
        <EmptyState
          title="No awards recorded yet"
          description="Click 'Add Award' above to record your first academic fellowship, grant, or honor."
          icon={Award}
          actionText="Add Award"
          actionHref="#"
        />
      ) : filteredAwards.length === 0 ? (
        <EmptyState
          title="No matching awards found"
          description="Try adjusting your search criteria or resetting filters."
          icon={Search}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing {filteredAwards.length} of {awards.length} award
              {awards.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAwards.map((item) => (
              <div
                key={item._id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40">
                      {item.type || 'Award'}
                    </span>

                    {item.year && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.year}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
                    {item.title}
                  </h3>

                  {/* Organization */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.organization}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 font-serif">
                      {item.description}
                    </p>
                  )}

                  {/* Links */}
                  {item.url && (
                    <div className="pt-1 text-xs">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Award / Verification URL</span>
                      </a>
                    </div>
                  )}
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
            className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Award Details' : 'Add New Award / Honor'}
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
                  htmlFor="award-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Award / Honor Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="award-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. DST-INSPIRE Senior Research Fellowship / Best Poster Award"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Organization */}
              <div>
                <label
                  htmlFor="award-org"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Granting Body / Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  id="award-org"
                  name="organization"
                  type="text"
                  required
                  placeholder="e.g. Department of Science and Technology (DST), Govt. of India"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Type & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="award-type"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Award Type
                  </label>
                  <select
                    id="award-type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {AWARD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="award-year"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Year
                  </label>
                  <input
                    id="award-year"
                    name="year"
                    type="number"
                    min={1900}
                    max={2100}
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="award-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Description / Significance
                </label>
                <textarea
                  id="award-desc"
                  name="description"
                  rows={3}
                  placeholder="Details regarding the competitive selection, grant amount, or honored achievements..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-serif"
                />
              </div>

              {/* URL */}
              <div>
                <label
                  htmlFor="award-url"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Verification / Announcement URL
                </label>
                <input
                  id="award-url"
                  name="url"
                  type="url"
                  placeholder="https://dst.gov.in/awards/..."
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
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
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Award'}</span>
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
                Are you sure you want to delete the award{' '}
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
                  <span>Delete Award</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
