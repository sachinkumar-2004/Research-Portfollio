import React, { useEffect, useState, useMemo } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import FileUpload from '../../components/admin/FileUpload';
import {
  Image as ImageIcon,
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
  Calendar,
  Tag,
  Eye,
  ImageOff
} from 'lucide-react';

const GALLERY_CATEGORIES = [
  'Research',
  'Conference',
  'Laboratory',
  'Academic',
  'Other'
];

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
    category: 'Academic',
    date: new Date().toISOString().split('T')[0],
    featured: false,
  });

  const [previewError, setPreviewError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchGallery = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getGallery();
      if (res.data) {
        setGalleryItems(res.data);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setFetchError('Unable to load gallery records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Gallery Management | Academic Portfolio CMS';
    fetchGallery();
  }, []);

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      const searchableText = `${item.title || ''} ${item.description || ''} ${
        item.category || ''
      }`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() || searchableText.includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        filterCategory === 'all' || item.category === filterCategory;
      const matchesFeatured =
        filterFeatured === 'all'
          ? true
          : filterFeatured === 'featured'
          ? Boolean(item.featured)
          : !item.featured;

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [galleryItems, searchQuery, filterCategory, filterFeatured]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterFeatured('all');
  };

  // Open modal for adding a new image
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      imageUrl: '',
      description: '',
      category: 'Academic',
      date: new Date().toISOString().split('T')[0],
      featured: false,
    });
    setPreviewError(false);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing image
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      description: item.description || '',
      category: item.category || 'Academic',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      featured: Boolean(item.featured),
    });
    setPreviewError(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setPreviewError(false);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Image Title is required.');
      return;
    }
    if (!formData.imageUrl.trim()) {
      setFormError('Image URL is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await portfolioService.updateGallery(editingItem._id, formData);
        setAlertMessage({
          type: 'success',
          text: `Gallery photo "${formData.title}" updated successfully.`,
        });
      } else {
        await portfolioService.createGallery(formData);
        setAlertMessage({
          type: 'success',
          text: `Gallery photo "${formData.title}" created successfully.`,
        });
      }

      closeModal();
      await fetchGallery();
    } catch (err) {
      console.error('Error saving gallery item:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save gallery entry. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const promptDelete = (item) => {
    setDeletingId(item._id);
    setDeletingItem(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await portfolioService.deleteGallery(deletingId);
      setAlertMessage({
        type: 'success',
        text: 'Gallery photo deleted successfully.',
      });
      setDeletingId(null);
      setDeletingItem(null);
      await fetchGallery();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete gallery item.',
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
            Gallery & Visual Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage photographs from laboratory investigations, campus events, and academic conferences.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            href="/gallery"
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
            <span>Add Image</span>
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
            placeholder="Search by image title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Categories</option>
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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

          {(searchQuery || filterCategory !== 'all' || filterFeatured !== 'all') && (
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
        <LoadingState message="Loading gallery items..." fullPage />
      ) : fetchError ? (
        <ErrorState
          title="Could not load gallery"
          message={fetchError}
          onRetry={fetchGallery}
        />
      ) : galleryItems.length === 0 ? (
        <EmptyState
          title="No images cataloged yet"
          description="Click 'Add Image' above to upload or link your first research photo."
          icon={ImageIcon}
          actionText="Add Image"
          actionHref="#"
        />
      ) : filteredGallery.length === 0 ? (
        <EmptyState
          title="No matching gallery items found"
          description="Try adjusting your search criteria or resetting filters."
          icon={Search}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing {filteredGallery.length} of {galleryItems.length} image
              {galleryItems.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGallery.map((item) => {
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
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  {/* Image Thumbnail with Fallback */}
                  <div className="relative aspect-16/10 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-placeholder');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Fallback placeholder */}
                    <div className="fallback-placeholder hidden absolute inset-0 flex flex-col items-center justify-center p-4 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800">
                      <ImageOff className="w-8 h-8 mb-1" />
                      <span className="text-[11px] font-medium text-center">Image preview unavailable</span>
                    </div>

                    {/* Category badge over image */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/70 text-white backdrop-blur-xs">
                        {item.category || 'Academic'}
                      </span>
                      {item.featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      {formattedDate && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formattedDate}
                        </span>
                      )}
                      <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-slate-100 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Full Size</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="Edit image"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => promptDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Gallery Photo' : 'Add New Photo / Figure'}
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
                  htmlFor="gallery-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Photo / Figure Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="gallery-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Cryogenic Spectroscopy Setup at NISER"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Image with ImageKit Upload */}
              <FileUpload
                label="Gallery Photo / Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                folder="/academic-portfolio/gallery"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                helperText="Upload JPG, PNG, or WEBP image to ImageKit"
                required
              />

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gallery-cat"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Category
                  </label>
                  <select
                    id="gallery-cat"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gallery-date"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Date
                  </label>
                  <input
                    id="gallery-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="gallery-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Caption / Description
                </label>
                <textarea
                  id="gallery-desc"
                  name="description"
                  rows={3}
                  placeholder="Context, attendees, laboratory details, or conference session..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-serif"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="gallery-featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="gallery-featured"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Feature this photograph in portfolio highlights
                </label>
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
                    <span>{editingItem ? 'Save Changes' : 'Create Entry'}</span>
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
                Are you sure you want to delete the gallery photo{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  "{deletingItem?.title}"
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
                  <span>Delete Photo</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
