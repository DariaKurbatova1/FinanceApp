
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header'
import LoginPage from './components/LoginPage';
import ExpenseTracking from './components/ExpenseTracking';
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
      </Routes>
      </Router>
    </>
  )
}

export default App
