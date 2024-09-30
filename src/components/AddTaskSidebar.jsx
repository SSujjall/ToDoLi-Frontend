/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "../css/AddTaskSidebar.css"; // Create this CSS for styling the sidebar
import {
  addSubTask,
  addTask,
  fetchSubtasks,
  updateTask,
  deleteSubtask,
} from "../services/Api";
import { Button } from "./Button";

const AddTaskSidebar = ({ onClose, listId, onTaskAdded, task }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState([]); // State for managing subtasks
  const [newSubTask, setNewSubTask] = useState(""); // Input for new subtask
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  useEffect(() => {
    if (task) {
      // If a task is provided, populate the fields
      setTaskName(task.taskName);
      setTaskDescription(task.description || ""); // Assuming task has description
      setDueDate(task.dueDate || ""); // Assuming task has dueDate

      // Fetch and load subtasks
      const loadSubtasks = async () => {
        try {
          const subtasksData = await fetchSubtasks(task.id);
          console.log("fetchSubtask run in AddTaskSidebar line 32");
          setSubTasks(
            subtasksData.map((subtask) => ({
              id: subtask.id,
              name: subtask.subTaskName,
            }))
          ); // Set subtask names
        } catch (err) {
          console.error("Error fetching subtasks:", err);
        }
      };

      loadSubtasks();
    } else {
      // Reset fields if no task is selected
      setTaskName("");
      setTaskDescription("");
      setDueDate("");
      setSubTasks([]);
    }
  }, [task]);

  // Function to add a subtask to the subTasks array
  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, { name: newSubTask }]);
      setNewSubTask("");
    }
  };

  // Function to remove a subtask
  const handleDeleteSubTask = async (index) => {
    const subTaskToDelete = subTasks[index];

    // If subTask has an id (i.e., it's saved in the database), call the delete API
    if (subTaskToDelete.id) {
      try {
        await deleteSubtask(subTaskToDelete.id); // Call the deleteSubtask API
        console.log(
          `Subtask with id ${subTaskToDelete.id} deleted successfully`
        );
      } catch (err) {
        console.error(
          `Error deleting subtask with id ${subTaskToDelete.id}:`,
          err.message
        );
        return; // If deletion fails, do not remove it from the UI
      }
    }

    // Remove subtask from UI
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  // Function to save task and subtasks
  const handleSaveTask = async () => {
    try {
      setIsSaving(true); // Indicate saving in progress

      // Check if updating an existing task
      if (task) {
        console.log(task);
        // If task exists, update it
        await updateTask(task.id, taskName, taskDescription, dueDate, false); // Assuming isComplete is false

        // Fetch existing subtasks
        const existingSubtasksData = await fetchSubtasks(task.id);
        console.log("fetchSubtask run in AddTaskSidebar line 99");

        const existingSubtaskNames = existingSubtasksData.map(
          (subtask) => subtask.subTaskName
        );

        // Determine new subtasks to be added
        const newSubTasksToAdd = subTasks.filter(
          (subTask) => !existingSubtaskNames.includes(subTask.name)
        );

        for (let subTask of newSubTasksToAdd) {
          try {
            await addSubTask(subTask.name, task.id); // Use task.id here
          } catch (err) {
            console.error(`Error saving subtask: ${subTask.name}`, err.message);
          }
        }
      } else {
        // If no task exists, create a new one
        const savedTask = await addTask(
          taskName,
          taskDescription,
          dueDate,
          listId
        );

        // Access the taskId from the response
        if (savedTask && savedTask.taskId) {
          console.log("Task saved successfully with ID:", savedTask.taskId);

          // Save each subtask if there are any, using the saved task's ID
          if (subTasks.length > 0) {
            for (let subTask of subTasks) {
              try {
                await addSubTask(subTask.name, savedTask.taskId); // Use taskId here
              } catch (err) {
                console.error(
                  `Error saving subtask: ${subTask.name}`,
                  err.message
                );
              }
            }
          }
        } else {
          console.error(
            "Task was not saved correctly, no taskId was returned."
          );
        }
      }

      onTaskAdded(); // Refresh the task list in the main component
      onClose(); // Close the sidebar after saving
    } catch (err) {
      console.error("Error saving task:", err.message);
    } finally {
      setIsSaving(false); // Reset saving status
    }
  };

  return (
    <div className="add-task-sidebar">
      <div className="sidebar-header">
        <h2 className="text-2xl font-bold">Task:</h2>
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
          <label>Due Date:&nbsp;</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Subtask section */}
        <h2 className="text-2xl font-bold">Sub-Task: </h2>
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
                  <span>{subTask.name}</span>
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
