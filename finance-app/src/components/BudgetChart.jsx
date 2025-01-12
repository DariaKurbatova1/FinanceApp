/* eslint-disable react/prop-types */
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function BalanceChart({ data }) {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()), 
    datasets: [
      {
        label: 'Balance',
        data: data.map(item => item.balance), 
        borderColor: 'green',
        backgroundColor: 'white',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Balance Chart' },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default BalanceChart;
