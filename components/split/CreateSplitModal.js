import React, { useState, useEffect } from 'react';
import SearchUser from './searchUser';

const CreateSplitModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    }
  }, []);

  const handleUserSelect = (user) => {
    // Ensure that the selected user isn't the current user and isn't already in the list.
    if (user.id !== currentUser?.id && !selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleCreate = () => {
    if (title.trim() && selectedUsers.length) {
      // Extracting only the user IDs from the selected users
      const userIds = selectedUsers.map(user => user.id);

      // Include the current user ID in the split
      userIds.push(currentUser?.id);

      onCreate(title, userIds);
      setTitle("");  // Clear the title
      setSelectedUsers([]);  // Clear the selected users
      onClose();  // Close the modal after creating the split
    }
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/2 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Create a Split</h2>
        <input 
            type="text" 
            placeholder="Enter Split Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-md"
        />
        <SearchUser onSelectUser={handleUserSelect} excludeUser={currentUser} />
        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected Users:</h3>
          <ul className="bg-gray-100 rounded-lg p-2 mt-2">
            {selectedUsers.map(user => (
              <li key={user.id} className="flex justify-between items-center border-b border-gray-300 py-1">
                {user.name}
                <span 
                    onClick={() => handleRemoveUser(user.id)} 
                    className="cursor-pointer px-2 py-1 rounded-full hover:bg-red-500 hover:text-white"
                >
                    x
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-6">
          <button 
              onClick={handleCreate} 
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Create
          </button>
          <button 
              onClick={onClose} 
              className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSplitModal;
