import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Content
  content: {
    getBySection: (section: string) => `/content/${section}`,
    updateSection: (section: string) => `/content/${section}`,
    updateField: (section: string, key: string) => `/content/${section}/${key}`,
  },
  
  // Services
  services: {
    getAll: () => '/services',
    getBySlug: (slug: string) => `/services/detail/${slug}`,
    admin: {
      getAll: () => '/services/admin/all',
      create: () => '/services',
      update: (id: string) => `/services/${id}`,
      delete: (id: string) => `/services/${id}`,
      reorder: () => '/services/admin/reorder',
    },
  },
  
  // Blogs
  blogs: {
    getAll: () => '/blogs',
    getBySlug: (slug: string) => `/blogs/post/${slug}`,
    categories: () => '/blogs/categories/all',
    admin: {
      getAll: () => '/blogs/admin/all',
      create: () => '/blogs',
      update: (id: string) => `/blogs/${id}`,
      delete: (id: string) => `/blogs/${id}`,
      createCategory: () => '/blogs/categories',
    },
  },
  
  // Leads
  leads: {
    submit: () => '/leads',
    newsletter: () => '/leads/newsletter',
    admin: {
      getAll: () => '/leads/admin/all',
      getById: (id: string) => `/leads/admin/${id}`,
      updateStatus: (id: string) => `/leads/admin/${id}/status`,
      delete: (id: string) => `/leads/admin/${id}`,
      stats: () => '/leads/admin/stats',
      export: () => '/leads/admin/export',
      newsletter: () => '/leads/admin/newsletter',
    },
  },
  
  // Upload
  upload: {
    image: () => '/upload/image',
    images: () => '/upload/images',
    deleteImage: () => '/upload/image',
    transform: () => '/upload/transform',
    getImages: () => '/upload/images',
  },
  
  // Auth
  auth: {
    login: () => '/auth/login',
    register: () => '/auth/register',
    verify: () => '/auth/verify',
  },
  
  // Health
  health: () => '/health',
};

export default api;
