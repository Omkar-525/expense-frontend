import React, { useState, useEffect } from "react";
import Nav from "../../components/nav";
import { useRouter } from "next/router";
import {
  fetchSplitDetails,
  addTransaction,
  deleteTransaction,
  addUserToSplit,
  finalizeSplit,
  fetchTransactionsOfSplit,
  fetchDebtSummary,
} from "../../api/split";
import SearchUser from "../../components/split/searchUser";
import axios from "axios";
import DebtSummary from "../../components/split/DebtSummary";
import { TrashIcon } from "@heroicons/react/solid"; // Import the trash icon

const SplitDetailPage = () => {
  const router = useRouter();
  const { splitId } = router.query;

  const [splitDetails, setSplitDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [debtSummary, setDebtSummary] = useState([]);
  const [consolidatedDebts, setConsolidatedDebts] = useState({});

  // Fetch the current user from local storage (similarly to the CreateSplitModal component)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/category").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleUserSelect = (user) => {
    if (
      user.id !== currentUser?.id &&
      !selectedUsers.find((u) => u.id === user.id)
    ) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };
  const handleRemoveUser = (id) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleAddUser = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user before adding.");
      return;
    }
    if (selectedUsers.length) {
      const userIds = selectedUsers.map((user) => user.id);
      addUserToSplit(splitId, { userIds }) // assuming the API needs an object with a userIds property
        .then((response) => {
          if (response.response_code === "200") {
            // alert("Transaction Added");
            window.location.reload();
            setSelectedUsers([]); // clear selected users after adding
            setShowAddUserModal(false); // close modal after adding
          }
        })
        .catch((error) => {
          setErrorMsg("Failed to add user. Please try again.");
        });
    }
  };

  const [newTransaction, setNewTransaction] = useState({
    date: "",
    type: "DEBIT",
    amount: 0,
    description: "",
  });
  const [errorMsg, setErrorMsg] = useState(""); // Error state

  useEffect(() => {
    if (splitId) {
      fetchTransactionsOfSplit(splitId)
        .then((data) => setTransactions(data.data))
        .catch((error) => {
          setErrorMsg("Failed to fetch transactions. Please try again.");
          console.error("Failed to fetch transactions:", error);
        });
    }
  }, [splitId]);

  useEffect(() => {
    if (splitId) {
      fetchDebtSummary(splitId)
        .then((data) => setDebtSummary(data.data))
        .catch((error) => {
          setErrorMsg("Failed to fetch Debt Summary. Please try again.");
          console.error("Failed to fetch transactions:", error);
        });
    }
  }, [splitId]);

  useEffect(() => {
    let consolidatedDebt = {};

    debtSummary.forEach((creditorInfo) => {
      creditorInfo.debts.forEach((debt) => {
        if (consolidatedDebt[debt.debtor.name]) {
          consolidatedDebt[debt.debtor.name] += debt.amount;
        } else {
          consolidatedDebt[debt.debtor.name] = debt.amount;
        }
      });
    });

    for (let debtor in consolidatedDebt) {
      consolidatedDebt[debtor] = Math.round(consolidatedDebt[debtor]);
    }
    setConsolidatedDebts(consolidatedDebt);
  }, [debtSummary]);

  useEffect(() => {
    if (splitId) {
      fetchSplitDetails(splitId)
        .then((data) => {
          if (!data || typeof data !== "object") {
            throw new Error(
              "Received invalid data format from fetchSplitDetails. Expected an object."
            );
          }
          setSplitDetails(data);
        })
        .catch((error) => {
          setErrorMsg("Failed to fetch split details. Please try again.");
          console.error("Failed to fetch split details:", error);
        });
    }
  }, [splitId]);

  const handleAddTransaction = () => {
    if (
      !newTransaction.date ||
      !newTransaction.amount ||
      !newTransaction.description
    ) {
      alert("Please fill in all the fields before submitting.");
      return;
    }
    const dateObject = new Date(newTransaction.date);
    const formattedDate = `${String(dateObject.getDate()).padStart(
      2,
      "0"
    )}-${dateObject
      .toLocaleString("default", { month: "short" })
      .toUpperCase()}-${dateObject.getFullYear()}`;
    const category = categories.filter(
      (category) => category.name === "Split"
    )[0];

    const requestData = {
      ...newTransaction,
      date: formattedDate,
      category: category,
    };

    addTransaction(splitId, requestData)
      .then((newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
        setShowAddTransactionModal(false);
        window.location.reload();
      })
      .catch((error) => {
        setErrorMsg("Failed to add transaction. Please try again.");
      });
  };

  const handleDeleteTransaction = (transactionId) => {
    deleteTransaction(splitId, transactionId)
      .then(() => {
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      })
      .catch((error) => {
        setErrorMsg("Failed to delete transaction. Please try again.");
      });
  };

  const handleFinalize = () => {
    finalizeSplit(splitId)
      .then(() => {
        router.push("/split");
      })
      .catch((error) => {
        setErrorMsg("Failed to finalize split. Please try again.");
      });
  };

  if (!splitDetails) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
        <Nav />
        <main className="flex-1 p-8">
          <h1 className="text-2xl mb-4 text-black dark:text-white">
            Loading split details...
          </h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Style to make the Nav fixed */}

      <Nav />

      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <div>
          <button onClick={() => router.back()}>&larr; Go Back</button>
          {/* rest of your page content */}
        </div>

        <h1 className="text-2xl mb-4 font-bold text-black dark:text-white">
          Details for Split: {splitDetails.title}
        </h1>

        <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 mb-6 space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Participants
              </h2>

              <button
                onClick={() => setShowAddUserModal(true)}
                className={`${
                  splitDetails.isFinalized
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white"
                } text-white rounded px-4 py-2`}
                disabled={splitDetails.isFinalized}
              >
                Add User
              </button>
              {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2 max-w-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                      Add Users to Split
                    </h2>
                    <SearchUser
                      onSelectUser={handleUserSelect}
                      excludeUser={currentUser}
                      excludeUsers={splitDetails.users.map((user) => user.id)}
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-black dark:text-white">
                        Selected Users:
                      </h3>
                      <ul className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mt-2">
                        {selectedUsers.map((user) => (
                          <li
                            key={user.id}
                            className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 py-1"
                          >
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
                        onClick={handleAddUser}
                        className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        disabled={!selectedUsers.length}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddUserModal(false)}
                        className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            {showAddTransactionModal && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2 max-w-lg relative">
                  {/* Close button */}
                  <button
                    onClick={() => setShowAddTransactionModal(false)}
                    className="absolute top-2 right-2 text-xl font-bold cursor-pointer text-black dark:text-white"
                  >
                    &times; {/* This is the "X" character */}
                  </button>

                  <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                    Add Transactions
                  </h2>

                  <div className="space-y-4">
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newTransaction.description}
                      onChange={(e) =>
                        setNewTransaction((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                      onClick={handleAddTransaction}
                      disabled={
                        !newTransaction.date ||
                        !newTransaction.amount ||
                        !newTransaction.description
                      } // disable the button if any of the fields are empty
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <button
                onClick={() => setShowAddTransactionModal(true)}
                className={`${
                  splitDetails.isFinalized
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                } text-white rounded px-4 py-2`}
                disabled={splitDetails.isFinalized}
              >
                Add Transaction
              </button>
            </div>
            <table className="min-w-full bg-white dark:bg-gray-700 shadow-md rounded-md overflow-hidden">
              {" "}
              {/* Styling for table */}
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Owner</th>{" "}
                  {/* Added owner column */}
                  <th className="px-4 py-2"></th> {/* For the delete button */}
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="px-4 py-2">{transaction.date}</td>
                      <td className="px-4 py-2">{transaction.type}</td>
                      <td className="px-4 py-2">₹ {transaction.amount}</td>
                      <td className="px-4 py-2">
                        {transaction.user.name}
                      </td>{" "}
                      {/* Displaying owner's name */}
                      {!splitDetails.isFinalized && (
                        <td className="px-4 py-2 text-red-500 cursor-pointer">
                          <TrashIcon
                            className="w-5 h-5"
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-600">
                      No transactions available for this split yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section>
          <h2 className="text-xl mb-4 font-semibold text-black dark:text-white">
          Debts
        </h2>
        <div className="bg-white dark:bg-gray-800 p-4 border dark:border-gray-600 rounded-md">
          {debtSummary && debtSummary.length ? (
            <DebtSummary debtData={debtSummary} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No debt details available.</p>
          )}
        </div>
          </section>

          <section>
            <button
              onClick={handleFinalize}
              className={`${
                splitDetails.isFinalized
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              } text-white rounded px-4 py-2 w-full`}
              disabled={splitDetails.isFinalized}
            >
              Finalize Split
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SplitDetailPage;
