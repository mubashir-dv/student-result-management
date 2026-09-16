import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import StudentManagement from "./components/StudentManagement";
import ResultManagement from "./components/ResultManagement";
import StudentPortal from "./components/StudentPortal";
import { LogoIcon } from "./assets/Icons";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <LogoIcon size={26} />
          <h1>Student Result Management System</h1>
        </div>
        <p>Manage student records and academic results</p>
      </header>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-links">
            <button
              className={
                activePage === "dashboard"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>

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

            <button
              className={
                activePage === "portal"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => setActivePage("portal")}
            >
              Check Result
            </button>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      <main className="container">
        <div key={activePage} className="page-fade">
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "students" && <StudentManagement />}
          {activePage === "results" && <ResultManagement />}
          {activePage === "portal" && <StudentPortal />}
        </div>
      </main>
    </div>
  );
}

export default App;