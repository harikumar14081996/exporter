import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GetQuotePage from './pages/GetQuotePage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import SliderManagementPage from './pages/admin/SliderManagementPage';
import CMSPage from './pages/admin/CMSPage';
import QuoteRequestsPage from './pages/admin/QuoteRequestsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import DeveloperPage from './pages/DeveloperPage';
import './App.css';

// Helper to darken color for gradients
const darkenColor = (hex: string, percent: number) => {
  let num = parseInt(hex.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    B = ((num >> 8) & 0x00FF) - amt,
    G = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

// Layout wrapper for public pages to include Navbar and Footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app">
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

function App() {
  // Apply theme settings
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const settings = await apiService.getSettings();
        if (settings) {
          // Set Website Name
          if (settings.website_name) {
            document.title = settings.website_name;
          }

          // Set Theme Color
          if (settings.theme_color) {
            const root = document.documentElement;
            root.style.setProperty('--primary', settings.theme_color);
            // Auto-generate dark variant for gradients
            root.style.setProperty('--primary-dark', darkenColor(settings.theme_color, 20));
          }
        }
      } catch (error) {
        console.error('Failed to apply theme settings:', error);
      }
    };

    applyTheme();

    // Increment visitor count
    const recordVisit = async () => {
      try {
        // Use same URL logic as config/api.ts - relative path in production
        const envApiUrl = import.meta.env.VITE_API_URL;
        const API_URL = (envApiUrl && envApiUrl.trim().startsWith('http'))
          ? envApiUrl
          : (import.meta.env.PROD ? '' : 'http://localhost:3001');
        await fetch(`${API_URL}/api/visit`, { method: 'POST' });
      } catch (e) {
        console.error('Failed to record visit');
      }
    };
    recordVisit();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/get-quote" element={<PublicLayout><GetQuotePage /></PublicLayout>} />
        <Route path="/category/:categoryId" element={<PublicLayout><CategoryProductsPage /></PublicLayout>} />
        <Route path="/product/:slug" element={<PublicLayout><ProductDetailsPage /></PublicLayout>} />
        <Route path="/developer" element={<PublicLayout><DeveloperPage /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="sliders" element={<SliderManagementPage />} />
          <Route path="cms" element={<CMSPage />} />
          <Route path="quotes" element={<QuoteRequestsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* More admin routes will be added here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
