import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function ExpenseTracking() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
    return (
      <div>
        <h1>Expense Tracking</h1>
        <p>Track your expenses here</p>
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
        <p>Your expenses for the month of: {month} {year}</p>
      </div>
    );
  }
  
  export default ExpenseTracking;