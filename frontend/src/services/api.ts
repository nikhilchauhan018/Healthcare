/**
 * Production-ready API Service for MeridianHealth
 * 
 * Uses environment variable VITE_API_URL for production backend deployment.
 * Defaults to '/api/v1' for same-origin proxy or development.
 */

// Dynamically read the API base from .env
const RAW_API_URL = import.meta.env.VITE_API_URL;

// Normalize base URL to ensure clean v1 prefix without trailing slashes
export const API_BASE_URL: string = (() => {
  if (!RAW_API_URL) {
    return '/api/v1';
  }
  const clean = RAW_API_URL.replace(/\/+$/, '');
  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
})();

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Token storage helpers
const TOKEN_KEY = 'meridian_access_token';
const REFRESH_KEY = 'meridian_refresh_token';
const USER_KEY = 'meridian_user_data';

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredAuth = (tokens: AuthTokens, user?: any): void => {
  try {
    localStorage.setItem(TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.warn('Could not access localStorage for token storage', err);
  }
};

export const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn('Could not clear localStorage', err);
  }
};

export const getStoredUser = (): any | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Core HTTP client with automatic Authorization header injection
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMessage = 'An unexpected error occurred';
      if (typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (typeof data.error === 'object' && data.error !== null) {
        errorMessage = data.error.message || JSON.stringify(data.error);
      } else if (data.detail) {
        errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data.message) {
        errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      } else if (typeof data === 'object' && data !== null) {
        // Collect field error messages (e.g. { email: ["Already registered"], password: [...] })
        const fieldErrors = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : (typeof val === 'object' ? JSON.stringify(val) : val)}`)
          .join('; ');
        if (fieldErrors) errorMessage = fieldErrors;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data: (data.data || data) as T,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network connection failed. Please verify API server connectivity.',
    };
  }
}

export const api = {
  auth: {
    register: async (payload: RegisterPayload) => {
      return request<{ id: string; name: string; email: string }>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    login: async (payload: LoginPayload) => {
      return request<{ user: any; access: string; refresh: string }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    me: async () => {
      return request<any>('/auth/me/', {
        method: 'GET',
      });
    },
  },

  patients: {
    list: async () => request<any[]>('/patients/'),
    create: async (data: any) =>
      request<any>('/patients/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id: string, data: any) =>
      request<any>(`/patients/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: async (id: string) =>
      request<any>(`/patients/${id}/`, {
        method: 'DELETE',
      }),
  },

  doctors: {
    list: async () => request<any[]>('/doctors/'),
    create: async (data: {
      name: string;
      specialization: string;
      email: string;
      phone_number: string;
      years_of_experience: number;
    }) =>
      request<any>('/doctors/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: async (id: string, data: any) =>
      request<any>(`/doctors/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: async (id: string) =>
      request<any>(`/doctors/${id}/`, {
        method: 'DELETE',
      }),
  },

  mappings: {
    list: async () => request<any[]>('/mappings/'),
    assign: async (data: { patient: string; doctor: string; notes?: string }) =>
      request<any>('/mappings/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: async (id: string) =>
      request<any>(`/mappings/${id}/`, {
        method: 'DELETE',
      }),
  },
};
