const API_BASE_URL = "https://localhost:7077/api";

export const loginUser = async (userName, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });

    const result = await response.json();

    if (response.ok) {
      return result.data; // Return token and other data on success
    } else {
      throw new Error(result.errors[0] || "Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const registerUser = async (
  userName,
  firstName,
  lastName,
  email,
  password
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, firstName, lastName, email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      return result.data; // Return success message on success
    } else {
      throw new Error(result.errors[0] || "Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const fetchList = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/List/GetAllList`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  if (response.status === 400) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Failed to fetch list");
  }

  const result = await response.json();
  return result.data; // Return the data array
};

export const fetchTasks = async (listId) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/GetAll/${listId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data; // Adjust according to your API response structure
};

export const addList = async (listName) => {
  const response = await fetch(`${API_BASE_URL}/List/AddList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
    body: JSON.stringify({ listName }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to add list");
  }

  const result = await response.json();
  return result;
};

export const deleteList = async (listId) => {
  const response = await fetch(`${API_BASE_URL}/List/DeleteList/${listId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to delete list");
  }

  const result = await response.json();
  return result;
};

export const addTask = async (taskName, description, dueDate, listId) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/AddTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
    body: JSON.stringify({ taskName, description, dueDate, listId }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to add task");
  }

  const result = await response.json();
  return result;
};