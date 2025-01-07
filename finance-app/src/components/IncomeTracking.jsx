import { useState } from 'react';

function IncomeTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedDate(new Date(year, month - 1));
  };

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
      </div>
    );
  }
  
  export default IncomeTracking;