import "./App.css";
import CurrencyTransfer from "./transfer/CurrencyTransfer";
import Transactions from "./transaction/Transactions";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfer" element={<CurrencyTransfer />} />
          <Route path="*" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
