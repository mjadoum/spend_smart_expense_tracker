import React, { Component } from "react";

import { connect } from "react-redux";
import AddTransactions from "./AddTransactions";
import TransactionsList from "./TransactionsList";
import IncomeExpense from "./IncomeExpense";
import CurrencyExchange from "./CurrencyExchange";

import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../redux/actions";

export class Main extends Component {
  render() {
    const {
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
    } = this.props;
    console.log(transactions);
    return (
      <div className="container">
        <IncomeExpense transactions={transactions} />
        <AddTransactions
          addTransaction={(transaction) => addTransaction(transaction)}
          id={transactions[0] ? transactions[0].id + 1 : 1}
        />
        <CurrencyExchange transactions={transactions} />
        <TransactionsList
          transactions={transactions}
          deleteTransaction={(id) => deleteTransaction(id)}
          updateTransaction={(transaction) => updateTransaction(transaction)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  transactions: state.transactions,
});

const mapDispatchToProps = (dispatch) => ({
  addTransaction: (transaction) => dispatch(addTransaction(transaction)),
  deleteTransaction: (id) => dispatch(deleteTransaction(id)),
  updateTransaction: (transaction) => dispatch(updateTransaction(transaction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
