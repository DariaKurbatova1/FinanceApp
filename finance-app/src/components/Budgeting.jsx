import { useState, useEffect } from 'react';

function Budgeting() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate(new Date(year, month - 1));
  };
  const calculateTotal = (items, field) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i][field];
    }
    return total;
  };
  
  const totalIncome = calculateTotal(incomes, 'amount');
  const totalExpenses = calculateTotal(expenses, 'amount');
  const balance = totalIncome - totalExpenses;

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

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const response = await fetch(
      `http://localhost:5001/api/expenses?month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setExpenses(data);
  };
  

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
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

      <h2>Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Total Income</th>
            <th>Total Expenses</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${totalIncome.toFixed(2)}</td>
            <td>${totalExpenses.toFixed(2)}</td>
            <td style={{ color: balance >= 0 ? 'green' : 'red' }}>
              ${balance.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

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

      <h2>Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Budgeting;
