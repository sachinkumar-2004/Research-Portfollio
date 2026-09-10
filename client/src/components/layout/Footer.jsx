import React from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from '../common/SocialLinks';

export default function Footer({ profile, loading = false }) {
  const currentYear = new Date().getFullYear();
  const name = profile?.name || (loading ? '' : 'Academic Portfolio');
  const institution = profile?.institution || '';

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              {name}
            </h3>
            {profile?.shortBio ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                {profile.shortBio}
              </p>
            ) : profile?.designation ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                {profile.designation} {institution ? `• ${institution}` : ''}
              </p>
            ) : null}
            <div className="pt-2">
              <SocialLinks profile={profile} size="sm" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About & Biography
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Research Areas
                </Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link to="/talks" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Talks & Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Academic
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/experience" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Education & Experience
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Awards & Honors
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Academic Gallery
                </Link>
              </li>
              <li>
                <Link to="/cv" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Curriculum Vitae
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>© {currentYear} {name || 'Academic Portfolio'}. All rights reserved.</p>
          {institution && <p>{institution}</p>}
        </div>
      </div>
    </footer>
  );
}
