import { useState } from "react";
import "./App.css";
import StudentManagement from "./components/StudentManagement";
import ResultManagement from "./components/ResultManagement";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <header className="header">
        <h1>Student Result Management System</h1>
        <p>Manage student records and academic results</p>
      </header>

      <nav className="navbar">
        <div className="nav-container">
          <button
            className={activePage === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "students" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("students")}
          >
            Students
          </button>

          <button
            className={activePage === "results" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActivePage("results")}
          >
            Results
          </button>
        </div>
      </nav>

      <main className="container">
        {activePage === "dashboard" && (
          <section className="dashboard">
            <h2>Dashboard</h2>
            <p>Welcome to Student Result Management System</p>

            <div className="dashboard-cards">
              <div
                className="dashboard-card"
                onClick={() => setActivePage("students")}
              >
                <h3>Students</h3>
                <p>Manage student records</p>
                <button>Open Students</button>
              </div>

              <div
                className="dashboard-card"
                onClick={() => setActivePage("results")}
              >
                <h3>Results</h3>
                <p>Manage academic results</p>
                <button>Open Results</button>
              </div>
            </div>
          </section>
        )}

        {activePage === "students" && (
          <StudentManagement />
        )}

        {activePage === "results" && (
          <ResultManagement />
        )}
      </main>
    </div>
  );
}

export default App;