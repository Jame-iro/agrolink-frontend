import axios from "axios";
import { telegramService } from "./telegram";

const API_BASE_URL = "http://localhost:6969/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add Telegram init data to requests when available
api.interceptors.request.use((config) => {
  const initData = telegramService.getInitData();
  if (initData) {
    config.headers["Telegram-Init-Data"] = initData;
  }
  return config;
});

// Authentication API
export const authAPI = {
  // Validate Telegram user and get JWT token
  validateTelegram: (initData) => api.post("/auth/telegram", { initData }),

  // Update user role
  updateRole: (telegramId, role) => api.put("/auth/role", { telegramId, role }),
};

// ... rest of your existing API exports ...
export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
};

export const ordersAPI = {
  create: (order) => api.post("/orders", order),
  getByConsumer: (consumerId) => api.get(`/orders/consumer/${consumerId}`),
  getByFarmer: (farmerId) => api.get(`/orders/farmer/${farmerId}`),
  updateStatus: (orderId, status) =>
    api.patch(`/orders/${orderId}/status`, { status }),
};

export default api;
