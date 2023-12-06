import React, { useState, useEffect } from "react";
import Nav from "../../components/nav";
import { useRouter } from "next/router";
import {
  getTransactions,
  getAllTransactions,
  createTransaction,
  deleteTransaction,
  getAllTransactionsWithoutMonth
} from "../../api/transaction";
import axios from "axios";
import {SearchIcon, TrashIcon } from "@heroicons/react/solid";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  const [transactionData, setTransactionData] = useState({
    date: "",
    type: "",
    amount: "",
    category: "",
    description: "",
  });

  const router = useRouter();

  const currentMonth =
    new Date().toLocaleString("default", { month: "short" }).toUpperCase() +
    "-" +
    new Date().getFullYear().toString();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
    };

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      router.push("/");
    } else {
      const userToken = localStorage.getItem("jwt");
      if(selectedMonth === "ALL"){
        getAllTransactionsWithoutMonth(userToken).then((data) => {
          setTransactions(data.transactions);
        });
      } else {
      getAllTransactions(userToken, selectedMonth).then((data) => {
        setTransactions(data.transactions);
      });
    }
    }
  }, [selectedMonth]);

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
  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount == searchTerm
  );
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

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
    if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Nav />
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
        
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-300">Transactions</h1>
          <div className="relative w-1/2 ">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input 
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md text-gray-900 dark:text-gray-300 dark:bg-gray-800"
            />
          </div>
          <select onChange={handleMonthChange} value={selectedMonth} className="mr-4 border rounded-md p-2 text-gray-900 dark:text-gray-300 dark:bg-gray-800">
          <option value="ALL">All</option>
          {Array.from({ length: 12 }, (_, i) => 
            new Date(0, i).toLocaleString('en-US', { month: 'short' }).toUpperCase()
          ).map(monthShort => {
            const monthYear = `${monthShort}-${new Date().getFullYear()}`;
            return <option key={monthYear} value={monthYear}>{monthYear}</option>
          })}
        </select>
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
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-black dark:bg-opacity-50"
              onClick={() => setShowModal(false)}
            ></div>
      
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

              {/* Modal content */}
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-8 flex justify-between items-center">
                  <div></div>{" "} 
                  <h2 className="text-xl font-bold dark:text-gray-300">Transactions</h2>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
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
                      <input
                        name="description"
                        value={transactionData.description}
                        onChange={handleInputChange}
                        placeholder="description"
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

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={addTransaction}
                            className={
                                !transactionData.date ||
                                !transactionData.amount ||
                                !transactionData.description ||
                                !transactionData.category ||
                                !transactionData.type
                                    ? "cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-green-600 dark:hover:bg-green-800"
                                    : "cursor-pointer w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-green-600 dark:hover:bg-green-800"
                            }
                            disabled={
                                !transactionData.date ||
                                !transactionData.amount ||
                                !transactionData.description ||
                                !transactionData.category ||
                                !transactionData.type
                            }
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            <th
              className="cursor-pointer text-center p-2 rounded-tl-lg text-gray-900 dark:text-gray-300"
              onClick={() => handleSort("date")}
            >
              Date {sortKey === "date" && (sortOrder === 1 ? "▲" : "▼")}
            </th>
            <th
              className="cursor-pointer text-center p-2 text-gray-900 dark:text-gray-300"
              onClick={() => handleSort("amount")}
            >
              Amount {sortKey === "amount" && (sortOrder === 1 ? "▲" : "▼")}
            </th>
            <th
            className="cursor-pointer text-center p-2 text-gray-900 dark:text-gray-300"
          >
            Description
          </th>
            <th
              className="cursor-pointer text-center p-2 text-gray-900 dark:text-gray-300"
              onClick={() => handleSort("category")}
            >
              Category
              {sortKey === "category" && (sortOrder === 1 ? "▲" : "▼")}
            </th>
            <th
              className="cursor-pointer text-center p-2 rounded-tr-lg text-gray-900 dark:text-gray-300"
              onClick={() => handleSort("type")}
            >
              Type {sortKey === "type" && (sortOrder === 1 ? "▲" : "▼")}
            </th>
            <th className="text-center p-2 text-gray-900 dark:text-gray-300">Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx, index) => (
            <tr
              key={tx.id}
              className={`${
                index !== sortedTransactions.length - 1 ? "border-b" : ""
              } text-gray-900 dark:text-gray-300`}
            >
              <td
                className={`text-center p-2 ${
                  index === sortedTransactions.length - 1 && "rounded-bl-lg"
                }`}
              >
                {tx.date}
              </td>
              <td className="text-center p-2">₹ {tx.amount}</td>
              <td className="text-center p-2"> {tx.description}</td>
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
        <p className="text-center text-gray-900 dark:text-gray-300">There are no transactions for this month.</p>
      )}
    </main>
  </div>
);
};

export default Transaction;