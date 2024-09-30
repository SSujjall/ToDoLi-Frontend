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
  const [selectedTask, setSelectedTask] = useState(null); // State to hold selected task data

  useEffect(() => {
    const getTasks = async () => {
      try {
        setTasks([]); // Clear tasks while loading new data
        const data = await fetchTasks(listId); // Fetch tasks based on listId
        setTasks(data);

        // Fetch subtask counts for each task
        data.forEach(async (task) => {
          const subtasks = await fetchSubtasks(task.id);
          // console.log("fetchSubtask run in TaskDisplay line 25");
          setSubtaskCounts((prev) => ({
            ...prev,
            [task.id]: subtasks.length, // Store subtask count for each task
          }));
        });
      } catch (err) {
        console.error("Error fetching tasks or subtasks:", err.message);
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

      const counts = {};
      await Promise.all(
        data.map(async (task) => {
          const subtasks = await fetchSubtasks(task.id);
          counts[task.id] = subtasks.length;
        })
      );

      setSubtaskCounts(counts);
    } catch (err) {
      console.error(err.message);
      setTasks([]); // Ensure tasks is empty if there's an error
    }
  };

  // formatting date to YYYY/MM/DD
  const formatDate = (dateString) => {
    return dayjs(dateString).format("YYYY/MM/DD");
  };

  // Toggle sidebar visibility
  const handleAddTaskClick = () => {
    setIsAddTaskSidebarOpen(!isAddTaskSidebarOpen);
    setSelectedTask(null); // Reset selected task when closing the sidebar
  };

  // Handle task click to open the sidebar with the task details
  const handleTaskClick = async (task) => {
    setSelectedTask(task); // Set the selected task
    setIsAddTaskSidebarOpen(true); // Open the sidebar
  };

  return (
    <div
      className={`task-display-container ${
        isAddTaskSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <div className="task-content">
        <div className="task-header flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-5xl font-bold text-slate-700">{listName}</h1>
            <span className="ml-2 inline-flex items-center text-3xl font-bold justify-center w-11 h-10 text-slate-50 bg-slate-700 rounded-full">
              {tasks.length}
            </span>
          </div>

          <Button
            text={"Add Task"}
            onClick={handleAddTaskClick}
            icon={"add_circle"}
          />
        </div>

        <table className="w-full">
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="3">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} onClick={() => handleTaskClick(task)}>
                  <td className="p-3 border-b rounded border-slate-400 hover:bg-gray-300 hover:bg-opacity-50">
                    <div className="main-task-div">
                      <input type="checkbox" className="task-checkbox" />
                      <span className=" font-semibold text-xl">
                        {task.taskName}
                      </span>
                    </div>
                    <div className="task-date-div">
                      <span className="material-icons mr-1 text-slate-600">
                        calendar_month
                      </span>
                      <span className="font-semibold text-sm my-auto">
                        {task.dueDate ? formatDate(task.dueDate) : ""}
                      </span>
                      {subtaskCounts[task.id] > 0 && (
                        <p>
                          &nbsp;|{" "}
                          <span
                            className="ml-2 inline-flex text-sm items-center 
                          justify-center w-5 h-5 text-white bg-slate-600 rounded"
                          >
                            {subtaskCounts[task.id]}
                          </span>{" "}
                          <span className="font-semibold text-sm my-auto">
                            Subtasks
                          </span>
                        </p>
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
          task={selectedTask} // Pass the selected task data to the sidebar
        />
      )}
    </div>
  );
};

export default TaskDisplay;
