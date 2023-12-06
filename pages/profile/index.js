import React, { useEffect, useState } from "react";
import Nav from "../../components/nav";
import axios from "axios";

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(JSON.parse(storedUser));
    console.log(JSON.parse(storedUser));
  }, []);

  const handleChangePassword = async (e) => {
    const token = localStorage.getItem("jwt");
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    let postData = {
      oldPassword: currentPassword,
      newPassword,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/user/changepassword",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.response_code === "200") {
        alert(response.data.response_description);
        setShowModal(false);
      } else {
        alert("Error changing password!");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Error changing password!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Nav />
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Profile
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <p>
            <strong className="text-gray-900 dark:text-gray-100">Name:</strong>{" "}
            {user["name"]}
          </p>
          <p className="mt-2">
            <strong className="text-gray-900 dark:text-gray-100">Email:</strong>{" "}
            {user["email"]}
          </p>
          <button
            className="mt-4 text-blue-500 hover:text-blue-700 dark:text-gray-300"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </button>
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
