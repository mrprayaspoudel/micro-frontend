import axios from 'axios';

// Base API configuration
export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
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

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API service for development
export class MockApiService {
  private static async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async get<T>(endpoint: string): Promise<T> {
    await this.delay();
    
    // Mock data endpoints
    switch (endpoint) {
      case '/companies':
        return import('../../../../backends/companies.json').then(module => module.default) as Promise<T>;
      case '/users':
        return import('../../../../backends/users.json').then(module => module.default) as Promise<T>;
      case '/modules':
        return import('../../../../backends/modules.json').then(module => module.default) as Promise<T>;
      case '/notifications':
        return import('../../../../backends/notifications.json').then(module => module.default) as Promise<T>;
      case '/knowledge-base':
        return import('../../../../backends/knowledge-base.json').then(module => module.default) as Promise<T>;
      default:
        throw new Error(`Mock endpoint ${endpoint} not found`);
    }
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    await this.delay();
    console.log(`Mock POST to ${endpoint}:`, data);
    return { success: true, data } as T;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    await this.delay();
    console.log(`Mock PUT to ${endpoint}:`, data);
    return { success: true, data } as T;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    await this.delay();
    console.log(`Mock DELETE to ${endpoint}`);
    return { success: true } as T;
  }
}
