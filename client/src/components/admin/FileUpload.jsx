import React, { useState, useRef } from 'react';
import portfolioService from '../../api/portfolioService';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  Link2
} from 'lucide-react';

export default function FileUpload({
  label = 'Upload File',
  value = '',
  onChange,
  accept = 'image/*',
  folder = '/academic-portfolio/general',
  helperText = 'Supports JPG, PNG, WEBP, or PDF up to 15MB',
  required = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef(null);

  const isPdf = value && (value.endsWith('.pdf') || value.includes('pdf'));
  const isImage = value && !isPdf;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error & clear file input value so same file can be reselected if needed
    setError('');

    // Check size limit client-side (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('File is too large. Maximum allowed size is 15MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const res = await portfolioService.uploadFile(file, folder);
      if (res.success && res.data?.url) {
        onChange(res.data.url);
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to upload file to ImageKit. Please check server credentials or try again.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showManualUrl ? 'Switch to Upload' : 'Enter Direct URL'}</span>
        </button>
      </div>

      {/* Manual URL input toggle */}
      {showManualUrl ? (
        <div className="space-y-1.5">
          <input
            type="url"
            placeholder="https://ik.imagekit.io/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Paste a direct ImageKit or external HTTPS URL.
          </p>
        </div>
      ) : (
        /* Upload UI */
        <div className="space-y-2">
          {value ? (
            /* Uploaded Preview State */
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {isPdf ? (
                  <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 shrink-0">
                    <img
                      src={value}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>File uploaded</span>
                  </div>
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 truncate block max-w-xs sm:max-w-md font-mono"
                    title={value}
                  >
                    {value}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Open file"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload drop/select box */
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                uploading
                  ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 cursor-wait'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-950 hover:bg-blue-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />

              {uploading ? (
                <>
                  <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Uploading file to ImageKit...
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Please wait while the media is processed
                  </span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                      Click to select a file
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400"> or drag & drop</span>
                  </div>
                  {helperText && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {helperText}
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
