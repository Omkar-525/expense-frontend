
      // Calculate monthly spending by category
      const spendingByCategory = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "DEBIT") {
            acc.debits[transaction.category] =
              (acc.debits[transaction.category] || 0) + transaction.amount;
          } else {
            acc.credits[transaction.category] =
              (acc.credits[transaction.category] || 0) + transaction.amount;
          }
          return acc;
        },
        { debits: {}, credits: {} }
      );
      const categories = Array.from(
        new Set(transactions.map((t) => t.category))
      );
      const debitValues = categories.map(
        (c) => spendingByCategory.debits[c] || 0
      );
      const creditValues = categories.map(
        (c) => spendingByCategory.credits[c] || 0
      );

      setMonthlySpendingData({
        labels: categories,
        datasets: [
          {
            label: "Debits",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: debitValues,
          },
          {
            label: "Credits",
            backgroundColor: "rgba(54,162,235,0.2)",
            borderColor: "rgba(54,162,235,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(54,162,235,0.4)",
            hoverBorderColor: "rgba(54,162,235,1)",
            data: creditValues,
          },
        ],
      });
      // Calculate spending by day
      const spendingByDay = transactions.reduce((acc, transaction) => {
        const day = new Date(transaction.date).getDate(); // Extract day of the month
        if (transaction.type === "DEBIT") {
          acc[day] = (acc[day] || 0) + transaction.amount;
        }
        return acc;
      }, {});

      // Populate bar chart data
      const days = Array.from({ length: 31 }, (_, i) => i + 1);  // Days of a month [1-31]
      const dailyValues = days.map(d => spendingByDay[d] || 0);

      setDailySpendingData({
        labels: days.map(d => `Day ${d}`),
        datasets: [
          {
            label: 'Spending',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: dailyValues
          }
        ]
      });