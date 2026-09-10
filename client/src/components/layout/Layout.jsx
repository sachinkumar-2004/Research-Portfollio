import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import portfolioService from '../../api/portfolioService';

export default function Layout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGlobalProfile = async () => {
      try {
        const res = await portfolioService.getProfile();
        if (isMounted && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile in layout:', err);
        if (isMounted) {
          setError('Failed to load profile details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchGlobalProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar profile={profile} loading={loading} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
        <Outlet context={{ profile, profileLoading: loading, profileError: error }} />
      </main>
      <Footer profile={profile} loading={loading} />
    </div>
  );
}
