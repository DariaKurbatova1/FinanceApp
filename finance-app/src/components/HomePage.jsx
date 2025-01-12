export default function HomePage(){
    return (
        <>
        <div className="home-intro">
            <h2>Welcome to Your Personal Finance Tracker</h2>
            <p>Keep track of your income, expenses, goals, and budgeting in one place.</p>
        </div>
        <div className="get-started">
            <h3>Start Tracking Your Finances Today!</h3>
            <a href="/login" className="get-started-button">Get Started</a>
        </div>
      </>
    )
}