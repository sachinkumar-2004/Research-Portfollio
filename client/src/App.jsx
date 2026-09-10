import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Public Layout & Pages
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import PublicationsPage from './pages/PublicationsPage';
import TalksConferencesPage from './pages/TalksConferencesPage';
import AwardsPage from './pages/AwardsPage';
import ExperiencePage from './pages/ExperiencePage';
import GalleryPage from './pages/GalleryPage';
import CvPage from './pages/CvPage';
import ContactPage from './pages/ContactPage';

// Scroll Restoration
import ScrollToTop from './components/common/ScrollToTop';

// Admin Components & Pages
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminResearchPage from './pages/admin/AdminResearchPage';
import AdminPublicationsPage from './pages/admin/AdminPublicationsPage';
import AdminTalksPage from './pages/admin/AdminTalksPage';
import AdminConferencesPage from './pages/admin/AdminConferencesPage';
import AdminAwardsPage from './pages/admin/AdminAwardsPage';
import AdminEducationPage from './pages/admin/AdminEducationPage';
import AdminExperiencePage from './pages/admin/AdminExperiencePage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="research" element={<ResearchPage />} />
              <Route path="publications" element={<PublicationsPage />} />
              <Route path="talks" element={<TalksConferencesPage />} />
              <Route path="conferences" element={<Navigate to="/talks" replace />} />
              <Route path="awards" element={<AwardsPage />} />
              <Route path="experience" element={<ExperiencePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="cv" element={<CvPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="research" element={<AdminResearchPage />} />
              <Route path="publications" element={<AdminPublicationsPage />} />
              <Route path="talks" element={<AdminTalksPage />} />
              <Route path="conferences" element={<AdminConferencesPage />} />
              <Route path="awards" element={<AdminAwardsPage />} />
              <Route path="education" element={<AdminEducationPage />} />
              <Route path="experience" element={<AdminExperiencePage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Global Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
