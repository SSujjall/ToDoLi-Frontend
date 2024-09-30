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

/* Lists */
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

/* Tasks */
export const fetchTasks = async (listId) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/GetAll/${listId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to fetch tasks");
  }
  const result = await response.json();
  return result.data; // Adjust according to your API response structure
};

export const getTaskById = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/GetById/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to get task.");
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

export const updateTask = async (
  id,
  taskName,
  description,
  dueDate,
  isComplete
) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/UpdateTask`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
    body: JSON.stringify({ id, taskName, description, dueDate, isComplete }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to update task");
  }

  const result = await response.json();
  return result;
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Tasks/DeleteTask/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to delete task");
  }

  const result = await response.json();
  return result;
};

/* Sub-Task */
export const fetchSubtasks = async (taskId) => {
  const response = await fetch(
    `${API_BASE_URL}/SubTasks/GetAllSubTasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
      },
    }
  );

  // Check if the response is 404 (no subtasks found)
  if (response.status === 404) {
    console.warn(`No subtasks found for task ID ${taskId} when running fetchSubtasks function`);
    return []; // Return an empty array if there are no subtasks
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch subtasks: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const addSubTask = async (subTaskName, taskId) => {
  const response = await fetch(`${API_BASE_URL}/SubTasks/AddSubTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
    },
    body: JSON.stringify({ subTaskName, taskId }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to add subtask");
  }

  const result = await response.json();
  return result;
};

export const deleteSubtask = async (subtaskId) => {
  const response = await fetch(
    `${API_BASE_URL}/SubTasks/DeleteSubTask/${subtaskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
      },
    }
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors[0] || "Failed to delete subtask");
  }
  const result = await response.json();
  return result;
};
