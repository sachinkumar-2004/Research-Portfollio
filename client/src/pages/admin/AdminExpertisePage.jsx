import React, { useEffect, useState } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import FileUpload from '../../components/admin/FileUpload';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Save
} from 'lucide-react';

export default function AdminExpertisePage() {
  const [expertiseList, setExpertiseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Drag & drop reorder state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isReorderDirty, setIsReorderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    icon: '',
    featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notification
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchExpertise = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getExpertise();
      if (res.data && Array.isArray(res.data)) {
        setExpertiseList(res.data);
        setIsReorderDirty(false);
      } else {
        throw new Error('Failed to fetch expertise records');
      }
    } catch (err) {
      console.error('Error fetching expertise data:', err);
      setFetchError('Unable to load expertise and instrumentation items from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Expertise Management | Academic Portfolio CMS';
    fetchExpertise();
  }, []);

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...expertiseList];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    setExpertiseList(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsReorderDirty(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    if (expertiseList.length === 0) return;

    setSavingOrder(true);
    try {
      const orderedIds = expertiseList.map((item) => item._id);
      const res = await portfolioService.reorderExpertise(orderedIds);
      if (res.data && Array.isArray(res.data)) {
        setExpertiseList(res.data);
      }
      setIsReorderDirty(false);
      setAlertMessage({
        type: 'success',
        text: 'Expertise display order saved successfully.',
      });
    } catch (err) {
      console.error('Error saving expertise ordering:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save expertise ordering.',
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      imageUrl: '',
      icon: '',
      featured: false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      imageUrl: item.imageUrl || '',
      icon: item.icon || '',
      featured: Boolean(item.featured),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateExpertise(editingItem._id, formData);
        setAlertMessage({
          type: 'success',
          text: `"${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createExpertise({
          ...formData,
          order: expertiseList.length + 1,
        });
        setAlertMessage({
          type: 'success',
          text: `"${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchExpertise();
    } catch (err) {
      console.error('Error saving expertise item:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save expertise item. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deleteExpertise(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Expertise item deleted successfully.',
      });
      setDeletingId(null);
      await fetchExpertise();
    } catch (err) {
      console.error('Error deleting expertise item:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete expertise item.',
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
            Expertise & Instrumentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag cards to rearrange their live order, then click <strong className="text-slate-800 dark:text-slate-200 font-medium">Save Order</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Save Order Button */}
          {expertiseList.length > 1 && (
            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={savingOrder || !isReorderDirty}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-xs cursor-pointer ${
                isReorderDirty
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
              }`}
            >
              {savingOrder ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Order...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isReorderDirty ? 'Save Order *' : 'Order Saved'}</span>
                </>
              )}
            </button>
          )}

          <a
            href="/expertise"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expertise</span>
          </button>
        </div>
      </div>

      {/* Unsaved Order Reminder Banner */}
      {isReorderDirty && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200 shadow-xs">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>You have unsaved order changes. Click <strong>Save Order</strong> to persist this layout.</span>
          </div>
          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={savingOrder}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
          >
            {savingOrder ? 'Saving...' : 'Save Order Now'}
          </button>
        </div>
      )}

      {/* Alert Banner */}
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
            type="button"
            onClick={() => setAlertMessage({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main List Area with Drag-and-Drop */}
      {loading ? (
        <LoadingState message="Loading expertise and instrumentation records..." />
      ) : fetchError ? (
        <ErrorState
          title="Could not load expertise records"
          message={fetchError}
          onRetry={fetchExpertise}
        />
      ) : expertiseList.length === 0 ? (
        <EmptyState
          title="No expertise records found"
          description="Click 'Add Expertise' to add your first laboratory instrumentation or technical capability."
          icon={Cpu}
          actionText="Add Expertise"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertiseList.map((item, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={item._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                  isDragging
                    ? 'opacity-40 scale-[0.98] border-dashed border-blue-500 dark:border-blue-400'
                    : isDragOver
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/50 shadow-lg scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Image Preview & Drag Handle Bar */}
                  <div className="relative">
                    {item.imageUrl ? (
                      <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="h-28 w-full bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 text-xs gap-1.5 pointer-events-none">
                        <ImageIcon className="w-4 h-4 opacity-50" />
                        <span>No image attached</span>
                      </div>
                    )}

                    {/* Order Badge & Grip Handle */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 dark:bg-slate-950/90 text-white backdrop-blur-xs text-xs font-semibold shadow-xs">
                      <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                      <span>#{index + 1}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50">
                        {item.category || 'Instrumentation'}
                      </span>

                      {item.featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                      {item.icon && <span className="mr-1.5">{item.icon}</span>}
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                    <span>Drag to move</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(item._id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal (Without manual Order field) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Expertise Item' : 'Add New Expertise Item'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2.5 text-xs sm:text-sm text-rose-800 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Title / Instrumentation Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. UV-Vis-NIR Spectrophotometer or Femtosecond Laser Setup"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g. Spectroscopy / Microscopy / Synthesis"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Optional Icon */}
                <div>
                  <label
                    htmlFor="icon"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Icon / Symbol (Optional)
                  </label>
                  <input
                    id="icon"
                    name="icon"
                    type="text"
                    placeholder="e.g. 🔬, ⚡, or icon symbol"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Description & Specifications
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Technical specifications, experimental parameters, operational capabilities, or usage notes..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Image Upload with ImageKit */}
              <div>
                <FileUpload
                  label="Apparatus / Facility Image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                  folder="/academic-portfolio/expertise"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  helperText="Upload apparatus or laboratory photo to ImageKit"
                />
              </div>

              {/* Featured / Core Toggle */}
              <div className="pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="featured"
                    className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Mark as Core / Featured Expertise
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Create Item'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/60">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
                Delete Expertise Item?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                This item will be permanently removed from your portfolio and will no longer appear on the live website.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
