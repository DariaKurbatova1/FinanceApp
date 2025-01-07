import { useState, useEffect } from 'react';

function IncomeTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomeSources, setIncomeSources] = useState([]);
  const [newSource, setNewSource] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [amount, setAmount] = useState("");
  const [incomes, setIncomes] = useState([]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate(new Date(year, month - 1));
  };
  const fetchIncomeSources = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5001/api/income-sources", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setIncomeSources(data);
  };
  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");
    const month = selectedDate.getMonth() + 1;  
    const year = selectedDate.getFullYear();   
    const response = await fetch(
      `http://localhost:5001/api/incomes?month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setIncomes(data);
  };
  const addIncomeSource = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5001/api/income-sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newSource }),
    });
    if (response.ok) {
      fetchIncomeSources();
      setNewSource("");
    }
  };
  const addIncome = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5001/api/incomes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source: selectedSource,
        amount: parseFloat(amount),
        date: selectedDate.toISOString(),
      }),
    });
    if (response.ok) {
      setAmount("");
      setSelectedSource("");
    }
  };

  useEffect(() => {
    fetchIncomeSources();
  }, []);
  useEffect(() => {
    fetchIncomes(); 
  }, [selectedDate]);

  const month = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
    return (
      <div>
        <h1>Income Tracking</h1>
        <p>Track your incomes here</p>
        <label htmlFor="month-select">Select Month: </label>
        <input
          type="month"
          id="month-select"
          value={`${year}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
          onChange={handleMonthChange}
        />

        <p>Current Month: {month} {year}</p>
        <div>
          <h2>Add Income Source</h2>
          <input
            type="text"
            value={newSource}
            placeholder="Source Name"
            onChange={(e) => setNewSource(e.target.value)}
          />
          <button onClick={addIncomeSource}>Add Source</button>
        </div>
        <div>
          <h2>Add Income</h2>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">Select Source</option>
            {incomeSources.map((source, index) => (
              <option key={index} value={source.source}>
                {source.source}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={addIncome}>Add Income</button>
        </div>

        <div>
        <h2>Incomes for {month} {year}</h2>
        <div>
          <h3>All Incomes</h3>
          <ul>
            {incomes.map((income, index) => (
              <li key={index}>
                Source: {income.source}, Amount: ${income.amount}, Date: {new Date(income.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      </div>
    );
  }
  
  export default IncomeTracking;