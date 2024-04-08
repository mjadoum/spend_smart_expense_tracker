export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const DELETE_TRANSACTION = "DELETE_TRANSACTION";
export const UPDATE_TRANSACTION = "UPDATE_TRANSACTION";

export const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  payload: transaction,
});

export const deleteTransaction = (transactionId) => ({
  type: DELETE_TRANSACTION,
  payload: transactionId,
});

export const updateTransaction = (transaction) => ({
  type: UPDATE_TRANSACTION,
  payload: transaction,
});
