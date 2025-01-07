
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import LoginPage from './components/LoginPage';
function App() {

  return (
    <>
    <Router>
      <h1>Finance App</h1>
      <Header/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
