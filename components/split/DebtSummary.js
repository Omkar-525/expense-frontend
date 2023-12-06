import { Bar } from "react-chartjs-2";
import React, { useState } from "react";

const DebtSummary = ({ debtData }) => {
  const [selectedCreditor, setSelectedCreditor] = useState(null);

  const totalOwedToCreditor = (debts) => {
    return debts.reduce((acc, debt) => acc + debt.amount, 0);
  };

  const handleCreditorClick = (creditorInfo) => {
    if (
      selectedCreditor &&
      selectedCreditor.creditor.id === creditorInfo.creditor.id
    ) {
      setSelectedCreditor(null);
    } else {
      setSelectedCreditor(creditorInfo);
    }
  };

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">
        Debt Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {debtData.map((creditorInfo) => (
          <div
            key={creditorInfo.creditor.id}
            className="p-4 border dark:border-gray-600 rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800"
            onClick={() => handleCreditorClick(creditorInfo)}
          >
            <h3 className="text-xl font-bold text-black dark:text-gray-100">{creditorInfo.creditor.name}</h3>
            <p className="text-black dark:text-gray-300">
              Is owed:{" "}
              <span className="font-semibold">
                ₹ {totalOwedToCreditor(creditorInfo.debts).toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
      {selectedCreditor && <DebtorList creditor={selectedCreditor} />}
      <ConsolidatedDebtGraph debtData={debtData} />
    </div>
  );
};

const DebtorList = ({ creditor }) => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-black dark:text-gray-100 border-b pb-2">
        Debtors for {creditor.creditor.name}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {creditor.debts.map((debt) => (
          <div
            key={debt.debtor.id}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 transform hover:scale-105"
          >
            <h4 className="text-lg font-semibold mb-2 text-black dark:text-gray-100">
              {debt.debtor.name}
            </h4>
            <p className="text-black dark:text-gray-300">
              Owes: 
              <span className="font-bold ml-1">₹ {debt.amount.toFixed(2)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


const ConsolidatedDebtGraph = ({ debtData }) => {
  let consolidatedDebts = {};

  debtData.forEach((creditorInfo) => {
    creditorInfo.debts.forEach((debt) => {
      if (consolidatedDebts[debt.debtor.name]) {
        consolidatedDebts[debt.debtor.name] += debt.amount;
      } else {
        consolidatedDebts[debt.debtor.name] = debt.amount;
      }
    });
  });

  for (let debtor in consolidatedDebts) {
    consolidatedDebts[debtor] = Math.round(consolidatedDebts[debtor]);
  }

  // Generate gradient color
  const generateGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#ADD8E6");  // Light Blue
    gradient.addColorStop(1, "#0000FF");  // Blue
    return gradient;
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const gradientBlue = generateGradient(ctx);

  const data = {
    labels: Object.keys(consolidatedDebts),
    datasets: [
      {
        label: "Total Amount Owed (₹)",
        data: Object.values(consolidatedDebts),
        backgroundColor: gradientBlue,
        borderColor: gradientBlue.toString(),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md mt-6 dark:bg-gray-800">
      <Bar data={data} />
    </div>
  );
};



export default DebtSummary;
