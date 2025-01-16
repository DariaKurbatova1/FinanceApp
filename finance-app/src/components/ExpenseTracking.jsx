import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import ExpenseChart from './ExpenseChart';
import './ExpenseTracking.css'

import 'react-calendar/dist/Calendar.css';
function ExpenseTracking() {
  const [date, setDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [category, setCategory] = useState('');



  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/expenses?month=${date.getMonth() + 1}&year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses(data);
      } else {
        setError(data.message || 'Error fetching expenses');
      }
    };

    fetchExpenses();
  }, [date, year]);

  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`http://localhost:5001/api/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setExpenses(expenses.filter(expense => expense._id !== expenseId));
    } else {
      setError('Error deleting expense');
    }
  };


  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const expenseData = { description, amount, category, date: date.toISOString() };

    const response = await fetch('http://localhost:5001/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    });

    const data = await response.json();
    if (response.ok) {
      setExpenses([...expenses, data]);
      setDescription('');
      setAmount('');
      setCategory('');
      setIsAddingExpense(false);
    } else {
      setError(data.message || 'Error adding expense');
    }
  };


    return (
      <div>
        <h1>Expense Tracking</h1>
        <p>Track your expenses here</p>
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
        <p>Your expenses for the month of: {month} {year}</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isAddingExpense ? (
        <form onSubmit={handleAddExpense}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
          </select>
          <button type="submit">Add Expense</button>
          <button type="button" onClick={() => setIsAddingExpense(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setIsAddingExpense(true)}>Add Expense</button>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>${expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
                <td>
                  <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExpenseChart expenses={expenses}/>
      </div>
    );
  }
  
  export default ExpenseTracking;