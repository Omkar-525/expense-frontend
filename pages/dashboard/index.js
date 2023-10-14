import React, { useEffect, useState } from "react";
import Nav from "../../components/nav";
import { useRouter } from "next/router";
import { Pie, Bar } from "react-chartjs-2";
import {
  fetchDebtSummary,
  fetchSplitDetails,
  fetchSplits,
  fetchTransactionsOfSplit,
} from "../../api/split";
import { getBudget } from "../../api/budget";
import {
  getAllTransactions,
  getAllTransactionsWithoutMonth,
  getTransactions,
} from "../../api/transaction";
import axios from "axios";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [monthlySpendingData, setMonthlySpendingData] = useState({});
  const [pieData, setPieData] = useState({
    totalExpense: 0,
    owed: 0,
    owe: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth =
        new Date().toLocaleString("default", { month: "short" }).toUpperCase() +
        "-" +
        new Date().getFullYear().toString();
      const token = localStorage.getItem("jwt");
      const currentUserId = localStorage.getItem("user").id; // Assuming you store userId in localStorage
  
      if (!token) {
        router.push("/");
        return;
      }
  
      axios
        .get("http://localhost:8080/user/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data)
        .then((response) => {
          setMonthlySpendingData(
            response.monthlyTransactions.monthlyTransactions
          );
          setPieData({
            totalExpense: response.totalExpense.totalExpense,
            owed: response.totalExpense.totalOwed,
            owe: response.totalExpense.totalWeOwe,
          });
        });
  
      // Initialize transactions as an empty array
      setTransactions([]);
  
      getTransactions(token, currentMonth)
        .then((data) => {
          // Ensure data.transactions is an array before using slice
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions.slice(0, 5));
          }
        })
        .catch((error) => {
          // Handle any errors that might occur during the data fetch
          console.error("Error fetching transactions:", error);
        });
    };
  
    fetchData();
  }, []);



  const pieChartData = {
    labels: ["Total Expenses", "Total Owed", "Total You Owe"],
    datasets: [
      {
        data: [pieData.totalExpense, pieData.owed, pieData.owe],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  const barChartData = {
    labels: Object.keys(monthlySpendingData),
    datasets: [
      {
        label: "Credit",
        data: Object.values(monthlySpendingData).map((item) => item.CREDIT),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Debit",
        data: Object.values(monthlySpendingData).map((item) => item.DEBIT),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 p-8  overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="mb-4 text-lg text-center font-semibold">
              Monthly Expenses and Split Overview
            </h3>
            <Pie data={pieChartData} />
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="mb-4 text-lg text-center font-semibold">
              Transactions per Month
            </h3>
            <Bar data={barChartData} />
          </div>

          <div className="col-span-2 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl text-center font-semibold mb-4">Recent Debit Transactions</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <ul>
                {transactions.slice(0, 5).map((transaction, index) => (
                  <li
                    key={transaction.id}
                    className={`grid grid-cols-3 gap-4 transform transition-all duration-500 ease-in-out opacity-80 translate-x-4 hover:opacity-100 hover:translate-x-0 bg-white p-4 rounded-md my-2 shadow-sm hover:shadow-md`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <span className="text-gray-600 font-medium">
                      {transaction.date}
                    </span>
                    <span className="col-span-1 text-center">
                      {transaction.description}
                    </span>
                    <div className="flex justify-between">
                      <span
                        className={`font-bold ${
                          transaction.type === "DEBIT"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span>: ₹ {transaction.amount}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
