const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const config = {
    apiBaseUrl: API_BASE_URL,
    endpoints: {
        // Public endpoints
        sliders: `${API_BASE_URL}/api/sliders`,
        categories: `${API_BASE_URL}/api/categories`,
        about: `${API_BASE_URL}/api/about`,
        contact: `${API_BASE_URL}/api/contact`,
        specializations: `${API_BASE_URL}/api/specializations`,
        instruments: `${API_BASE_URL}/api/instruments`,
        stats: `${API_BASE_URL}/api/stats`,
        quotes: `${API_BASE_URL}/api/quotes`,
        settings: `${API_BASE_URL}/api/settings`,

        // Dynamic endpoints
        categoryProducts: (categoryId: number) => `${API_BASE_URL}/api/categories/${categoryId}/products`,

        // Admin endpoints
        adminLogin: `${API_BASE_URL}/api/admin/login`,
        adminProducts: `${API_BASE_URL}/api/admin/products`,
        adminCategories: `${API_BASE_URL}/api/admin/categories`,
        adminSliders: `${API_BASE_URL}/api/admin/sliders`,
        adminAbout: `${API_BASE_URL}/api/admin/cms/about`,
        adminContact: `${API_BASE_URL}/api/admin/cms/contact`,
        adminSpecializations: `${API_BASE_URL}/api/admin/cms/specializations`,
        adminInstruments: `${API_BASE_URL}/api/admin/cms/instruments`,
        adminStats: `${API_BASE_URL}/api/admin/cms/stats`,
        adminQuotes: `${API_BASE_URL}/api/admin/quotes`,
        adminSettings: `${API_BASE_URL}/api/super-admin/settings`, // Super admin only
        adminVerify: `${API_BASE_URL}/api/super-admin/verify`, // Super admin verify
    }
};
