import React from "react";
import BatteryStatus from "./BatteryStatus";
export default function IncomeExpense({ transactions }) {
  const amount = transactions.map((transaction) => Number(transaction.amount));
  const total = amount.reduce((acc, item) => acc + item, 0).toFixed(2);

  const income = amount
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0);
  const expenses = amount
    .filter((item) => item < 0)
    .reduce((acc, item) => acc + item, 0);

  return (
    <div>
      <div className="Container">
        <header>Spend Smart</header>
        <BatteryStatus />
        <div className="BalanceBoxquestion">How much?</div>
        <div className="BalanceBox">£ {total}</div>
      </div>
      <div className="incomeExpenseContainer">
        <div>
          <h4>Income</h4>
          <p className="money plus">+£{Math.abs(income).toFixed(2)}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="money minus">-£{Math.abs(expenses).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
