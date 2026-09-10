import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import portfolioService from '../api/portfolioService';
import { Image as ImageIcon, X, Calendar, Tag } from 'lucide-react';

export default function GalleryPage() {
  const { profile } = useOutletContext() || {};
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = ['All', 'Research', 'Conference', 'Laboratory', 'Academic', 'Other'];

  useEffect(() => {
    document.title = profile?.name
      ? `Academic & Research Gallery | ${profile.name}`
      : 'Academic & Research Gallery | Academic Portfolio';

    const fetchGallery = async () => {
      try {
        const res = await portfolioService.getGallery();
        if (res.data) {
          setGalleryItems(res.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [galleryItems, selectedCategory]);

  return (
    <div className="space-y-10">
      <SectionHeading
        badge="Visual Archive"
        title="Research & Conference Gallery"
        subtitle="Photographs and visual records from laboratory investigations, field research, and academic conferences."
      />

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white dark:bg-blue-600'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <LoadingState message="Loading gallery items..." />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.category || 'Academic'}
                  </span>
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold font-serif text-slate-900 dark:text-slate-100 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No images in this category yet"
          description="Photographs from scientific conferences, lab experiments, and campus events will be displayed here."
          icon={ImageIcon}
        />
      )}

      {/* Image Modal Lightbox */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                <span>{activeImage.category}</span>
                {activeImage.date && (
                  <span className="text-slate-400">
                    • {new Date(activeImage.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                {activeImage.title}
              </h3>
              {activeImage.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
