/* eslint-disable react/prop-types */
import { useState } from "react";
import "../css/AddTaskSidebar.css"; // Create this CSS for styling the sidebar
import { addSubTask, addTask } from "../services/Api"; // Assuming you have an API call for adding tasks
import { Button } from "./Button";

const AddTaskSidebar = ({ onClose, listId, onTaskAdded }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState([]); // State for managing subtasks
  const [newSubTask, setNewSubTask] = useState(""); // Input for new subtask
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  // Function to add a subtask to the subTasks array
  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, newSubTask]);
      setNewSubTask("");
    }
  };

  // Function to save task and subtasks
  const handleSaveTask = async () => {
    try {
      setIsSaving(true); // Indicate saving in progress
  
      // Step 1: Save the task first
      const savedTask = await addTask(taskName, taskDescription, dueDate, listId);
  
      // Ensure that savedTask.id is returned properly.
      if (savedTask && savedTask.id) {
        // Step 2: Save each subtask if there are any, using the saved task's ID
        if (subTasks.length > 0) {
          for (let subTaskName of subTasks) {
            try {
              await addSubTask(subTaskName, savedTask.id); // Pass the task ID
            } catch (err) {
              console.error(`Error saving subtask: ${subTaskName}`, err.message);
            }
          }
        }
  
        onTaskAdded(); // Refresh the task list in the main component
        onClose(); // Close the sidebar after saving
      } else {
        console.error("Task was not saved correctly, no taskId was returned.");
      }
    } catch (err) {
      console.error("Error saving task:", err.message);
    } finally {
      setIsSaving(false); // Reset saving status
    }
  };
  
  return (
    <div className="add-task-sidebar">
      <div className="sidebar-header">
        <h2>Add Task</h2>
        <Button icon={"close"} onClick={onClose}></Button>
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

        {/* Subtask section */}
        <label>Subtasks</label>
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Enter subtask name"
        />
        <button type="button" onClick={handleAddSubTask}>
          Add Subtask
        </button>

        {/* Display added subtasks */}
        <ul>
          {subTasks.map((subTask, index) => (
            <li key={index}>{subTask}</li>
          ))}
        </ul>

        <div className="task-form-actions">
          <button className="save-task-btn" onClick={handleSaveTask} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Task"}
          </button>
          <button className="delete-task-btn" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskSidebar;
