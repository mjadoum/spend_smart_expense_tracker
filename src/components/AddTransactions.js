import React, { useState, useEffect } from "react";
import { RiMoneyPoundCircleFill } from "react-icons/ri";
// Sound effects
import expenseMoney from "../assets/expenseMoney.mp3";
import incomeMoney from "../assets/incomeMoney.mp3";

export default function AddTransactions({ id, addTransaction }) {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionText, setTransactionText] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDate, setTransactionDate] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

useEffect(() => {
  const storedLatitude = localStorage.getItem("initialLatitude");
  const storedLongitude = localStorage.getItem("initialLongitude");

  if (storedLatitude && storedLongitude) {
    setLatitude(parseFloat(storedLatitude));
    setLongitude(parseFloat(storedLongitude));
  } else {
    getLocation();
  }
}, []);

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        // Store the initial location
        localStorage.setItem("initialLatitude", position.coords.latitude);
        localStorage.setItem("initialLongitude", position.coords.longitude);
      },
      (error) => {
        console.error("Error retrieving location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

  const onSubmit = (event) => {
    event.preventDefault();

    const newTransaction = {
      id: id,
      text: transactionText,
      amount: transactionAmount,
      date: transactionDate,
      latitude: latitude,
      longitude: longitude,
    };

    addTransaction(newTransaction);
    setTransactionText("");
    setTransactionAmount(0);
    setTransactionDate("");

    // Play sound based on transaction amount
    if (transactionAmount > 0) {
      playSound(incomeMoney);
    } else if (transactionAmount < 0) {
      playSound(expenseMoney);
    }
    setShowAddTransaction(false);
  };

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };
  const handleAmountChange = (event) => {
    const value = event.target.value;
    // Regex to allow only numbers and optional minus sign
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    if (isValidInput) {
      setTransactionAmount(value);
    }
  };


  return (
    <div>
      <button
        className="Add-btn"
        onClick={() => {
          setShowAddTransaction(!showAddTransaction);
          getLocation();
        }}
      >
        {showAddTransaction ? "CANCEL" : "ADD"}
      </button>

      {showAddTransaction && (
        <div className="modal AddTransactionContainer">
          <div className="modal-content">
            <h3>Add Transactions</h3>
            <form onSubmit={onSubmit}>
              <div className="form-control">
                <label>Transaction made for</label>
                <input
                  value={transactionText}
                  onChange={(event) => setTransactionText(event.target.value)}
                  placeholder="Food, job, ..."
                  type="text"
                  required
                />
              </div>

              <div className="form-control">
                <label>
                  Amount <RiMoneyPoundCircleFill /> (-1 , +1)
                </label>
                <input
                  value={transactionAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  type="text"
                  required
                />
              </div>

              <div className="form-control">
                <label>When made</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(event) => setTransactionDate(event.target.value)}
                  required
                />
              </div>

              <button className="save-btn">Add Transaction</button>
              <button
                className="cancel-btn"
                onClick={() => setShowAddTransaction(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
