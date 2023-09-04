import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import Nav from "../../components/nav";
import { getBudget, createBudget as apiCreateBudget } from "../../api/budget";
import { getTransactions } from "../../api/transaction";

const Budget = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const currentMonth =
    new Date().toLocaleString("default", { month: "short" }).toUpperCase() +
    "-" +
    new Date().getFullYear().toString();

  useEffect(() => {
    const userToken = localStorage.getItem("jwt");
    let isMounted = true;

    if (userToken) {
      getBudget(userToken).then((data) => {
        if (isMounted) {
          setBudgetData(data);
          setLoading(false);
        }
      });

      getTransactions(userToken, currentMonth).then((data) => {
        if (isMounted) {
          if (data && data.transactions && Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          } else {
            console.warn(
              "Received data from getTransactions is not in expected format:",
              data
            );
            setTransactions([]);
          }
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const createBudget = () => {
    const userToken = localStorage.getItem("jwt");

    apiCreateBudget(userToken, currentMonth, budgetAmount)
      .then((data) => {
        if (data && data.status === "Success") {
          window.location.reload();
        } else {
          console.error("Failed to create budget:", data);
        }
      })
      .catch((error) => {
        console.error("Error creating budget:", error);
      });
  };

  const groupedTransactions = transactions.reduce((acc, trans) => {
    if (!acc[trans.category]) {
      acc[trans.category] = 0;
    }
    acc[trans.category] += trans.amount;
    return acc;
  }, {});

  const categories = Object.keys(groupedTransactions);
  const amounts = Object.values(groupedTransactions);
  const totalSpent = amounts.reduce((acc, amount) => acc + amount, 0);
  const remainingBudget =
    budgetData &&
    budgetData.budget &&
    budgetData.budget.budgetAmount - totalSpent;

  const pieData = categories.length
    ? {
        labels: [...categories, "Remaining Budget"],
        datasets: [
          {
            data: [...amounts, remainingBudget],
            backgroundColor: [
              ...categories.map(
                () => "#" + (((1 << 24) * Math.random()) | 0).toString(16)
              ),
              "#ccc",
            ],
          },
        ],
      }
    : {
        labels: ["Nothing Spent"],
        datasets: [
          {
            data: [
              (budgetData &&
                budgetData.budget &&
                budgetData.budget.budgetAmount) ||
                0,
            ],
            backgroundColor: ["#ccc"],
          },
        ],
      };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 p-8">
        {loading ? (
          <div>Loading...</div>
        ) : budgetData.budget ? (
          <>
            {showUpdateModal && (
              <div
                className="fixed z-10 inset-0 overflow-y-auto"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                  ></div>
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3
                            className="text-lg leading-6 font-medium text-gray-900"
                            id="modal-title"
                          >
                            Update Budget for {currentMonth}
                          </h3>
                          <div className="mt-2">
                            <input
                              type="number"
                              placeholder="Enter Updated Budget Amount"
                              value={budgetAmount}
                              onChange={(e) => setBudgetAmount(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        onClick={createBudget}
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setShowUpdateModal(false)}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Budget for {currentMonth}
                </h2>
                <p>
                  Your budget is: Rs.
                  {budgetData &&
                    budgetData.budget &&
                    budgetData.budget.budgetAmount}
                </p>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowUpdateModal(true)}
              >
                Update Budget
              </button>
            </div>

            <div className="mt-8">
              <Pie data={pieData} />
            </div>
          </>
        ) : (
          <>
          <div className= "flex justify-between items-start">
            <p>You don't have a budget set for this month</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowModal(true)}
            >
              Add
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
                  <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                  ></div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3
                            className="text-lg leading-6 font-medium text-gray-900"
                            id="modal-title"
                          >
                            Set Budget for {currentMonth}
                          </h3>
                          <div className="mt-2">
                            <input
                              type="number"
                              placeholder="Enter Budget Amount"
                              value={budgetAmount}
                              onChange={(e) => setBudgetAmount(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        onClick={createBudget}
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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
            )}
          
          </>
        )}
      </main>
    </div>
  );
};

export default Budget;
