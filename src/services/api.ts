import axios from 'axios';
import { config } from '../config/api';

const api = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Public API calls
export const apiService = {
    // Sliders
    getSliders: async () => {
        const response = await api.get('/api/sliders');
        return response.data;
    },

    // Categories
    getCategories: async () => {
        const response = await api.get('/api/categories');
        return response.data;
    },

    getCategoryProducts: async (categoryId: number) => {
        const response = await api.get(`/api/categories/${categoryId}/products`);
        return response.data;
    },

    // About
    getAbout: async () => {
        const response = await api.get('/api/about');
        return response.data;
    },

    // Contact
    getContact: async () => {
        const response = await api.get('/api/contact');
        return response.data;
    },

    // Specializations
    getSpecializations: async () => {
        const response = await api.get('/api/specializations');
        return response.data;
    },

    // Instruments
    getInstruments: async () => {
        const response = await api.get('/api/instruments');
        return response.data;
    },

    // Stats
    getStats: async () => {
        const response = await api.get('/api/stats');
        return response.data;
    },

    // Settings
    getSettings: async () => {
        const response = await api.get('/api/settings');
        return response.data;
    },

    // Quote submission
    submitQuote: async (quoteData: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
        product_interest?: string;
        quantity?: string;
        message?: string;
    }) => {
        const response = await api.post('/api/quotes', quoteData);
        return response.data;
    },
};

export default api;
