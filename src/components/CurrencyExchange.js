import React, { useState, useEffect } from "react";
import { GrMoney } from "react-icons/gr";

export default function CurrencyExchange({ transactions }) {
  const amount = transactions.map((transaction) => Number(transaction.amount));
  const total = amount.reduce((acc, item) => acc + item, 0).toFixed(2);

  const [exchangeRates, setExchangeRates] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    fetch(
      "https://v6.exchangerate-api.com/v6/c3ee735dd7a2934bec6bc3c9/latest/GBP"
    )
      .then((response) => response.json())
      .then((data) => {
        // Extracting only the required currencies
        const { EUR, USD, CAD, PLN, TRY, CNY, KWD, AED } =
          data.conversion_rates;
        setExchangeRates({ EUR, USD, CAD, PLN, TRY, CNY, KWD, AED });
      })
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
      });
  }, []);

  const ExchangeButtonClick = () => {
    setShowOverlay(true);
  };

  return (
    <div>
      <button className="Add-btn" onClick={ExchangeButtonClick}>
        Currency Exchange
      </button>

      {showOverlay && (
        <div className="overlay-currency">
          <div className="overlay-content-currency">
            <h3>Balance: £ {total}</h3>
            <p>Check your balance in other currencies. </p>

            <h4>Exchange Rates:</h4>
            {exchangeRates && (
              <ul>
                <li>
                  <GrMoney className="icon-style" />$ {"\t"}
                  {(total * exchangeRates.USD).toFixed(2)}
                  <span> United States Dollar</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />€ {"\t"}
                  {(total * exchangeRates.EUR).toFixed(2)} <span> Euro</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />$ {"\t"}
                  {(total * exchangeRates.CAD).toFixed(2)}
                  <span> Canadian Dollar</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />
                  zł {"\t"}
                  {(total * exchangeRates.PLN).toFixed(2)}
                  <span> Polish Złoty</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />₺ {"\t"}
                  {(total * exchangeRates.TRY).toFixed(2)}
                  <span> Turkish Lira</span>
                </li>
                <li>
                  <GrMoney className="icon-style" /> ¥ {"\t"}
                  {(total * exchangeRates.CNY).toFixed(2)}
                  <span> Chinese Renminbi</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />
                  {(total * exchangeRates.KWD).toFixed(2)}
                  <span> Kuwaiti Dinar</span>
                </li>
                <li>
                  <GrMoney className="icon-style" />
                  {(total * exchangeRates.AED).toFixed(2)}
                  <span> UAE Dirham</span>
                </li>
              </ul>
            )}

            <button
              className="cancel-btn"
              onClick={() => setShowOverlay(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
