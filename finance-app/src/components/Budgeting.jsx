import { useState, useEffect } from 'react';

function Budgeting() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomes, setIncomes] = useState([]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate(new Date(year, month - 1));
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

  

  useEffect(() => {
    fetchIncomes();
  }, [selectedDate]);

  const month = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();

  return (
    <div>
      <h1>Budgeting</h1>
      <p>Track and manage your budget here</p>

      <label htmlFor="month-select">Select Month: </label>
      <input
        type="month"
        id="month-select"
        value={`${year}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
        onChange={handleMonthChange}
      />

      <p>Current Month: {month} {year}</p>

      <h2>Income</h2>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id}>
              <td>{income.source}</td>
              <td>{income.amount}</td>
              <td>{new Date(income.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Budgeting;
