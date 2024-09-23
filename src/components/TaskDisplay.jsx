/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchSubtasks, fetchTasks } from "../services/Api";
import "../css/TaskDisplay.css";
import AddTaskSidebar from "./AddTaskSidebar";
import { Button } from "./Button";
import dayjs from "dayjs";

const TaskDisplay = ({ listId, listName }) => {
  const [tasks, setTasks] = useState([]);
  const [subtaskCounts, setSubtaskCounts] = useState({});
  const [isAddTaskSidebarOpen, setIsAddTaskSidebarOpen] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setTasks([]); // Clear tasks while loading new data
        const data = await fetchTasks(listId); // Fetch tasks based on listId
        setTasks(data);

        // Fetch subtask counts for each task
        data.forEach(async (task) => {
          const subtasks = await fetchSubtasks(task.id);
          setSubtaskCounts((prev) => ({
            ...prev,
            [task.id]: subtasks.length, // Store subtask count for each task
          }));
        });
      } catch (err) {
        console.error(err.message);
      }
    };

    if (listId) {
      getTasks();
    }
  }, [listId]);

  // Function to refresh tasks
  const refreshTasks = async () => {
    try {
      const data = await fetchTasks(listId);
      setTasks(data);

      // Refresh subtask counts for each task
      data.forEach(async (task) => {
        const subtasks = await fetchSubtasks(task.id);
        setSubtaskCounts((prev) => ({
          ...prev,
          [task.id]: subtasks.length, // Update subtask count
        }));
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  // formatting date to YYYY/MM/DD
  const formatDate = (dateString) => {
    return dayjs(dateString).format("YYYY/MM/DD");
  };

  // Toggle sidebar visibility
  const handleAddTaskClick = () => {
    setIsAddTaskSidebarOpen(!isAddTaskSidebarOpen);
  };

  return (
    <div
      className={`task-display-container ${
        isAddTaskSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <div className="task-content">
        <div className="task-header">
          <h1>{listName}</h1>
          <Button
            text={"Add Task"}
            onClick={handleAddTaskClick}
            icon={"add_circle"}
          ></Button>
        </div>

        <table className="list-table">
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="3">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="main-task-div">
                      <input type="checkbox" className="task-checkbox" />
                      {task.taskName}
                    </div>
                    <div className="task-date-div">
                      Due Date: {task.dueDate ? formatDate(task.dueDate) : ""}
                      {subtaskCounts[task.id] > 0 && (
                        <p>&nbsp;| Subtasks: {subtaskCounts[task.id]}</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Conditionally render AddTaskSidebar */}
      {isAddTaskSidebarOpen && (
        <AddTaskSidebar
          onClose={handleAddTaskClick} // Pass function to close sidebar
          listId={listId} // Pass the listId to the sidebar
          onTaskAdded={refreshTasks} // Pass function to refresh tasks
          className={isAddTaskSidebarOpen ? "open" : ""}
        />
      )}
    </div>
  );
};

export default TaskDisplay;
