import './Header.css'
function Header(){
  const handleLoginLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    } else {
      window.location.href = '/login';
    }
  };
  const isLoggedIn = localStorage.getItem('token');

  return (
    <header>
      <nav>
        <ul>
        <li><a href="#" onClick={handleLoginLogout}>{isLoggedIn ? 'Logout' : 'Login'}</a></li>
          <li><a href="/expenses">Expense Tracking</a></li>
          <li><a href="/budgeting">Budgeting</a></li>
          <li><a href="/income">Income Tracking</a></li>
          <li><a href="/goals">Financial Goals</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;