export interface Service {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  icon?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    blogs: number;
  };
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  categoryId?: string;
  category?: BlogCategory;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  [key: string]: {
    value: string;
    type: 'text' | 'image' | 'html';
    updatedAt: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  closedLeads: number;
  newsletterSubscribers: number;
  recentLeads: number;
  leadsBySource: Array<{
    source: string;
    _count: {
      source: number;
    };
  }>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface Script {
  id: string;
  code: string;
  locations: ('head' | 'footer')[];
  enabled: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptFormData {
  code: string;
  locations: ('head' | 'footer')[];
  enabled: boolean;
  title?: string;
}

export interface ScriptResponse {
  message: string;
  script: Script;
}

export interface ScriptsListResponse {
  items: Script[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
