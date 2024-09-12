/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchTasks } from "../services/Api";
import '../css/ListDisplay.css';

const ListDisplay = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(listId); // Fetch tasks based on listId
        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (listId) {
      getTasks();
    }
  }, [listId]);

  return (
    <div>
      <h1>Tasks for List {listId}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.taskName}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDisplay;