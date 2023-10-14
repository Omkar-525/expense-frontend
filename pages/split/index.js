import React, { useState, useEffect } from "react";
import Nav from "../../components/nav";
import CreateSplitModal from "../../components/split/CreateSplitModal";
import { fetchSplits, createSplit } from "../../api/split";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/solid";

const Split = () => {
  const router = useRouter();

  const [splits, setSplits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      router.push("/");
    } else {
      fetchSplits()
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error(
              "Received invalid data format from fetchSplits. Expected an array."
            );
          }
          setSplits([...data]);
        })
        .catch((error) => {
          console.error("Failed to fetch splits:", error);
        });
    }
  }, []);

  const handleCreateSplit = async (title, userIds) => {
    try {
      const newSplit = await createSplit({ title, userIds });
      setSplits((prev) => [...prev, newSplit]);
      setModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create split:", error);
    }
  };
  const filteredSplits = splits.filter((split) =>
    split.title.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter splits based on search term

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">My Splits</h1>
          
            <div className="relative  w-1/2">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search splits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
              />
            </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="bg-teal-500 text-white px-8 py-2 rounded-full shadow-lg hover:bg-teal-600 transition-all"
          >
            Create Split
          </button>
        </div>

        {/* Display list of splits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(filteredSplits) &&
            filteredSplits.map((split) => (
              <div
                key={split.id}
                className="p-5 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => router.push(`/split/${split.id}`)}
              >
                <h2 className="text-xl font-medium mb-4">{split.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Users:{" "}
                  {split.users
                    .slice(0, 3)
                    .map((user) => user.name)
                    .join(", ")}
                  {split.users.length > 3 && "..."}
                </p>
                <p
                  className={
                    split.isFinalized ? "text-green-500" : "text-red-500"
                  }
                >
                  Status: {split.isFinalized ? "Finalized" : "Not Finalized"}
                </p>
              </div>
            ))}
        </div>

        <CreateSplitModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateSplit}
        />
      </main>
    </div>
  );
};

export default Split;
