import React, { useEffect, useState } from 'react';
import portfolioService from '../../api/portfolioService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import FileUpload from '../../components/admin/FileUpload';
import {
  User,
  Building,
  MapPin,
  Mail,
  BookOpen,
  GraduationCap,
  Globe,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { LinkedinIcon, ResearchGateIcon } from '../../components/common/Icons';

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    designation: '',
    institution: 'National Institute of Science Education and Research (NISER)',
    department: '',
    location: '',
    shortBio: '',
    biography: '',
    profileImage: '',
    researchInterests: [],
    email: '',
    googleScholarUrl: '',
    researchGateUrl: '',
    linkedinUrl: '',
    niserProfileUrl: '',
    cvUrl: '',
  });

  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await portfolioService.getProfile();
      if (res.data) {
        setFormData({
          name: res.data.name || '',
          title: res.data.title || '',
          designation: res.data.designation || '',
          institution:
            res.data.institution ||
            'National Institute of Science Education and Research (NISER)',
          department: res.data.department || '',
          location: res.data.location || '',
          shortBio: res.data.shortBio || '',
          biography: res.data.biography || '',
          profileImage: res.data.profileImage || '',
          researchInterests: Array.isArray(res.data.researchInterests)
            ? res.data.researchInterests
            : [],
          email: res.data.email || '',
          googleScholarUrl: res.data.googleScholarUrl || '',
          researchGateUrl: res.data.researchGateUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          niserProfileUrl: res.data.niserProfileUrl || '',
          cvUrl: res.data.cvUrl || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setFetchError('Failed to load existing profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Edit Profile | Academic Portfolio CMS';
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveSuccess(false);
  };

  const handleAddInterest = (e) => {
    if (e) e.preventDefault();
    const trimmed = newInterest.trim();
    if (trimmed && !formData.researchInterests.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, trimmed],
      }));
      setNewInterest('');
      setSaveSuccess(false);
    }
  };

  const handleRemoveInterest = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, idx) => idx !== indexToRemove),
    }));
    setSaveSuccess(false);
  };

  const handleKeyDownInterest = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    // Basic frontend validation
    if (!formData.name.trim()) {
      setSaveError('Researcher Full Name is required.');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSaveError('Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const res = await portfolioService.updateProfile(formData);
      if (res.success) {
        setSaveSuccess(true);
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            researchInterests: Array.isArray(res.data.researchInterests)
              ? res.data.researchInterests
              : [],
          }));
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveError(
        err.response?.data?.message || 'Failed to save profile. Please verify your connection.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading researcher profile..." fullPage />;
  }

  if (fetchError) {
    return (
      <ErrorState
        title="Could not load profile"
        message={fetchError}
        onRetry={fetchProfile}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Profile Settings
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Researcher Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your primary bio, academic designations, affiliations, and scholarly links.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile configuration saved successfully and synced with the live website!</span>
        </div>
      )}

      {/* Error Notification */}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-3 text-xs sm:text-sm text-rose-800 dark:text-rose-300 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Identity & Affiliation */}
        <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Basic Information & Affiliation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Academic Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Academic Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Doctoral Researcher / PhD Scholar"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Designation */}
            <div>
              <label
                htmlFor="designation"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Designation / Field
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                placeholder="e.g. PhD Researcher in Physical Sciences"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Institution */}
            <div>
              <label
                htmlFor="institution"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                placeholder="National Institute of Science Education and Research (NISER)"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                School / Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="e.g. School of Physical Sciences"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Campus Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Bhubaneswar, Odisha, India"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Profile Image with ImageKit Upload */}
            <div className="sm:col-span-2 pt-1">
              <FileUpload
                label="Profile Photo"
                value={formData.profileImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
                folder="/academic-portfolio/profile"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                helperText="Upload JPG, PNG, or WEBP portrait photo to ImageKit"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Biography & Summary */}
        <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Biography & Executive Summary
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="shortBio"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Short Bio / Headline Summary
              </label>
              <textarea
                id="shortBio"
                name="shortBio"
                rows={2}
                placeholder="Brief summary appearing in the hero and footer..."
                value={formData.shortBio}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="biography"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Comprehensive Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows={6}
                placeholder="Detailed academic journey, doctoral research pursuits, theoretical background, and collaborative history..."
                value={formData.biography}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Research Focus Tags */}
        <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Research Focus & Interests
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a research topic (e.g. Quantum Information, Nanomaterials, Topology)..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={handleKeyDownInterest}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.researchInterests.length > 0 ? (
                formData.researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs font-medium"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(idx)}
                      aria-label={`Remove ${interest}`}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  No research focus tags added yet. Type a topic and press Add.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Contact & Academic Links */}
        <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Contact & Academic Network Profiles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Academic Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="scholar@niser.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Google Scholar URL */}
            <div>
              <label
                htmlFor="googleScholarUrl"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Google Scholar URL
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="googleScholarUrl"
                  name="googleScholarUrl"
                  type="url"
                  placeholder="https://scholar.google.com/citations?user=..."
                  value={formData.googleScholarUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* ResearchGate URL */}
            <div>
              <label
                htmlFor="researchGateUrl"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                ResearchGate URL
              </label>
              <div className="relative">
                <ResearchGateIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="researchGateUrl"
                  name="researchGateUrl"
                  type="url"
                  placeholder="https://www.researchgate.net/profile/..."
                  value={formData.researchGateUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label
                htmlFor="linkedinUrl"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://www.linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* NISER Profile URL */}
            <div>
              <label
                htmlFor="niserProfileUrl"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                NISER Faculty/Directory URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="niserProfileUrl"
                  name="niserProfileUrl"
                  type="url"
                  placeholder="https://www.niser.ac.in/users/..."
                  value={formData.niserProfileUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* CV (PDF) with ImageKit Upload */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <FileUpload
                label="Curriculum Vitae (CV) Document"
                value={formData.cvUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, cvUrl: url }))}
                folder="/academic-portfolio/cv"
                accept=".pdf,application/pdf"
                helperText="Upload your academic CV in PDF format up to 15MB"
              />
            </div>
          </div>
        </section>

        {/* Floating / Sticky Save Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {saveSuccess
              ? 'All changes saved'
              : 'Remember to save updates before leaving this page'}
          </span>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500/30 text-white text-xs sm:text-sm font-medium shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
