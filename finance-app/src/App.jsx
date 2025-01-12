
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'
import LoginPage from './components/LoginPage';
import ExpenseTracking from './components/ExpenseTracking';
import Budgeting from './components/Budgeting';
import IncomeTracking from './components/IncomeTracking';
import FinancialGoals from './components/FinancialGoals';
import HomePage from './components/HomePage'
function App() {

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <>
    <Router>
      <header>
      <a href="/" className="logo-link">
        <img
          src="./public/finance-app.png"
          alt="Personal Finance Logo"
          className="logo-img"
        />
      </a>
      </header>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/expenses" element={isLoggedIn ? <ExpenseTracking /> : <Navigate to="/login" />} />
          <Route path="/budgeting" element={isLoggedIn ? <Budgeting /> : <Navigate to="/login" />} />
          <Route path="/income" element={isLoggedIn ? <IncomeTracking /> : <Navigate to="/login" />} />
          <Route path="/goals" element={isLoggedIn ? <FinancialGoals /> : <Navigate to="/login" />} />
      </Routes>
      </Router>

      
    </>
  )
}

export default App
