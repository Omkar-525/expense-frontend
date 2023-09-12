import React, { useState, useEffect } from "react";
import Nav from "../../components/nav";
import { useRouter } from "next/router";
import {
  getTransactions,
  getAllTransactions,
  createTransaction,
  deleteTransaction,
} from "../../api/transaction";
import axios from "axios";
import { TrashIcon } from '@heroicons/react/solid';


const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [transactionData, setTransactionData] = useState({
    date: "",
    type: "",
    amount: "",
    category: "",
  });

  const router = useRouter();

  const currentMonth =
    new Date().toLocaleString("default", { month: "short" }).toUpperCase() +
    "-" +
    new Date().getFullYear().toString();

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      router.push("/");
    } else {
      const userToken = localStorage.getItem("jwt");
      getAllTransactions(userToken, currentMonth).then((data) => {
        setTransactions(data.transactions);
      });
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/category").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleInputChange = (e) => {
    setTransactionData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleDelete = (transactionId) => {
    const userToken = localStorage.getItem("jwt");

    deleteTransaction(userToken, transactionId)
      .then((response) => {
        if (response.status === "Success") {
          // Remove the transaction from the local state
          setTransactions(transactions.filter((tx) => tx.id !== transactionId));
          alert("Transaction deleted successfully!");
        } else {
          alert(response.message); // This will display the error message from the backend
        }
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete the transaction.");
      });
  };

  const addTransaction = () => {
    const userToken = localStorage.getItem("jwt");
    if (parseFloat(transactionData.amount) <= 0) {
      alert("Amount should be greater than 0");
      return;
    }

    // Convert the amount to an integer
    const amountAsInteger = parseInt(transactionData.amount, 10);

    // Convert date to the format DD-MMM-YYYY
    const dateObject = new Date(transactionData.date);
    const formattedDate = `${String(dateObject.getDate()).padStart(
      2,
      "0"
    )}-${dateObject
      .toLocaleString("default", { month: "short" })
      .toUpperCase()}-${dateObject.getFullYear()}`;

    const requestData = {
      ...transactionData,
      amount: amountAsInteger,
      date: formattedDate,
    };

    createTransaction(userToken, requestData)
      .then((data) => {
        if (data.status === "Success") {
          alert("Success!");
        } else {
          alert("Failed!");
        }
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
        alert("Failed!");
      })
      .finally(() => {
        window.location.reload();
      });
  };
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(1); // 1 for ascending, -1 for descending

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder * -1);
    } else {
      setSortKey(key);
      setSortOrder(1);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
    if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div></div>{" "}
          {/* This empty div will take up space equivalent to the Add Transaction button */}
          <h2 className="text-xl font-bold">Transactions</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowModal(true)}
          >
            Add Transaction
          </button>
        </div>

        {showModal && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setShowModal(false)}
              ></div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              {/* Modal content */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-8 flex justify-between items-center">
                    <div></div>{" "}
                    {/* This empty div will take up space equivalent to the Add Transaction button */}
                    <h2 className="text-xl font-bold">Transactions</h2>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setShowModal(true)}
                    >
                      Add Transaction
                    </button>
                  </div>

                  <div className="mt-2">
                    <div className="mt-2">
                      <input
                        type="date"
                        name="date"
                        value={transactionData.date}
                        onChange={handleInputChange}
                        className="mb-2 p-1 border rounded w-full"
                      />
                      <select
                        name="type"
                        value={transactionData.type}
                        onChange={handleInputChange}
                        className="mb-2 p-1 border rounded w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>
                      </select>
                      <input
                        name="amount"
                        value={transactionData.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                        className="mb-2 p-1 border rounded w-full"
                      />
                      <select
                        name="category"
                        value={transactionData.category}
                        onChange={handleInputChange}
                        className="mb-2 p-1 border rounded w-full"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={addTransaction}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="w-4/5 mx-auto border-collapse rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="cursor-pointer text-center p-2 rounded-tl-lg"
                onClick={() => handleSort("date")}
              >
                Date {sortKey === "date" && (sortOrder === 1 ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer text-center p-2"
                onClick={() => handleSort("amount")}
              >
                Amount {sortKey === "amount" && (sortOrder === 1 ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer text-center p-2"
                onClick={() => handleSort("category")}
              >
                Category{" "}
                {sortKey === "category" && (sortOrder === 1 ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer text-center p-2 rounded-tr-lg"
                onClick={() => handleSort("type")}
              >
                Type {sortKey === "type" && (sortOrder === 1 ? "▲" : "▼")}
              </th>
              <th className="text-center p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx, index) => (
              <tr
                key={tx.id}
                className={`${
                  index !== sortedTransactions.length - 1 ? "border-b" : ""
                }`}
              >
                <td
                  className={`text-center p-2 ${
                    index === sortedTransactions.length - 1 && "rounded-bl-lg"
                  }`}
                >
                  {tx.date}
                </td>
                <td className="text-center p-2">₹ {tx.amount}</td>
                <td className="text-center p-2">{tx.category}</td>
                <td
                  className={`text-center p-2 ${
                    tx.type === "CREDIT" ? "bg-green-500" : "bg-red-500"
                  } text-white ${
                    index === sortedTransactions.length - 1 && "rounded-br-lg"
                  }`}
                >
                  {tx.type}
                </td>
                <td className="text-center p-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white rounded p-1"
                    onClick={() => handleDelete(tx.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedTransactions.length === 0 && (
          <p>There are no transactions for this month.</p>
        )}
      </main>
    </div>
  );
};

export default Transaction;
