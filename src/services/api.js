// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// ======================================================
// GET AUTH TOKEN
// ======================================================

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};


// ======================================================
// COMMON API REQUEST
// ======================================================

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // Only add JSON Content-Type when body
  // is NOT FormData.
  if (
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  // Add JWT token if available
  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      "Invalid response from server."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong."
    );
  }

  return data;
};


// ======================================================
// AUTHENTICATION
// ======================================================

// Admin Login
export const loginAdmin = async (
  email,
  password
) => {
  const data = await apiRequest(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  // Store JWT
  if (data.token) {
    localStorage.setItem(
      "adminToken",
      data.token
    );
  }

  // Store admin information
  if (data.admin) {
    localStorage.setItem(
      "admin",
      JSON.stringify(data.admin)
    );
  }

  return data;
};


// Current logged-in admin
export const getCurrentAdmin =
  async () => {
    return apiRequest("/auth/me");
  };


// Logout
export const logoutAdmin =
  async () => {
    try {
      await apiRequest(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    } finally {
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "admin"
      );
    }
  };


// Change admin password
export const changeAdminPassword =
  async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    return apiRequest(
      "/auth/change-password",
      {
        method: "PATCH",

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      }
    );
  };


// ======================================================
// NEWS
// ======================================================

// Get all news
// Admin endpoint
export const getNews = async (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          value
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return apiRequest(
    `/news${query ? `?${query}` : ""}`
  );
};


// Get published news
// Public endpoint
export const getPublishedNews =
  async (params = {}) => {
    const searchParams =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          searchParams.append(
            key,
            value
          );
        }
      }
    );

    const query =
      searchParams.toString();

    return apiRequest(
      `/news/published${
        query ? `?${query}` : ""
      }`
    );
  };


// Get news by ID
export const getNewsById =
  async (id) => {
    return apiRequest(
      `/news/${id}`
    );
  };


// Get news by slug
export const getNewsBySlug =
  async (slug) => {
    return apiRequest(
      `/news/slug/${encodeURIComponent(
        slug
      )}`
    );
  };


// Get news by category
export const getNewsByCategory =
  async (
    category,
    page = 1,
    limit = 12
  ) => {
    return apiRequest(
      `/news/published?category=${encodeURIComponent(
        category
      )}&page=${page}&limit=${limit}`
    );
  };


// Search published news
export const searchNews = async (
  query,
  page = 1,
  limit = 12
) => {
  return apiRequest(
    `/news/published?search=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );
};


// Get featured news
export const getFeaturedNews =
  async (limit = 5) => {
    return apiRequest(
      `/news/featured?limit=${limit}`
    );
  };


// Get related news
export const getRelatedNews =
  async (id) => {
    return apiRequest(
      `/news/${id}/related`
    );
  };


// Add news
export const addNews = async (
  newsData
) => {
  return apiRequest("/news", {
    method: "POST",

    body: JSON.stringify(
      newsData
    ),
  });
};


// Update news
export const updateNews = async (
  id,
  newsData
) => {
  return apiRequest(
    `/news/${id}`,
    {
      method: "PUT",

      body: JSON.stringify(
        newsData
      ),
    }
  );
};


// Delete news
export const deleteNews = async (
  id
) => {
  return apiRequest(
    `/news/${id}`,
    {
      method: "DELETE",
    }
  );
};


// Publish / Draft
export const toggleNewsStatus =
  async (id) => {
    return apiRequest(
      `/news/${id}/status`,
      {
        method: "PATCH",
      }
    );
  };


// Featured / Normal
export const toggleFeatured =
  async (id) => {
    return apiRequest(
      `/news/${id}/featured`,
      {
        method: "PATCH",
      }
    );
  };


// News statistics
export const getNewsStats =
  async () => {
    return apiRequest(
      "/news/admin/stats"
    );
  };


// ======================================================
// CATEGORIES
// ======================================================

// Get categories
export const getCategories =
  async () => {
    return apiRequest(
      "/categories"
    );
  };


// Add category
export const addCategory =
  async (categoryData) => {
    return apiRequest(
      "/categories",
      {
        method: "POST",

        body: JSON.stringify(
          categoryData
        ),
      }
    );
  };


// Update category
export const updateCategory =
  async (
    id,
    categoryData
  ) => {
    return apiRequest(
      `/categories/${id}`,
      {
        method: "PUT",

        body: JSON.stringify(
          categoryData
        ),
      }
    );
  };


// Delete category
export const deleteCategory =
  async (id) => {
    return apiRequest(
      `/categories/${id}`,
      {
        method: "DELETE",
      }
    );
  };


// ======================================================
// MEDIA / CLOUDINARY
// ======================================================

// Upload image/video
export const uploadMedia =
  async (formData) => {
    const token = getToken();

    const headers = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/media/upload`,
      {
        method: "POST",

        headers,

        body: formData,
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Invalid media upload response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Media upload failed."
      );
    }

    return data;
  };


// Get all media
export const getMedia =
  async () => {
    return apiRequest("/media");
  };


// Get images
export const getImages =
  async () => {
    return apiRequest(
      "/media/type/image"
    );
  };


// Get videos from media
export const getVideoMedia =
  async () => {
    return apiRequest(
      "/media/type/video"
    );
  };


// Get single media
export const getMediaById =
  async (id) => {
    return apiRequest(
      `/media/${id}`
    );
  };


// Update media title
export const updateMedia =
  async (
    id,
    title
  ) => {
    return apiRequest(
      `/media/${id}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          title,
        }),
      }
    );
  };


// Delete media
export const deleteMedia =
  async (id) => {
    return apiRequest(
      `/media/${id}`,
      {
        method: "DELETE",
      }
    );
  };


// ======================================================
// MONTHLY PAPER
// ======================================================

// Get all monthly papers
export const getMonthlyPapers =
  async (params = {}) => {
    const searchParams =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          searchParams.append(
            key,
            value
          );
        }
      }
    );

    const query =
      searchParams.toString();

    return apiRequest(
      `/monthly-papers${
        query ? `?${query}` : ""
      }`
    );
  };


// Get published monthly papers
// Public website
export const getPublishedMonthlyPapers =
  async (params = {}) => {
    const searchParams =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          searchParams.append(
            key,
            value
          );
        }
      }
    );

    const query =
      searchParams.toString();

    return apiRequest(
      `/monthly-papers/published${
        query ? `?${query}` : ""
      }`
    );
  };


// Get latest monthly paper
export const getLatestMonthlyPaper =
  async () => {
    return apiRequest(
      "/monthly-papers/latest"
    );
  };


// Get monthly paper by ID
export const getMonthlyPaperById =
  async (id) => {
    return apiRequest(
      `/monthly-papers/${id}`
    );
  };


// Upload / create monthly paper
//
// Expected FormData fields:
//
// title
// month
// year
// description
// status
// pdf
// coverImage
//
export const addMonthlyPaper =
  async (formData) => {
    const token = getToken();

    const headers = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/monthly-papers`,
      {
        method: "POST",

        headers,

        body: formData,
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Invalid monthly paper upload response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Monthly paper upload failed."
      );
    }

    return data;
  };


// Update monthly paper
//
// For PDF/cover image replacement,
// send FormData.
//
export const updateMonthlyPaper =
  async (
    id,
    formData
  ) => {
    const token = getToken();

    const headers = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/monthly-papers/${id}`,
      {
        method: "PUT",

        headers,

        body:
          formData instanceof FormData
            ? formData
            : JSON.stringify(
                formData
              ),
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Invalid monthly paper update response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Monthly paper update failed."
      );
    }

    return data;
  };


// Delete monthly paper
export const deleteMonthlyPaper =
  async (id) => {
    return apiRequest(
      `/monthly-papers/${id}`,
      {
        method: "DELETE",
      }
    );
  };


// Publish / Draft monthly paper
export const toggleMonthlyPaperStatus =
  async (id) => {
    return apiRequest(
      `/monthly-papers/${id}/status`,
      {
        method: "PATCH",
      }
    );
  };


// ======================================================
// CONTACT
// ======================================================

// Public contact form
export const sendContactMessage =
  async (messageData) => {
    return apiRequest(
      "/contact",
      {
        method: "POST",

        body: JSON.stringify(
          messageData
        ),
      }
    );
  };


// Admin contact messages
export const getContactMessages =
  async (params = {}) => {
    const searchParams =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          searchParams.append(
            key,
            value
          );
        }
      }
    );

    const query =
      searchParams.toString();

    return apiRequest(
      `/contact${
        query ? `?${query}` : ""
      }`
    );
  };


// Contact message statistics
export const getContactStats =
  async () => {
    return apiRequest(
      "/contact/stats"
    );
  };


// Single contact message
export const getContactMessageById =
  async (id) => {
    return apiRequest(
      `/contact/${id}`
    );
  };


// Update contact status
export const updateContactStatus =
  async (
    id,
    status
  ) => {
    return apiRequest(
      `/contact/${id}/status`,
      {
        method: "PATCH",

        body: JSON.stringify({
          status,
        }),
      }
    );
  };


// Update admin notes
export const updateContactNotes =
  async (
    id,
    adminNotes
  ) => {
    return apiRequest(
      `/contact/${id}/notes`,
      {
        method: "PATCH",

        body: JSON.stringify({
          adminNotes,
        }),
      }
    );
  };


// Delete contact message
export const deleteContactMessage =
  async (id) => {
    return apiRequest(
      `/contact/${id}`,
      {
        method: "DELETE",
      }
    );
  };


// ======================================================
// DASHBOARD
// ======================================================

// Complete dashboard
export const getDashboard =
  async () => {
    return apiRequest(
      "/dashboard"
    );
  };


// Dashboard statistics
export const getDashboardStats =
  async () => {
    return apiRequest(
      "/dashboard/stats"
    );
  };


// Recent dashboard news
export const getRecentNews =
  async (limit = 5) => {
    return apiRequest(
      `/dashboard/recent-news?limit=${limit}`
    );
  };


// Recent contact messages
export const getRecentMessages =
  async (limit = 5) => {
    return apiRequest(
      `/dashboard/recent-messages?limit=${limit}`
    );
  };


// Recent media
export const getRecentMedia =
  async (limit = 5) => {
    return apiRequest(
      `/dashboard/recent-media?limit=${limit}`
    );
  };


// Recent videos
export const getRecentVideos =
  async (limit = 5) => {
    return apiRequest(
      `/dashboard/recent-videos?limit=${limit}`
    );
  };


// ======================================================
// USERS
// ======================================================

// Get users
export const getUsers =
  async (params = {}) => {
    const searchParams =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          searchParams.append(
            key,
            value
          );
        }
      }
    );

    const query =
      searchParams.toString();

    return apiRequest(
      `/users${
        query ? `?${query}` : ""
      }`
    );
  };


// Update user status
export const updateUserStatus =
  async (
    id,
    status
  ) => {
    return apiRequest(
      `/users/${id}/status`,
      {
        method: "PATCH",

        body: JSON.stringify({
          status,
        }),
      }
    );
  };


// Delete user
export const deleteUser =
  async (id) => {
    return apiRequest(
      `/users/${id}`,
      {
        method: "DELETE",
      }
    );
  };


// ======================================================
// SETTINGS
// ======================================================

// Get settings
export const getSettings =
  async () => {
    return apiRequest(
      "/settings"
    );
  };


// Update settings
export const updateSettings =
  async (settings) => {
    return apiRequest(
      "/settings",
      {
        method: "PUT",

        body: JSON.stringify(
          settings
        ),
      }
    );
  };


// ======================================================
// GENERIC TOKEN CHECK
// ======================================================

export const isAuthenticated =
  () => {
    return Boolean(
      getToken()
    );
  };


// ======================================================
// EXPORT API URL
// ======================================================

export { API_URL };