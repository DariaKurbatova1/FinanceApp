
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import LoginPage from './components/LoginPage';
import ExpenseTracking from './components/ExpenseTracking';
import Budgeting from './components/Budgeting';
import IncomeTracking from './components/IncomeTracking';
import FinancialGoals from './components/FinancialGoals';
function App() {

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/expenses" element={<ExpenseTracking />} />
        <Route path="/budgeting" element={<Budgeting />} />
        <Route path="/income" element={<IncomeTracking />} />
        <Route path="/goals" element={<FinancialGoals />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
