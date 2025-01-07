
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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
        <Link to="/">
          <h1>Finance App</h1> 
        </Link>
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
