import { useState } from "react";
import "./App.css";
import StudentManagement from "./components/StudentManagement";
import ResultManagement from "./components/ResultManagement";

function App() {
  const [activePage, setActivePage] = useState("students");

  return (
    <div className="app">
      <header className="header">
        <h1>Student Result Management System</h1>
        <p>Manage student records and academic results</p>
      </header>

      <nav className="navbar">
        <div className="nav-container">
          <button
            className={
              activePage === "students"
                ? "nav-btn active"
                : "nav-btn"
            }
            onClick={() => setActivePage("students")}
          >
            Students
          </button>

          <button
            className={
              activePage === "results"
                ? "nav-btn active"
                : "nav-btn"
            }
            onClick={() => setActivePage("results")}
          >
            Results
          </button>
        </div>
      </nav>

      <main className="container">
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