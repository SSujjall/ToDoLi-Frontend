import { useEffect, useState } from "react";
import { addList, deleteList, fetchList } from "../services/Api";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { Card } from "./Card";
import "../css/Card.css";
import "../css/Sidebar.css";
import InputField from "./InputField";
import ConfirmationModal from "./DeleteModal";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ onSelectItem }) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedListId, setSelectedListId] = useState(null); // Store selected list for deletion
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getList = async () => {
      try {
        const data = await fetchList();
        setList(data); // Directly set the list data
        setError(null);
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
      setList((prevList) => prevList.filter((item) => item.id !== listId));
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const openModal = (listId) => {
    setSelectedListId(listId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedListId) {
      handleDeleteListItem(selectedListId);
    }
    closeModal(); // Close the modal after confirming
  };

  const calculateTotalLists = () => {
    return list.length;
  };

  const calculateTodayLists = () => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return list.filter((item) => new Date(item.createdAt) >= startOfDay).length;
  };

  const handleCardClick = (filterType) => {
    setFilter(filterType);
  };

  const getFilteredLists = () => {
    if (filter === "today") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      return list.filter((item) => new Date(item.createdAt) >= startOfDay);
    }
    return list; // "all" filter shows all lists
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
            <div className="cards-container">
              <Card
                icon={"today"}
                title={"Today"}
                value={calculateTodayLists()}
                onClick={() => handleCardClick("today")}
              />
              <Card
                icon={"calendar_month"}
                title={"Total"}
                value={calculateTotalLists()}
                onClick={() => handleCardClick("all")}
              />
            </div>

            <h1> My Lists </h1>

            {/* List Items */}
            {getFilteredLists().length === 0 ? (
              <div className="empty-list">
                <p>No lists available</p>
              </div> // Show a message if the list is empty
            ) : (

              // Display list items
              <ul className="list-items">
                {getFilteredLists().map((item) => (
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
                    <Button
                      icon={"delete"}
                      onClick={() => openModal(item.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
            
            {/* Add List Input and Button */}
            <div className="add-list-container">
              <InputField
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Add List"
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

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this list?"
      />
    </div>
  );
};

export default Sidebar;
