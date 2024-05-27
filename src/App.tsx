import React, { useState } from "react";
import "./App.css";
import HistoricalChart from "./components/HistoricalChart";
import RealTimePrice from "./components/RealTimePrice/RealTimePrice";

function App() {
  const [currency, setCurrency] = useState("BTC_USD");
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="App-container">
        <select
          value={currency}
          onChange={handleCurrencyChange}
        >
          <option value={"BTC_USD"}>BTC/USD</option>
          <option value={"ETH_USD"}>ETH/USD</option>
        </select>

      Market data:
      <RealTimePrice currency={currency} />
      Charting data:
      <HistoricalChart currency={currency} />
    </div>
  );
}

export default App;
