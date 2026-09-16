import { useState } from "react";
import { EmptyBoxIcon } from "../assets/Icons";

function getInitials(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function calculatePercentage(obtained, total) {
  if (!total) return "0.0";
  return ((obtained / total) * 100).toFixed(1);
}

function getGrade(percentage) {
  const value = Number(percentage);

  if (value >= 90) return "A+";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  if (value >= 50) return "D";
  return "F";
}

function getStatus(percentage) {
  return Number(percentage) >= 40 ? "Pass" : "Fail";
}

function StudentPortal() {
  const [rollNo, setRollNo] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundStudent, setFoundStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();

    const savedStudents = localStorage.getItem("students");
    const savedResults = localStorage.getItem("results");

    const students = savedStudents ? JSON.parse(savedStudents) : [];
    const results = savedResults ? JSON.parse(savedResults) : [];

    const match = students.find(
      (item) =>
        item.rollNo.trim().toLowerCase() ===
        rollNo.trim().toLowerCase()
    );

    setSearched(true);

    if (!match) {
      setFoundStudent(null);
      setSubjects([]);
      return;
    }

    const studentResults = results.filter(
      (item) => item.studentId === match.id
    );

    setFoundStudent(match);
    setSubjects(studentResults);
  };

  const totalMarks = subjects.reduce(
    (sum, item) => sum + Number(item.totalMarks),
    0
  );

  const obtainedMarks = subjects.reduce(
    (sum, item) => sum + Number(item.obtainedMarks),
    0
  );

  const overallPercentage = calculatePercentage(
    obtainedMarks,
    totalMarks
  );

  const overallGrade = getGrade(overallPercentage);
  const overallStatus = getStatus(overallPercentage);

  return (
    <>
      <section className="form-card">
        <h2>Check Your Result</h2>
        <p>Enter your roll number to view your result.</p>

        <form onSubmit={handleSearch}>
          <div className="form-group" style={{ maxWidth: "320px" }}>
            <label>Roll Number</label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter your roll number"
              required
            />
          </div>

          <button type="submit">Search Result</button>
        </form>
      </section>

      {searched && !foundStudent && (
        <section className="students-section">
          <div className="empty-state">
            <EmptyBoxIcon />
            <p>No student found with this roll number.</p>
            <span>Please check the roll number and try again.</span>
          </div>
        </section>
      )}

      {foundStudent && (
        <section className="students-section">
          <div className="section-header">
            <h2>Result Found</h2>
          </div>

          <div className="name-cell" style={{ marginBottom: "20px" }}>
            {foundStudent.photo ? (
              <img
                src={foundStudent.photo}
                alt={foundStudent.name}
                className="avatar avatar-photo"
                style={{ width: "48px", height: "48px" }}
              />
            ) : (
              <span
                className="avatar"
                style={{ width: "48px", height: "48px", fontSize: "16px" }}
              >
                {getInitials(foundStudent.name)}
              </span>
            )}
            <div>
              <h3 style={{ marginBottom: "2px" }}>
                {foundStudent.name}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                Roll {foundStudent.rollNo} • {foundStudent.studentClass}
              </p>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              <EmptyBoxIcon />
              <p>No results published yet.</p>
              <span>Check back later.</span>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Total Marks</th>
                      <th>Obtained Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subjects.map((subject, index) => {
                      const percentage = calculatePercentage(
                        subject.obtainedMarks,
                        subject.totalMarks
                      );

                      return (
                        <tr key={subject.id}>
                          <td>{index + 1}</td>
                          <td>{subject.subject}</td>
                          <td>{subject.totalMarks}</td>
                          <td>{subject.obtainedMarks}</td>
                          <td>{percentage}%</td>
                          <td>
                            <span className="grade-status">
                              {getGrade(percentage)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th colSpan="2">Overall Result</th>
                      <th>{totalMarks}</th>
                      <th>{obtainedMarks}</th>
                      <th>{overallPercentage}%</th>
                      <th>{overallGrade}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <span className="grade-status">
                  Grade {overallGrade}
                </span>
                <span
                  className={
                    overallStatus === "Pass"
                      ? "pass-status"
                      : "fail-status"
                  }
                >
                  {overallStatus}
                </span>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}

export default StudentPortal;