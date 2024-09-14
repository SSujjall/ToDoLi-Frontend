import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ListDisplay from "../components/ListDisplay";
import '../css/Home.css'; // Ensure you have CSS for styling

const Index = () => {
    const [selectedItem, setSelectedItem] = useState(null);
  
    const handleSelectItem = (item) => {
      setSelectedItem(item);
    };
  
    return (
      <div className="home-container">
        <Sidebar onSelectItem={handleSelectItem} />
        <main className="main-content">
          {selectedItem ? (
            <ListDisplay listId={selectedItem.id} listName={selectedItem.listName} />
          ) : (
            <p>Select a list from the sidebar to view its tasks.</p>
          )}
        </main>
      </div>
    );
  };
  
  export default Index;
