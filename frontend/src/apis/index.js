import axios from "axios";

// ==========================
// AXIOS INSTANCE
// ==========================
const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// REQUEST INTERCEPTOR
// Automatically attach token
// ==========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// RESPONSE INTERCEPTOR
// Auto logout on token expiry
// ==========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token Expired or Invalid
      localStorage.removeItem("user_token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// ==========================
// AUTH APIS
// ==========================

// LOGIN
export const loginUser = async (payload) => {
  // payload = { email, password }
  return await API.post("/auth/login", payload);
};

// REGISTER
export const registerUser = async (payload) => {
  // payload = { name, email, password, role }
  return await API.post("/auth/register", payload);
};

// ==========================
// ARTICLES APIS  
// (Add / Fetch / Update / Delete)
// ==========================

export const getArticles = async (page=1) => {
  return await API.get(`/articles?page=${page}`);
};

export const getArticleById = async (id) => {
  return await API.get(`/articles/${id}`);
};

export const createArticle = async (data) => {
  return await API.post("/articles", data);
};

export const updateArticle = async (id, data) => {
  return await API.put(`/articles/${id}`, data);
};

export const deleteArticle = async (id) => {
  return await API.delete(`/articles/${id}`);
};


export const getSEO_Intelligence = async (data) => {
  return await API.post(`/seo/intelligence`,data);
}

export const generateTitle = async (data) => {
    // {"topic":"smartwatch"}
  return await API.post(`/ai/title`,data);
}
export const generateOutline = async (data) => {
    // {"topic":"smartwatch"}
  return await API.post(`/ai/outline`,data);
}
export const generateMeta = async (data) => {
    // {"topic":"smartwatch"}
  return await API.post(`/ai/meta`,data);
}
export const generateKeyword = async (data) => {
    // {"topic":"smartwatch"}
  return await API.post(`/ai/keywords`,data);
}
export const generateFullArticle = async (data) => {
    // {"topic":"smartwatch"}
  return await API.post(`/ai/article`,data);
}
export const generatePrompts = async (data) => {
    // {"title":"SEO meta prompt", "template":"Write SEO meta tags for smartwatch"}
  return await API.post(`/ai/prompts`,data);
}
export const getAllPrompts = async () => {
  return await API.get(`/ai/prompts`);
}
// ==========================
// EXPORT DEFAULT API (optional)
// ==========================
export default API;
