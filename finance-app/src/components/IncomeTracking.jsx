import { useState, useEffect } from 'react';

function IncomeTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomeSources, setIncomeSources] = useState([]);
  const [newSource, setNewSource] = useState("");

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

  useEffect(() => {
    fetchIncomeSources();
  }, []);

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
        <h2>Incomes for {month} {year}</h2>
        <div>
          <h2>Income Sources</h2>
          <ul>
            {incomeSources.map((source, index) => (
              <li key={index}>{source.source}</li> 
            ))}
          </ul>
        </div>
      </div>
      </div>
    );
  }
  
  export default IncomeTracking;