/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "../css/AddTaskSidebar.css"; // Create this CSS for styling the sidebar
import {
  addSubTask,
  addTask,
  fetchSubtasks,
  updateTask,
  deleteSubtask,
  deleteTask
} from "../services/Api";
import { Button } from "./Button";
import ConfirmationModal from "./ConfirmationModal";

const AddTaskSidebar = ({ onClose, listId, onTaskAdded, task }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState([]); // State for managing subtasks
  const [newSubTask, setNewSubTask] = useState(""); // Input for new subtask
  const [isSaving, setIsSaving] = useState(false); // State to track saving status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subTaskToDelete, setSubTaskToDelete] = useState(null); // State for subtask deletion
  
  useEffect(() => {
    if (task) {
      // If a task is provided, populate the fields
      setTaskName(task.taskName);
      setTaskDescription(task.description || ""); // Assuming task has description
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");

      // Fetch and load subtasks
      const loadSubtasks = async () => {
        try {
          const subtasksData = await fetchSubtasks(task.id);
          // console.log("fetchSubtask run in AddTaskSidebar line 32");
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
  const handleDeleteSubTask = (index) => {
    setSubTaskToDelete(subTasks[index]); // Set the subtask to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Function to confirm subtask deletion
  const confirmDeleteSubTask = async () => {
    if (subTaskToDelete) {
      const index = subTasks.findIndex(sub => sub.id === subTaskToDelete.id);
      
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
      setSubTaskToDelete(null); // Reset subTaskToDelete
    }
    setIsModalOpen(false); // Close the modal after the action
  };

  // Function to save task and subtasks
  const handleSaveTask = async () => {
    try {
      setIsSaving(true); // Indicate saving in progress

      // Check if updating an existing task
      if (task) {
        // console.log(task);
        // If task exists, update it
        await updateTask(task.id, taskName, taskDescription, dueDate, false); // Assuming isComplete is false

        // Fetch existing subtasks
        const existingSubtasksData = await fetchSubtasks(task.id);
        // console.log("fetchSubtask run in AddTaskSidebar line 99");

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

  // Function to handle task deletion
  const handleDeleteTask = () => {
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Function to confirm task deletion
  const confirmDeleteTask = async () => {
    if (task) {
      try {
        await deleteTask(task.id);
        onTaskAdded(); // Refresh tasks after deletion
      } catch (err) {
        console.error(`Error deleting task:`, err.message);
      }
    }
    onClose();
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

          {task ? (
            <Button
              className="delete-button"
              text={"Delete"}
              onClick={handleDeleteTask}
              disabled={isSaving}
            ></Button>
          ) : (
            <Button
              className="cancel-button"
              text={"Cancel"}
              onClick={onClose}
              disabled={isSaving}
            ></Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteTask} // Confirm deletion action
        message={"Are you sure you want to delete this task?"} // Modal message
      />

      {/* Confirmation Modal for Subtask Deletion */}
      <ConfirmationModal
        isOpen={isModalOpen && !!subTaskToDelete}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteSubTask} // Confirm deletion action for subtask
        message={`Are you sure you want to delete the subtask "${subTaskToDelete?.name}"?`} // Modal message
      />
    </div>
  );
};

export default AddTaskSidebar;
