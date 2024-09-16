/* eslint-disable react/prop-types */
import { useState } from "react";
import "../css/AddTaskSidebar.css"; // Create this CSS for styling the sidebar
import { addTask } from "../services/Api"; // Assuming you have an API call for adding tasks

const AddTaskSidebar = ({ onClose, listId, onTaskAdded }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSaveTask = async () => {
    try {
      await addTask(taskName, taskDescription, dueDate, listId);
      onTaskAdded();
      onClose(); // Close sidebar after saving
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="add-task-sidebar">
      <div className="sidebar-header">
        <h2>Add Task</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="task-form">
        <label>Task Name</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />

        <label>Task Description</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description"
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="task-form-actions">
          <button className="save-task-btn" onClick={handleSaveTask}>
            Save Task
          </button>
          <button className="delete-task-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskSidebar;
