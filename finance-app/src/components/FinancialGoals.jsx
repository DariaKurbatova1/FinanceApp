import { useState, useEffect } from 'react';
import './FinancialGoals.css';
function FinancialGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', startDate: '', endDate: '' });
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/financial-goals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      setError('Failed to fetch goals.' + err);
    }
  };

  const handleAddGoal = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/financial-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newGoal),
      });

      if (!response.ok) throw new Error('Failed to add goal');

      const createdGoal = await response.json();
      setGoals([...goals, createdGoal]);
      setNewGoal({ name: '', targetAmount: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProgress = async (goalId, amount) => {
    try {
      const response = await fetch(`http://localhost:5001/api/financial-goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error('Failed to update progress');

      const updatedGoal = await response.json();
      setGoals(goals.map((goal) => (goal._id === goalId ? updatedGoal : goal)));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div>
      <h1>Savings Goals</h1>
      <p>Track your goals here</p>
      <div>
        <h3>Create a New Goal</h3>
        <input
          type="text"
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newGoal.startDate}
          onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={newGoal.endDate}
          onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
        />
        <button onClick={handleAddGoal}>Add Goal</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h3>Your Goals</h3>
        <div className="goal-cards">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <h4>{goal.name}</h4>
              <p>Target: ${goal.targetAmount}</p>
              <p>Progress: ${goal.progress}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${((goal.progress / goal.targetAmount) * 100).toFixed(2)}%`,
                  }}
                ></div>
              </div>
              <p>
                {((goal.progress / goal.targetAmount) * 100).toFixed(2)}% complete
              </p>
              <input
                type="number"
                placeholder="Add/Remove Amount"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateProgress(goal._id, parseFloat(e.target.value));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }
  
  export default FinancialGoals;