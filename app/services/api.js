import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/accounts/";
const API_BASE_URL_PAYMENT =
  "https://api.sunshine-meri-luke-village.com/api/v1/payments";
const GUESTS_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/guests";
const INCIDENTS_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/incidents";
const SERVICES_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/services";
const GROUPS_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/groups";
const ANNOUNCEMENTS_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/announcement/";
const POLLS_API_BASE_URL = 
  "https://api.sunshine-meri-luke-village.com/api/v1/announcement/polls/";
const PAYMENTS_API_BASE_URL =
  "https://api.sunshine-meri-luke-village.com/api/v1/payments/";

const api = axios.create({
  baseURL: API_BASE_URL,
});
const apipayment = axios.create({
  baseURL: API_BASE_URL_PAYMENT,
});
const guestsApi = axios.create({
  baseURL: GUESTS_API_BASE_URL,
});

const incidentsApi = axios.create({
  baseURL: INCIDENTS_API_BASE_URL,
});

const servicesApi = axios.create({
  baseURL: SERVICES_API_BASE_URL,
});

const groupsApi = axios.create({
  baseURL: GROUPS_API_BASE_URL,
});

const announcementsApi = axios.create({
  baseURL: ANNOUNCEMENTS_API_BASE_URL,
});

const pollsApi = axios.create({
  baseURL: POLLS_API_BASE_URL,
});

const paymentsApi = axios.create({
  baseURL: PAYMENTS_API_BASE_URL,
});

// Helper functions for token storage
const getItemAsync = async (key) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const setItemAsync = async (key, value) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const deleteItemAsync = async (key) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

// Helper function to get the access token
const getAccessToken = async () => {
  return await getItemAsync("accessToken");
};

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Only add Authorization header if not calling /refresh/
    if (!config.url.endsWith("/refresh/")) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `JWT ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add the same interceptor to guestsApi
guestsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to incidentsApi
incidentsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to servicesApi
servicesApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to groupsApi
groupsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to announcementsApi
announcementsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to pollsApi
pollsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptors to paymentsApi
paymentsApi.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = await getItemAsync("refreshToken");
    if (!refreshToken) {
      await handleAuthFailure();
      throw new Error("No refresh token available");
    }

    const response = await api.post("/refresh/", {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    await setItemAsync("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Helper function to handle authentication failure
const handleAuthFailure = async () => {
  // Clear all auth data
  await deleteItemAsync("accessToken");
  await deleteItemAsync("refreshToken");
  // Navigate to login page using Expo Router
  router.navigate("/(auth)/login");
};

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

guestsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

incidentsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

servicesApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

groupsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

announcementsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

pollsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleAuthFailure();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

paymentsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `JWT ${newAccessToken}`;
        return paymentsApi(originalRequest);
      } catch (refreshError) {
        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Forgot Password APIs
const forgotPasswordRequest = async (phoneNumber) => {
  try {
    const response = await api.post("/forgot-password/request/", {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyForgotPasswordOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post("/forgot-password/verify/", {
      phone_number: phoneNumber,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (phoneNumber, newPassword) => {
  try {
    const response = await api.post("/forgot-password/reset/", {
      phone_number: phoneNumber,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post("/change_password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async (refreshToken) => {
  try {
    const response = await api.post("/logout/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add the getAnnouncements function
export const getAnnouncements = async () => {
  try {
    const response = await announcementsApi.get("self");
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

// Fetch payments for the current user using paymentsApi
export const getPayments = async () => {
  try {
    const response = await paymentsApi.get("self");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export {
  announcementsApi, api, changePassword, deleteItemAsync,
  forgotPasswordRequest, getItemAsync, groupsApi, guestsApi,
  incidentsApi, logout, paymentsApi, pollsApi, resetPassword, servicesApi, setItemAsync, verifyForgotPasswordOTP
};
