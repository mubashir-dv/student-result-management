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

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

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

    if (editingId !== null) {
      setStudents(
        students.map((item) =>
          item.id === editingId
            ? { ...student, id: editingId }
            : item
        )
      );

      setEditingId(null);
    } else {
      const newStudent = {
        ...student,
        id: Date.now(),
      };

      setStudents([...students, newStudent]);
    }

    setStudent({
      name: "",
      rollNo: "",
      studentClass: "",
      studentId: "",
    });
  };

  const editStudent = (id) => {
    const selectedStudent = students.find(
      (item) => item.id === id
    );

    if (selectedStudent) {
      setStudent({
        name: selectedStudent.name,
        rollNo: selectedStudent.rollNo,
        studentClass: selectedStudent.studentClass,
        studentId: selectedStudent.studentId,
      });

      setEditingId(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const viewStudent = (id) => {
    const selectedStudent = students.find(
      (item) => item.id === id
    );

    setViewingStudent(selectedStudent);
  };

  const closeStudentDetails = () => {
    setViewingStudent(null);
  };

  const cancelEdit = () => {
    setEditingId(null);

    setStudent({
      name: "",
      rollNo: "",
      studentClass: "",
      studentId: "",
    });
  };

  const deleteStudent = (id) => {
    setStudents(
      students.filter((student) => student.id !== id)
    );

    if (viewingStudent?.id === id) {
      setViewingStudent(null);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.rollNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="header">
        <h1>Student Result Management System</h1>
        <p>Manage student records and academic results</p>
      </header>

      <main className="container">

        {/* Add / Edit Student Form */}
        <section className="form-card">
          <h2>
            {editingId !== null
              ? "Edit Student"
              : "Add New Student"}
          </h2>

          <p>
            {editingId !== null
              ? "Update student information below."
              : "Enter student information below."}
          </p>

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

            <button type="submit">
              {editingId !== null
                ? "Update Student"
                : "Add Student"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Student Records */}
        <section className="students-section">

          <div className="section-header">
            <h2>Student Records</h2>
            <span>{students.length} Students</span>
          </div>

          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students added yet.</p>
              <span>
                Add a student using the form above.
              </span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <p>No matching student found.</p>
              <span>
                Try another name or roll number.
              </span>
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
                  {filteredStudents.map(
                    (item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>{item.name}</td>

                        <td>{item.rollNo}</td>

                        <td>{item.studentClass}</td>

                        <td>{item.studentId}</td>

                        <td>
                          <button
                            className="view-btn"
                            onClick={() =>
                              viewStudent(item.id)
                            }
                          >
                            View
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editStudent(item.id)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteStudent(item.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

            </div>
          )}
        </section>

        {/* Student Details */}
        {viewingStudent && (
          <section className="details-card">
            <div className="details-header">
              <h2>Student Details</h2>

              <button
                className="close-btn"
                onClick={closeStudentDetails}
              >
                ×
              </button>
            </div>

            <div className="details-grid">
              <div>
                <span>Student Name</span>
                <strong>{viewingStudent.name}</strong>
              </div>

              <div>
                <span>Roll Number</span>
                <strong>{viewingStudent.rollNo}</strong>
              </div>

              <div>
                <span>Class</span>
                <strong>{viewingStudent.studentClass}</strong>
              </div>

              <div>
                <span>Student ID</span>
                <strong>{viewingStudent.studentId}</strong>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;