import React, { useEffect, useState, useMemo } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  GraduationCap,
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
  MapPin,
  BookOpen
} from 'lucide-react';

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    field: '',
    location: '',
    startYear: '',
    endYear: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchEducation = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getEducation();
      if (res.data) {
        setEducationList(res.data);
      }
    } catch (err) {
      console.error('Error fetching education records:', err);
      setFetchError('Unable to load education records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Education Management | Academic Portfolio CMS';
    fetchEducation();
  }, []);

  // Filtered list
  const filteredEducation = useMemo(() => {
    return educationList.filter((edu) => {
      const searchableText = `${edu.degree || ''} ${edu.institution || ''} ${
        edu.field || ''
      } ${edu.location || ''} ${edu.description || ''}`.toLowerCase();

      return !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());
    });
  }, [educationList, searchQuery]);

  // Open modal for creating new record
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      degree: '',
      institution: '',
      field: '',
      location: '',
      startYear: '',
      endYear: '',
      description: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing record
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree || '',
      institution: item.institution || '',
      field: item.field || '',
      location: item.location || '',
      startYear: item.startYear || '',
      endYear: item.endYear || '',
      description: item.description || '',
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

    if (!formData.degree.trim()) {
      setFormError('Degree is required.');
      return;
    }
    if (!formData.institution.trim()) {
      setFormError('Institution is required.');
      return;
    }

    if (formData.startYear && (isNaN(Number(formData.startYear)) || Number(formData.startYear) < 1900 || Number(formData.startYear) > 2100)) {
      setFormError('Start Year should be a valid year (1900–2100).');
      return;
    }

    if (formData.endYear && formData.endYear.toLowerCase() !== 'present' && (isNaN(Number(formData.endYear)) || Number(formData.endYear) < 1900 || Number(formData.endYear) > 2100)) {
      setFormError('End Year should be a valid year (1900–2100) or "Present".');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateEducation(editingItem._id, formData);
        setAlertMessage({
          type: 'success',
          text: `Education qualification "${formData.degree}" updated successfully.`,
        });
      } else {
        await portfolioService.createEducation(formData);
        setAlertMessage({
          type: 'success',
          text: `Education qualification "${formData.degree}" created successfully.`,
        });
      }

      closeModal();
      await fetchEducation();
    } catch (err) {
      console.error('Error saving education:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save education record. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const promptDelete = (item) => {
    setDeletingId(item._id);
    setDeletingTitle(`${item.degree} - ${item.institution}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deleteEducation(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Education record deleted successfully.',
      });
      setDeletingId(null);
      setDeletingTitle('');
      await fetchEducation();
    } catch (err) {
      console.error('Error deleting education:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete education record.',
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
            Academic Background & Education
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your academic timeline, university degrees, doctoral training, and qualifications.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/about"
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
            <span>Add Education</span>
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

      {/* Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by degree, institution, field of study, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            title="Reset search"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading education records..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load education records"
          message={fetchError}
          onRetry={fetchEducation}
        />
      ) : educationList.length === 0 ? (
        <EmptyState
          title="No education records added yet"
          description="Click 'Add Education' above to record your degrees, doctoral research, and university qualifications."
          icon={GraduationCap}
          actionText="Add Education"
          actionHref="#"
        />
      ) : filteredEducation.length === 0 ? (
        <EmptyState
          title="No matching qualifications found"
          description="Try adjusting your search terms to view all entries."
          icon={Search}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing {filteredEducation.length} of {educationList.length} qualification
              {educationList.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEducation.map((item) => {
              const yearsFormatted =
                item.startYear || item.endYear
                  ? `${item.startYear || ''} — ${item.endYear || 'Present'}`
                  : null;

              return (
                <div
                  key={item._id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Header line: Years and Field */}
                    <div className="flex flex-wrap items-center gap-2">
                      {yearsFormatted && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {yearsFormatted}
                        </span>
                      )}

                      {item.field && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          {item.field}
                        </span>
                      )}
                    </div>

                    {/* Degree */}
                    <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug">
                      {item.degree}
                    </h3>

                    {/* Institution & Location */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.institution}
                      </span>

                      {item.location && (
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
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
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Qualification' : 'Add New Qualification'}
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

              {/* Degree */}
              <div>
                <label
                  htmlFor="edu-degree"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Degree / Program <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edu-degree"
                  name="degree"
                  type="text"
                  required
                  placeholder="e.g. Ph.D. in Physical Sciences / Integrated M.Sc. in Physics"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Institution */}
              <div>
                <label
                  htmlFor="edu-inst"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  University / Institution <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edu-inst"
                  name="institution"
                  type="text"
                  required
                  placeholder="e.g. National Institute of Science Education and Research (NISER)"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Field & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edu-field"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Major / Field of Study
                  </label>
                  <input
                    id="edu-field"
                    name="field"
                    type="text"
                    placeholder="e.g. Condensed Matter & Quantum Physics"
                    value={formData.field}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edu-location"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Campus Location
                  </label>
                  <input
                    id="edu-location"
                    name="location"
                    type="text"
                    placeholder="e.g. Bhubaneswar, Odisha, India"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Start Year & End Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edu-startYear"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Start Year
                  </label>
                  <input
                    id="edu-startYear"
                    name="startYear"
                    type="text"
                    placeholder="e.g. 2021"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edu-endYear"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    End Year
                  </label>
                  <input
                    id="edu-endYear"
                    name="endYear"
                    type="text"
                    placeholder="e.g. 2026 or Present"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="edu-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Thesis Title / Academic Focus / Honors
                </label>
                <textarea
                  id="edu-desc"
                  name="description"
                  rows={3}
                  placeholder="Dissertation focus, research advisor, GPA/grade, and key coursework..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-serif"
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
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Record'}</span>
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
                Are you sure you want to delete the qualification record{' '}
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
                  <span>Delete Record</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
