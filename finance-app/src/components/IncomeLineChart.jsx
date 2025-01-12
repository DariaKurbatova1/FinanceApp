/* eslint-disable react/prop-types */
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function IncomeChart({ incomes }) {
  //sort by date
  const sortedIncomes = incomes.sort((a, b) => new Date(a.date) - new Date(b.date));

  let cumulativeIncome = 0;
  const incomeData = sortedIncomes.map((income) => {
    cumulativeIncome += income.amount; 
    return cumulativeIncome; 
  });

  const chartData = {
    labels: sortedIncomes.map((income) => new Date(income.date).toLocaleDateString()), 
    datasets: [
      {
        label: 'Cumulative Income for the Month',
        data: incomeData,  
        borderColor: 'green',
        backgroundColor: 'rgba(144, 238, 144, 0.6)', 
        fill: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ width: '500px', height: '300px' }}>
      <Line data={chartData} />
    </div>
  );
}

export default IncomeChart;
