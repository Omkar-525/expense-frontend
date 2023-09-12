import { Bar } from 'react-chartjs-2';
import React, { useState } from 'react';

const DebtSummary = ({ debtData }) => {
  const [selectedCreditor, setSelectedCreditor] = useState(null);

  const totalOwedToCreditor = (debts) => {
    return debts.reduce((acc, debt) => acc + debt.amount, 0);
  };

  const handleCreditorClick = (creditorInfo) => {
    if (selectedCreditor && selectedCreditor.creditor.id === creditorInfo.creditor.id) {
      setSelectedCreditor(null); // If clicked on the same creditor, close it
    } else {
      setSelectedCreditor(creditorInfo);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Debt Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {debtData.map(creditorInfo => (
          <div
            key={creditorInfo.creditor.id}
            className="p-4 border rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => handleCreditorClick(creditorInfo)}
          >
            <h3 className="text-xl font-bold">{creditorInfo.creditor.name}</h3>
            <p>Is owed: <span className="font-semibold">₹ {totalOwedToCreditor(creditorInfo.debts).toFixed(2)}</span></p>
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
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Debtors for {creditor.creditor.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditor.debts.map(debt => (
            <div
              key={debt.debtor.id}
              className="p-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' // An example gradient background
              }}
            >
              <h4 className="text-lg font-semibold mb-2">{debt.debtor.name}</h4>
              <p>Owes: <span className="font-bold">₹ {debt.amount.toFixed(2)}</span></p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  const ConsolidatedDebtGraph = ({ debtData }) => {
    // Creating an object to keep track of each debtor's total debt
    let consolidatedDebts = {};
  
    debtData.forEach(creditorInfo => {
      creditorInfo.debts.forEach(debt => {
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
  
    const data = {
      labels: Object.keys(consolidatedDebts),
      datasets: [
        {
          label: 'Total Amount Owed (₹)',
          data: Object.values(consolidatedDebts),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    return (
      <div className="p-4 border border-gray-300 rounded-md mt-6">
        <Bar data={data} />
      </div>
    );
  };
  
export default DebtSummary;
