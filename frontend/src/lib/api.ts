import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Redirect to login based on current path
        const path = window.location.pathname;
        if (path.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else if (path.startsWith("/company")) {
          window.location.href = "/company/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authApi = {
  companyRegister: (data: any) => api.post("/auth/company/register", data),
  companyLogin: (data: any) => api.post("/auth/company/login", data),
  adminLogin: (data: any) => api.post("/auth/admin/login", data),
  getMe: () => api.get("/auth/me"),
};

// ============================================
// COMPANY API
// ============================================
export const companyApi = {
  getProfile: () => api.get("/company/profile"),
  updateProfile: (data: any) => api.put("/company/profile", data),
  getDashboard: () => api.get("/company/dashboard"),
  getNotifications: () => api.get("/company/notifications"),
  markNotificationRead: (id: string) => api.patch(`/company/notifications/${id}/read`),
};

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  create: (data: any) => api.post("/products", data),
  getAll: (params?: any) => api.get("/products", { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  generateCodes: (id: string, count: number) =>
    api.post(`/products/${id}/generate-codes`, { count }),
  getCodes: (id: string) => api.get(`/products/${id}/codes`),
  getAnalytics: () => api.get("/products/analytics"),
};

// ============================================
// VERIFY API (Public)
// ============================================
export const verifyApi = {
  verify: (code: string) => api.get(`/verify/${code}`),
  report: (data: any) => api.post("/verify/report", data),
};

// ============================================
// ADMIN API
// ============================================
export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getCompanies: (params?: any) => api.get("/admin/companies", { params }),
  approveCompany: (id: string) => api.patch(`/admin/companies/${id}/approve`),
  rejectCompany: (id: string, reason: string) =>
    api.patch(`/admin/companies/${id}/reject`, { reason }),
  getProducts: (params?: any) => api.get("/admin/products", { params }),
  verifyProduct: (id: string) => api.patch(`/admin/products/${id}/verify`),
  rejectProduct: (id: string, reason: string) =>
    api.patch(`/admin/products/${id}/reject`, { reason }),
  getReports: (params?: any) => api.get("/admin/reports", { params }),
  updateReportStatus: (id: string, status: string, adminNotes?: string) =>
    api.patch(`/admin/reports/${id}/status`, { status, adminNotes }),
  getFraudAlerts: () => api.get("/admin/fraud-alerts"),
};

export default api;
