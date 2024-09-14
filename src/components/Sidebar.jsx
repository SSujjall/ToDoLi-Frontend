import { useEffect, useState } from "react";
import { addList, deleteList, fetchList } from "../services/Api";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import "../css/Sidebar.css";
import InputField from "./InputField";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ onSelectItem }) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getList = async () => {
      try {
        const data = await fetchList();
        setList(data); // Directly set the list data
      } catch (err) {
        setError(err.message);
      }
    };

    getList();
  }, []);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse state
  };

  const handleAddList = async () => {
    if (!newListName) {
      setError("List name cannot be empty");
      return;
    }

    try {
      const data = await addList(newListName);
      setList([...list, data]);
      const refreshList = await fetchList();
      setList(refreshList);
      setNewListName("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteListItem = async (listId) => {
    try {
      await deleteList(listId);
      const updatedList = await fetchList();
      setList(updatedList);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <i
        className="material-symbols-rounded hamburger-icon"
        onClick={handleCollapseToggle}
      >
        {isCollapsed ? "menu_open" : "menu"}
      </i>
      <div className="content">
        {!isCollapsed && (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul className="list-items">
              {list.map((item) => (
                <li key={item.id}>
                  <div
                    className="list-content"
                    onClick={() => onSelectItem(item)}
                  >
                    <span>
                      <i className="material-symbols-rounded">list</i>
                      {item.listName}
                    </span>
                  </div>
                  <Button icon={"delete"} onClick={() => handleDeleteListItem(item.id)} />
                </li>
              ))}
            </ul>
            {/* Add List Input and Button */}
            <div className="add-list-container">
              <InputField
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New List Name"
              />
              <Button icon={"Add"} onClick={handleAddList} />
            </div>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
