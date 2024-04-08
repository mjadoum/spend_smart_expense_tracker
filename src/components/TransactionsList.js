import React, { useState, useEffect } from "react";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { FiEdit } from "react-icons/fi";
import { RiMoneyPoundCircleFill } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TbClipboardOff } from "react-icons/tb";
import expenseMoney from "../assets/expenseMoney.mp3";
import incomeMoney from "../assets/incomeMoney.mp3";

export default function TransactionsList({
  transactions,
  deleteTransaction,
  updateTransaction,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedTransaction, setUpdatedTransaction] = useState(null);
  const [listVisibility, setListVisibility] = useState({});
  const [transactionLocations, setTransactionLocations] = useState({});

  useEffect(() => {
    // Get location information for each transaction
    transactions.forEach((transaction) => {
      getLocation(transaction);
    });
  }, [transactions]);

  transactions = transactions.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Toggle transactions organization
  const toggleList = (monthYear) => {
    setListVisibility((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };

  // Delete Button transaction
  const handleDelete = (id) => {
    setTransactionIdToDelete(id);
    setShowConfirmation(true);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    // Regex to allow only numbers and optional minus sign
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    if (isValidInput) {
      setUpdatedTransaction({
        ...updatedTransaction,
        amount: value,
      });
    }
  };
  // Call confirmation to delete transaction
  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      deleteTransaction(transactionIdToDelete);
    }
    setShowConfirmation(false);
    setTransactionIdToDelete(null);
  };

  const handleUpdateClick = (transaction) => {
    setUpdatedTransaction(transaction);
    setShowModal(true);
  };

  const handleSave = () => {
    updateTransaction(updatedTransaction);
    setShowModal(false);

    // Play sound based on transaction amount
    if (updatedTransaction.amount > 0) {
      playSound(incomeMoney);
    } else if (updatedTransaction.amount < 0) {
      playSound(expenseMoney);
    }

  };

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  // Group transaction by month date
  const groupTransactionsByMonth = (transactions) => {
    const groupedTransactions = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleDateString("en-UK", {
        month: "long",
      })} ${date.getFullYear()}`;
      if (!groupedTransactions[monthYear]) {
        groupedTransactions[monthYear] = [];
      }
      groupedTransactions[monthYear].push(transaction);
    });
    return groupedTransactions;
  };
  const groupedTransactions = groupTransactionsByMonth(transactions);

  // geolocation API to track the location
  const getLocation = (transaction) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqyPeQYFaX0pkZ5sdMaAH2E43yHM3DJLk`;

          fetch(geocodingApiUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const placeName = data.results[0].formatted_address;
                setTransactionLocations((prevLocations) => ({
                  ...prevLocations,
                  [transaction.id]: placeName,
                }));
              }
            })
            .catch((error) => {
              console.error("Error retrieving location:", error);
            });
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      {transactions.length === 0 ? (
        <div>
          <h2>Summary Transactions</h2>
          <p style={{ textAlign: "center", fontFamily: "Outfit, sans-serif;" }}>
            No transactions yet
          </p>
          <TbClipboardOff style={{ fontSize: "40px", marginLeft: "130px" }} />
        </div>
      ) : (
        <h2>Summary Transactions</h2>
      )}

      {Object.entries(groupedTransactions).map(([monthYear, transactions]) => (
        <div key={monthYear}>
          <h3 className="monthdate" onClick={() => toggleList(monthYear)}>
            {monthYear}
          </h3>
          <ul
            className="list"
            style={{ display: listVisibility[monthYear] ? "block" : "none" }}
          >
            {transactions.map((transaction) => (
              <li
                className={
                  transaction.amount >= 0 ? "positiveAmount" : "negativeAmount"
                }
                key={transaction.id}
              >
                <div className="transaction-info">
                  <span className="text">{transaction.text}</span>
                  <span className="date-span">
                    <SlCalender /> {"\t"}
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="location-span">
                    <FaMapMarkedAlt /> {"\t"}
                    {transactionLocations[transaction.id]}
                  </span>
                </div>
                <strong
                  className={
                    transaction.amount >= 0
                      ? "positiveAmount"
                      : "negativeAmount"
                  }
                >
                  {transaction.amount >= 0 ? "+" : "-"}
                  {"\t"}£
                  {transaction.amount % 1 !== 0
                    ? Math.abs(transaction.amount).toFixed(2)
                    : Math.abs(transaction.amount)}
                </strong>

                <button
                  className="update-btn"
                  onClick={() => handleUpdateClick(transaction)}
                >
                  <FiEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(transaction.id)}
                >
                  <HiArchiveBoxXMark />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <p>Are you sure you want to delete this transaction?</p>
            <div>
              <button
                className="save-btn"
                onClick={() => handleConfirmation(true)}
              >
                Yes, Sure
              </button>
              <button
                className="cancel-btn"
                onClick={() => handleConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Transaction</h3>
            <label>Transaction made for</label>
            <input
              type="text"
              value={updatedTransaction.text}
              onChange={(e) =>
                setUpdatedTransaction({
                  ...updatedTransaction,
                  text: e.target.value,
                })
              }
            />
            <label>
              Amount <RiMoneyPoundCircleFill />
            </label>
            <input
              type="text" // Change type to text
              value={updatedTransaction.amount}
              onChange={handleAmountChange}
              placeholder="0"
              required
            />
            <label>When made</label>
            <input
              type="date"
              value={updatedTransaction.date}
              onChange={(e) =>
                setUpdatedTransaction({
                  ...updatedTransaction,
                  date: e.target.value,
                })
              }
            />
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
