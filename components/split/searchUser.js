import React, { useState } from 'react';
import { searchUsers } from '../../api/user';

const SearchUser = ({ onSelectUser, excludeUser, excludeUsers = [] }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await searchUsers(query);
      // Extracting the user data from the 'data' field of the response object
      // and filtering out the excluded user
      const filteredUsers = results.data.filter(user => user.id !== excludeUser?.id)
      .filter(user => 
        !excludeUsers.includes(user.id) && user.id !== excludeUser?.id);

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      // Optionally, set an empty array in case of error
      setUsers([]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          placeholder="Search for user by name"
        />
        <button onClick={handleSearch} className="text-teal-500 hover:text-teal-800">Search</button>
      </div>
      <ul className="mt-3">
        {users.map(user => (
          <li key={user.id} className="cursor-pointer hover:bg-teal-100 px-3 py-1" onClick={() => onSelectUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;
