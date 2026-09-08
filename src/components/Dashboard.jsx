import { useEffect, useState } from "react";

function getInitials(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    const savedResults = localStorage.getItem("results");

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  const getPercentage = (obtained, total) => {
    if (!total) return 0;
    return (Number(obtained) / Number(total)) * 100;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  // Per-student overall percentage (average across their subjects)
  const studentStats = students.map((student) => {
    const subjectResults = results.filter(
      (r) => r.studentId === student.id
    );

    if (subjectResults.length === 0) {
      return { ...student, percentage: null, grade: null };
    }

    const totalMarks = subjectResults.reduce(
      (sum, r) => sum + Number(r.totalMarks),
      0
    );
    const obtainedMarks = subjectResults.reduce(
      (sum, r) => sum + Number(r.obtainedMarks),
      0
    );
    const percentage = getPercentage(obtainedMarks, totalMarks);

    return { ...student, percentage, grade: getGrade(percentage) };
  });

  const gradedStudents = studentStats.filter(
    (s) => s.percentage !== null
  );

  const passCount = gradedStudents.filter(
    (s) => s.percentage >= 40
  ).length;

  const passRate =
    gradedStudents.length > 0
      ? ((passCount / gradedStudents.length) * 100).toFixed(1)
      : "0.0";

  const avgPercentage =
    gradedStudents.length > 0
      ? (
          gradedStudents.reduce((sum, s) => sum + s.percentage, 0) /
          gradedStudents.length
        ).toFixed(1)
      : "0.0";

  const gradeBuckets = ["A+", "A", "B", "C", "D", "F"];
  const gradeCounts = gradeBuckets.map(
    (grade) => gradedStudents.filter((s) => s.grade === grade).length
  );
  const maxCount = Math.max(1, ...gradeCounts);

  const topStudent = gradedStudents.reduce(
    (top, s) => (!top || s.percentage > top.percentage ? s : top),
    null
  );

  const recentStudents = [...students].reverse().slice(0, 5);

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <p>Overview of student performance and records.</p>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Total Students</span>
          <strong className="stat-value">{students.length}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Results</span>
          <strong className="stat-value">{results.length}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pass Rate</span>
          <strong className="stat-value stat-success">
            {passRate}%
          </strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Average Score</span>
          <strong className="stat-value">{avgPercentage}%</strong>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="chart-card">
          <h3>Grade Distribution</h3>

          {gradedStudents.length === 0 ? (
            <div className="empty-state">
              <p>No graded results yet.</p>
              <span>Add results to see the distribution.</span>
            </div>
          ) : (
            <div className="bar-chart">
              {gradeBuckets.map((grade, i) => (
                <div className="bar-column" key={grade}>
                  <span className="bar-count">{gradeCounts[i]}</span>
                  <div
                    className={`bar bar-${grade.replace("+", "plus")}`}
                    style={{
                      height: `${(gradeCounts[i] / maxCount) * 100}%`,
                    }}
                  />
                  <span className="bar-label">{grade}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Recently Added Students</h3>

          {recentStudents.length === 0 ? (
            <div className="empty-state">
              <p>No students added yet.</p>
              <span>Add a student to get started.</span>
            </div>
          ) : (
            <ul className="mini-list">
              {recentStudents.map((student) => (
                <li key={student.id} className="mini-list-item">
                  <span className="avatar">
                    {getInitials(student.name)}
                  </span>
                  <div className="mini-list-info">
                    <strong>{student.name}</strong>
                    <span>
                      Roll {student.rollNo} • {student.studentClass}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {topStudent && (
            <div className="top-student-banner">
              <span className="avatar avatar-accent">
                {getInitials(topStudent.name)}
              </span>
              <div>
                <strong>{topStudent.name}</strong> is the top
                performer with{" "}
                <strong>{topStudent.percentage.toFixed(1)}%</strong>{" "}
                ({topStudent.grade})
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
export { getInitials };