const BASE_URL = "http://10.65.101.210/CodeVault/index";
const FILE_BASE = "http://localhost/CodeVault";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.user_id || 0;
  } catch {
    return 0;
  }
};

// ------ AUTH ------

export const loginUser = async (params: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (params: {
  full_name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard_stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId() }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId() }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), project_id: id }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/delete_project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), project_id: id }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId() }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const uploadProject = async (formData: FormData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/upload_project`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getProject = async (project_id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), project_id }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getDownloadUrl = async (
  project_id: number,
  type: "documentation" | "source_code",
) => {
  try {
    const res = await fetch(`${BASE_URL}/api/download_file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), project_id, type }),
    });
    const data = await res.json();

    if (data.status === "success" && data.url) {
      if (!data.url.startsWith("http")) {
        data.url = `${FILE_BASE}/${data.url.replace(/^\//, "")}`;
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId() }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const addUser = async (params: {
  full_name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/add_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), ...params }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (target_id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/delete_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), target_id }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (params: { name: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/add_category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), ...params }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (category_id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/delete_category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), category_id }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/get_profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId() }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (params: {
  full_name: string;
  email: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/update_profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), ...params }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (params: {
  current_password: string;
  new_password: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/change_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: getUserId(), ...params }),
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const uploadProfilePhoto = async (formData: FormData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/upload_profile_photo`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
};
