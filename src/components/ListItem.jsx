/* eslint-disable react/prop-types */
const ListItem = ({ item, onSelect }) => {
    return (
      <li className="list-item" onClick={() => onSelect(item)}>
        {item.listName}
      </li>
    );
  };
  
  export default ListItem;