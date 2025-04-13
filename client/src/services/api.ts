// client/src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// API base URL (can be overridden by environment variables)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session timeout or unauthorized
    if (error.response && error.response.status === 401) {
      // Optional: Clear local storage and redirect to login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic request method with proper typing
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return the error response from the server
      throw error.response.data;
    }
    throw error;
  }
};

// API methods
export const apiService = {
  // Auth endpoints
  auth: {
    register: (data: { email: string; password: string; confirmPassword: string }) =>
      request({
        method: 'POST',
        url: '/users/register',
        data,
      }),
    
    login: (data: { email: string; password: string }) =>
      request({
        method: 'POST',
        url: '/users/login',
        data,
      }),
    
    getProfile: () =>
      request({
        method: 'GET',
        url: '/users/profile',
      }),
  },
  
  // Face analysis endpoints
  analysis: {
    uploadPhoto: (photoFile: File) => {
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      // Add session ID if available
      const sessionId = localStorage.getItem('sessionId');
      
      return request({
        method: 'POST',
        url: '/analysis/face',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(sessionId ? { 'Session-ID': sessionId } : {}),
        },
      });
    },
    
    // NEW METHOD: Upload photo with client-side analysis data
    uploadPhotoWithAnalysis: (formData: FormData) =>
      request({
        method: 'POST',
        url: '/analysis/face-with-analysis',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(localStorage.getItem('sessionId') ? { 'Session-ID': localStorage.getItem('sessionId') } : {}),
        },
      }),
    
    getAnalysis: (analysisId: string) =>
      request({
        method: 'GET',
        url: `/analysis/${analysisId}`,
      }),
    
    getSharedAnalysis: (shareToken: string) =>
      request({
        method: 'GET',
        url: `/analysis/share/${shareToken}`,
      }),
    
    deleteAnalysis: (analysisId: string) =>
      request({
        method: 'DELETE',
        url: `/analysis/${analysisId}`,
      }),
  },
  
  // Recommendations endpoints
  recommendations: {
    getByAnalysis: (analysisId: string) =>
      request({
        method: 'GET',
        url: `/recommendations/analysis/${analysisId}`,
      }),
    
    getSharedRecommendations: (shareToken: string) =>
      request({
        method: 'GET',
        url: `/recommendations/shared/${shareToken}`,
      }),
    
    saveRecommendation: (recommendationId: string, notes?: string) =>
      request({
        method: 'POST',
        url: `/recommendations/save/${recommendationId}`,
        data: { notes },
      }),
    
    getSavedRecommendations: () =>
      request({
        method: 'GET',
        url: '/recommendations/saved',
      }),
    
    deleteSavedRecommendation: (savedId: string) =>
      request({
        method: 'DELETE',
        url: `/recommendations/saved/${savedId}`,
      }),
    
    getPremiumRecommendations: (analysisId: string) =>
      request({
        method: 'GET',
        url: `/recommendations/premium/analysis/${analysisId}`,
      }),
  },
  
  // Hairstyles endpoints
  styles: {
    getStyles: (params?: {
      faceShape?: string;
      hairType?: string;
      gender?: string;
      lengthCategory?: string;
      maxMaintenance?: number;
      limit?: number;
      offset?: number;
    }) =>
      request({
        method: 'GET',
        url: '/styles',
        params,
      }),
    
    getStyleById: (styleId: string) =>
      request({
        method: 'GET',
        url: `/styles/${styleId}`,
      }),
    
    getStylesByFaceShape: (faceShape: string, params?: { limit?: number; offset?: number }) =>
      request({
        method: 'GET',
        url: `/styles/face-shape/${faceShape}`,
        params,
      }),
    
    filterStyles: (filterOptions: any) =>
      request({
        method: 'POST',
        url: '/styles/filter',
        data: filterOptions,
      }),
  },
  
  // Subscription endpoints
  subscription: {
    createSubscription: (data: {
      planId: string;
      paymentProvider: string;
      paymentReference: string;
      amount: number;
      currency?: string;
      durationMonths?: number;
    }) =>
      request({
        method: 'POST',
        url: '/users/subscription',
        data,
      }),
    
    getSubscription: () =>
      request({
        method: 'GET',
        url: '/users/subscription',
      }),
    
    cancelSubscription: () =>
      request({
        method: 'DELETE',
        url: '/users/subscription',
      }),
  },
};

export default apiService;