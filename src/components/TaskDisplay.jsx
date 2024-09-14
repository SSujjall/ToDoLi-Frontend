/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchTasks } from "../services/Api";
import '../css/ListDisplay.css';

const TaskDisplay = ({ listId, listName }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setTasks([]);
        const data = await fetchTasks(listId); // Fetch tasks based on listId
        setTasks(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (listId) {
      getTasks();
    }
  }, [listId]);

  return (
    <div>
      <h1>{listName}</h1>
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="3">No tasks found.</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.taskName}</td>
                <td>{task.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDisplay;