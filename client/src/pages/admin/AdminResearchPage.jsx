import React, { useEffect, useState } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import FileUpload from '../../components/admin/FileUpload';
import {
  Microscope,
  Plus,
  Edit2,
  Trash2,
  Star,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    researchInterests: [],
    methods: [],
    image: '',
    featured: false,
    order: 0,
    relatedPublicationIds: [],
  });

  const [newInterest, setNewInterest] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchResearchAndPubs = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [resResearch, resPubs] = await Promise.allSettled([
        portfolioService.getResearch(),
        portfolioService.getPublications(),
      ]);

      if (resResearch.status === 'fulfilled' && resResearch.value.data) {
        setResearchList(resResearch.value.data);
      } else {
        throw new Error('Failed to fetch research records');
      }

      if (resPubs.status === 'fulfilled' && resPubs.value.data) {
        setPublications(resPubs.value.data);
      }
    } catch (err) {
      console.error('Error fetching research data:', err);
      setFetchError('Unable to load research projects from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Research Management | Academic Portfolio CMS';
    fetchResearchAndPubs();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      researchInterests: [],
      methods: [],
      image: '',
      featured: false,
      order: researchList.length,
      relatedPublicationIds: [],
    });
    setNewInterest('');
    setNewMethod('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      shortDescription: item.shortDescription || '',
      description: item.description || '',
      researchInterests: Array.isArray(item.researchInterests) ? item.researchInterests : [],
      methods: Array.isArray(item.methods) ? item.methods : [],
      image: item.image || '',
      featured: Boolean(item.featured),
      order: item.order !== undefined ? item.order : 0,
      relatedPublicationIds: Array.isArray(item.relatedPublicationIds)
        ? item.relatedPublicationIds.map((p) => (typeof p === 'object' ? p._id : p))
        : [],
    });
    setNewInterest('');
    setNewMethod('');
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

  // Interest tags
  const handleAddInterest = (e) => {
    if (e) e.preventDefault();
    const val = newInterest.trim();
    if (val && !formData.researchInterests.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, val],
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, i) => i !== index),
    }));
  };

  // Method tags
  const handleAddMethod = (e) => {
    if (e) e.preventDefault();
    const val = newMethod.trim();
    if (val && !formData.methods.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        methods: [...prev.methods, val],
      }));
      setNewMethod('');
    }
  };

  const handleRemoveMethod = (index) => {
    setFormData((prev) => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index),
    }));
  };

  // Related publications toggle
  const handlePublicationToggle = (pubId) => {
    setFormData((prev) => {
      const exists = prev.relatedPublicationIds.includes(pubId);
      return {
        ...prev,
        relatedPublicationIds: exists
          ? prev.relatedPublicationIds.filter((id) => id !== pubId)
          : [...prev.relatedPublicationIds, pubId],
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Research Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Research Description is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateResearch(editingItem._id, formData);
        setAlertMessage({
          type: 'success',
          text: `Research project "${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createResearch(formData);
        setAlertMessage({
          type: 'success',
          text: `Research project "${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchResearchAndPubs();
    } catch (err) {
      console.error('Error saving research project:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save research project. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deleteResearch(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Research project deleted successfully.',
      });
      setDeletingId(null);
      await fetchResearchAndPubs();
    } catch (err) {
      console.error('Error deleting research:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete research project.',
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
            Research Projects & Areas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your scientific investigations, laboratory methodologies, and project summaries.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/research"
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
            <span>Add Research</span>
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

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading research records..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load research projects"
          message={fetchError}
          onRetry={fetchResearchAndPubs}
        />
      ) : researchList.length === 0 ? (
        <EmptyState
          title="No research projects added yet"
          description="Click 'Add Research' above to create your first research area or investigative project."
          icon={Microscope}
          actionText="Add Research"
          actionHref="#"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {researchList.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    Order: {item.order !== undefined ? item.order : 0}
                  </span>
                  {item.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                  )}
                  {item.methods && item.methods.length > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      • {item.methods.length} method{item.methods.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>

                {item.shortDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.shortDescription}
                  </p>
                )}

                {item.researchInterests && item.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openEditModal(item)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeletingId(item._id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
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
                <Microscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Research Project' : 'Add New Research Project'}
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
                  htmlFor="title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Quantum Dynamics in Low-Dimensional Systems"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Short Description */}
              <div>
                <label
                  htmlFor="shortDescription"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Short Description / Summary
                </label>
                <input
                  id="shortDescription"
                  name="shortDescription"
                  type="text"
                  placeholder="Concise single-sentence summary for cards..."
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Comprehensive Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Description & Methodology <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Detailed scientific objectives, theoretical formulations, and experimental frameworks..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Research Interests Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Research Interests / Themes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add research topic (e.g. Condensed Matter)..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.researchInterests.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(idx)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Methods Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Methods & Techniques
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add methodology (e.g. Monte Carlo, DFT, Spectroscopy)..."
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMethod();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddMethod}
                    className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.methods.map((method, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono text-[11px]"
                    >
                      <span>{method}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMethod(idx)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Image with ImageKit Upload */}
              <div>
                <FileUpload
                  label="Research Project Image (Optional)"
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="/academic-portfolio/research"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  helperText="Upload project banner or figure (JPG, PNG, WEBP)"
                />
              </div>

              {/* Display Sort Order */}
              <div>
                <label
                  htmlFor="order"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Display Sort Order
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Feature this research project on the homepage
                </label>
              </div>

              {/* Related Publications Checklist */}
              {publications.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Related Publications ({formData.relatedPublicationIds.length} selected)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-950">
                    {publications.map((pub) => {
                      const isSelected = formData.relatedPublicationIds.includes(pub._id);
                      return (
                        <label
                          key={pub._id}
                          className="flex items-start gap-2 p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-900 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePublicationToggle(pub._id)}
                            className="mt-0.5 w-3.5 h-3.5 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300 leading-tight">
                            <span className="font-semibold">[{pub.year || 'Pub'}]</span> {pub.title}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                    <span>{editingItem ? 'Save Changes' : 'Create Project'}</span>
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
                Are you sure you want to delete this research project? This action cannot be undone.
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
                  <span>Delete Project</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
