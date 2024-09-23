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

  // Function to remove a subtask
  const handleDeleteSubTask = (index) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  // Function to save task and subtasks
  const handleSaveTask = async () => {
    try {
      setIsSaving(true); // Indicate saving in progress

      // Step 1: Save the task first
      const savedTask = await addTask(
        taskName,
        taskDescription,
        dueDate,
        listId
      );

      // Access the taskId from the response
      if (savedTask && savedTask.taskId) {
        // Change here to access taskId

        console.log("Task saved successfully with ID:", savedTask.taskId);

        // Step 2: Save each subtask if there are any, using the saved task's ID
        if (subTasks.length > 0) {
          for (let subTaskName of subTasks) {
            try {
              await addSubTask(subTaskName, savedTask.taskId); // Use taskId here
            } catch (err) {
              console.error(
                `Error saving subtask: ${subTaskName}`,
                err.message
              );
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
        <h2>Task:</h2>
        <Button icon={"close"} onClick={onClose}></Button>
      </div>

      <div className="task-form">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />

        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description"
        />

        <div className="due-date">
          <label>Due Date: </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Subtask section */}
        <h2>Sub-Task: </h2>
        <div className="subtask-container">
          <input
            type="text"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            placeholder="Enter subtask name"
          />
          <Button text={"Add"} onClick={handleAddSubTask}></Button>
        </div>

        {/* Display added subtasks */}
        <div className="subtask-div">
          <ul>
            {subTasks.map((subTask, index) => (
              <li key={index} className="subtask-item">
                <div className="subtask-item-left">
                  <input type="checkbox" className="checkbox" />
                  <span>{subTask}</span>
                </div>

                <Button
                  icon={"delete"}
                  onClick={() => handleDeleteSubTask(index)}
                ></Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="task-form-actions">
          <Button
            className="save-button"
            text={isSaving ? "Saving..." : "Save Changes"}
            onClick={handleSaveTask}
            disabled={isSaving}
          ></Button>

          <Button
            className="cancel-button"
            text={"Cancel"}
            onClick={onClose}
            disabled={isSaving}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskSidebar;
