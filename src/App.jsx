import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    studentClass: "",
    studentId: "",
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !student.name ||
      !student.rollNo ||
      !student.studentClass ||
      !student.studentId
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newStudent = {
      ...student,
      id: Date.now(),
    };

    setStudents([...students, newStudent]);

    setStudent({
      name: "",
      rollNo: "",
      studentClass: "",
      studentId: "",
    });
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div>
      <header className="header">
        <h1>Student Result Management System</h1>
        <p>Manage student records and academic results</p>
      </header>

      <main className="container">
        <section className="form-card">
          <h2>Add New Student</h2>
          <p>Enter student information below.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  name="name"
                  value={student.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                />
              </div>

              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={student.rollNo}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                />
              </div>

              <div className="form-group">
                <label>Class</label>
                <input
                  type="text"
                  name="studentClass"
                  value={student.studentClass}
                  onChange={handleChange}
                  placeholder="Enter class"
                />
              </div>

              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={student.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                />
              </div>
            </div>

            <button type="submit">Add Student</button>
          </form>
        </section>

        <section className="students-section">
          <div className="section-header">
            <h2>Student Records</h2>
            <span>{students.length} Students</span>
          </div>

          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students added yet.</p>
              <span>Add a student using the form above.</span>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Class</th>
                    <th>Student ID</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.rollNo}</td>
                      <td>{item.studentClass}</td>
                      <td>{item.studentId}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteStudent(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;