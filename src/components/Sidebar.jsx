import { useEffect, useState } from "react";
import { fetchList } from "../services/Api";
import { useNavigate } from "react-router-dom";
import '../css/Sidebar.css';

// eslint-disable-next-line react/prop-types
const Sidebar = ({ onSelectItem }) => {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
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
  
    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="collapse-button" onClick={handleCollapseToggle}>
            {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul className="list-items">
            {list.map(item => (
                <li key={item.id} onClick={() => onSelectItem(item)}>
                    {item.listName}
                </li>
            ))}
        </ul>
    </div>
    );
  };
  
  export default Sidebar;