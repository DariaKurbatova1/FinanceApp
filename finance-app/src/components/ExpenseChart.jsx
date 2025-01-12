/* eslint-disable react/prop-types */
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ expenses }) {
  const categoryTotals = {};
  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += parseFloat(expense.amount);
    } else {
      categoryTotals[expense.category] = parseFloat(expense.amount);
    }
  });

  const data = {
    labels: Object.keys(categoryTotals), 
    datasets: [
      {
        data: Object.values(categoryTotals), 
        backgroundColor: ['#8BC34A', '#4CAF50', '#388E3C', '#7B8D3C'], 
      },
    ],
  };

  return (
    <div>
      <h3>Expenses by Category</h3>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;
