import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

function getInitials(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function ResultManagement() {
  const [students, setStudents] = useState([]);

  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem("results");
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const [result, setResult] = useState({
    studentId: "",
    subject: "",
    totalMarks: "",
    obtainedMarks: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [printingStudent, setPrintingStudent] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (printingStudent) {
      const timer = setTimeout(() => {
        window.print();
      }, 100);

      const handleAfterPrint = () => setPrintingStudent(null);
      window.addEventListener("afterprint", handleAfterPrint);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("afterprint", handleAfterPrint);
      };
    }
  }, [printingStudent]);

  const handleChange = (e) => {
    setResult({
      ...result,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const resetForm = () => {
    setResult({
      studentId: "",
      subject: "",
      totalMarks: "",
      obtainedMarks: "",
    });

    setEditingId(null);
    setErrors({});
  };

  const validate = (selectedStudent, subjectName, totalMarks, obtainedMarks) => {
    const newErrors = {};

    if (!result.studentId) {
      newErrors.studentId = "Please select a student.";
    }

    if (!subjectName) {
      newErrors.subject = "Subject is required.";
    }

    if (result.totalMarks === "") {
      newErrors.totalMarks = "Total marks is required.";
    } else if (totalMarks <= 0) {
      newErrors.totalMarks = "Total marks must be greater than 0.";
    }

    if (result.obtainedMarks === "") {
      newErrors.obtainedMarks = "Obtained marks is required.";
    } else if (obtainedMarks < 0) {
      newErrors.obtainedMarks = "Obtained marks cannot be negative.";
    } else if (obtainedMarks > totalMarks) {
      newErrors.obtainedMarks =
        "Obtained marks cannot exceed total marks.";
    }

    if (selectedStudent && subjectName) {
      const duplicateSubject = results.some(
        (item) =>
          item.studentId === selectedStudent.id &&
          item.subject.trim().toLowerCase() ===
            subjectName.toLowerCase() &&
          item.id !== editingId
      );

      if (duplicateSubject) {
        newErrors.subject =
          "This subject already exists for this student.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subjectName = result.subject.trim();
    const totalMarks = Number(result.totalMarks);
    const obtainedMarks = Number(result.obtainedMarks);

    const selectedStudent = students.find(
      (student) => student.id === Number(result.studentId)
    );

    if (!validate(selectedStudent, subjectName, totalMarks, obtainedMarks)) {
      return;
    }

    if (editingId !== null) {
      setResults(
        results.map((item) =>
          item.id === editingId
            ? {
                ...item,
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                rollNo: selectedStudent.rollNo,
                subject: subjectName,
                totalMarks,
                obtainedMarks,
              }
            : item
        )
      );
    } else {
      const newResult = {
        id: Date.now(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        rollNo: selectedStudent.rollNo,
        subject: subjectName,
        totalMarks,
        obtainedMarks,
      };

      setResults([...results, newResult]);
    }

    resetForm();
  };

  const editResult = (id) => {
    const selectedResult = results.find(
      (item) => item.id === id
    );

    if (!selectedResult) {
      return;
    }

    setResult({
      studentId: String(selectedResult.studentId),
      subject: selectedResult.subject,
      totalMarks: String(selectedResult.totalMarks),
      obtainedMarks: String(selectedResult.obtainedMarks),
    });

    setEditingId(id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteResult = (id) => {
    setResults(
      results.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    setConfirmDeleteId(null);
  };

  const calculatePercentage = (obtained, total) => {
    if (!total) {
      return "0.0";
    }

    return ((obtained / total) * 100).toFixed(1);
  };

  const getStatus = (percentage) => {
    return Number(percentage) >= 40
      ? "Pass"
      : "Fail";
  };

  const getGrade = (percentage) => {
    const value = Number(percentage);

    if (value >= 90) {
      return "A+";
    }

    if (value >= 80) {
      return "A";
    }

    if (value >= 70) {
      return "B";
    }

    if (value >= 60) {
      return "C";
    }

    if (value >= 50) {
      return "D";
    }

    return "F";
  };

  const filteredResults = results.filter(
    (item) =>
      item.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.rollNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const studentSummaries = students
    .map((student) => {
      const studentResults = results.filter(
        (item) => item.studentId === student.id
      );

      if (studentResults.length === 0) {
        return null;
      }

      const totalMarks = studentResults.reduce(
        (sum, item) =>
          sum + Number(item.totalMarks),
        0
      );

      const obtainedMarks = studentResults.reduce(
        (sum, item) =>
          sum + Number(item.obtainedMarks),
        0
      );

      const percentage =
        totalMarks > 0
          ? (
              (obtainedMarks / totalMarks) *
              100
            ).toFixed(1)
          : "0.0";

      return {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        subjects: studentResults,
        totalMarks,
        obtainedMarks,
        percentage,
      };
    })
    .filter(Boolean);

  return (
    <>
      <section className="form-card result-form">
        <h2>
          {editingId !== null
            ? "Edit Student Result"
            : "Student Results"}
        </h2>

        <p>
          {editingId !== null
            ? "Update academic result below."
            : "Add academic result for a student."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Student</label>

              <select
                name="studentId"
                value={result.studentId}
                onChange={handleChange}
                className={errors.studentId ? "input-error" : ""}
              >
                <option value="" disabled>
                  Select student
                </option>

                {result.studentId && (
                  <option value="">
                    Clear Student
                  </option>
                )}

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name} - {student.rollNo}
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <span className="field-error">
                  {errors.studentId}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                value={result.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className={errors.subject ? "input-error" : ""}
              />
              {errors.subject && (
                <span className="field-error">{errors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label>Total Marks</label>

              <input
                type="number"
                name="totalMarks"
                value={result.totalMarks}
                onChange={handleChange}
                placeholder="Enter total marks"
                min="1"
                className={errors.totalMarks ? "input-error" : ""}
              />
              {errors.totalMarks && (
                <span className="field-error">
                  {errors.totalMarks}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Obtained Marks</label>

              <input
                type="number"
                name="obtainedMarks"
                value={result.obtainedMarks}
                onChange={handleChange}
                placeholder="Enter obtained marks"
                min="0"
                className={errors.obtainedMarks ? "input-error" : ""}
              />
              {errors.obtainedMarks && (
                <span className="field-error">
                  {errors.obtainedMarks}
                </span>
              )}
            </div>
          </div>

          <button type="submit">
            {editingId !== null
              ? "Update Result"
              : "Add Result"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="students-section">
        <div className="section-header">
          <h2>Results List</h2>

          <span>
            {filteredResults.length} Results
          </span>
        </div>

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

        {results.length === 0 ? (
          <div className="empty-state">
            <p>No results added yet.</p>

            <span>
              Add a result using the form above.
            </span>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="empty-state">
            <p>No matching result found.</p>

            <span>
              Try another student name or roll number.
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
                  <th>Subject</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((item, index) => {
                  const percentage =
                    calculatePercentage(
                      item.obtainedMarks,
                      item.totalMarks
                    );

                  const grade = getGrade(percentage);
                  const status = getStatus(percentage);

                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="name-cell">
                          <span className="avatar">
                            {getInitials(item.studentName)}
                          </span>
                          {item.studentName}
                        </div>
                      </td>

                      <td>{item.rollNo}</td>

                      <td>{item.subject}</td>

                      <td>{item.totalMarks}</td>

                      <td>{item.obtainedMarks}</td>

                      <td>{percentage}%</td>

                      <td>
                        <span className="grade-status">
                          {grade}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            status === "Pass"
                              ? "pass-status"
                              : "fail-status"
                          }
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() =>
                            editResult(item.id)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            setConfirmDeleteId(item.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {studentSummaries.length > 0 && (
        <section className="students-section">
          <div className="section-header">
            <h2>Student Result Summary</h2>

            <span>
              {studentSummaries.length} Students
            </span>
          </div>

          {studentSummaries.map((student) => {
            const status = getStatus(
              student.percentage
            );

            const grade = getGrade(
              student.percentage
            );

            return (
              <div
                key={student.id}
                style={{
                  marginBottom: "25px",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "18px",
                    background: "var(--input-bg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="name-cell">
                    <span className="avatar">
                      {getInitials(student.name)}
                    </span>
                    <div>
                      <h3>{student.name}</h3>

                      <p
                        style={{
                          marginTop: "5px",
                          color: "var(--muted)",
                        }}
                      >
                        Roll Number: {student.rollNo}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className="grade-status">
                      Grade {grade}
                    </span>

                    <span
                      className={
                        status === "Pass"
                          ? "pass-status"
                          : "fail-status"
                      }
                    >
                      {status}
                    </span>

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        setPrintingStudent(student)
                      }
                    >
                      Print Card
                    </button>
                  </div>
                </div>

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
                      {student.subjects.map(
                        (subject, index) => {
                          const percentage =
                            calculatePercentage(
                              subject.obtainedMarks,
                              subject.totalMarks
                            );

                          const grade =
                            getGrade(percentage);

                          return (
                            <tr key={subject.id}>
                              <td>{index + 1}</td>

                              <td>
                                {subject.subject}
                              </td>

                              <td>
                                {subject.totalMarks}
                              </td>

                              <td>
                                {subject.obtainedMarks}
                              </td>

                              <td>
                                {percentage}%
                              </td>

                              <td>
                                <span className="grade-status">
                                  {grade}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th colSpan="2">
                          Overall Result
                        </th>

                        <th>
                          {student.totalMarks}
                        </th>

                        <th>
                          {student.obtainedMarks}
                        </th>

                        <th>
                          {student.percentage}%
                        </th>

                        <th>
                          {grade}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {printingStudent && (
        <div className="print-card-overlay">
          <div className="print-card">
            <div className="print-card-header">
              <h2>Student Result Card</h2>
              <p>Official academic report</p>
            </div>

            <div className="print-card-info">
              <div>
                <span>Student Name</span>
                <strong>{printingStudent.name}</strong>
              </div>
              <div>
                <span>Roll Number</span>
                <strong>{printingStudent.rollNo}</strong>
              </div>
            </div>

            <table className="print-card-table">
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
                {printingStudent.subjects.map((subject, index) => {
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
                      <td>{getGrade(percentage)}</td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan="2">Overall Result</th>
                  <th>{printingStudent.totalMarks}</th>
                  <th>{printingStudent.obtainedMarks}</th>
                  <th>{printingStudent.percentage}%</th>
                  <th>
                    {getGrade(printingStudent.percentage)}
                  </th>
                </tr>
              </tfoot>
            </table>

            <div className="print-card-footer">
              <span>
                Status:{" "}
                {getStatus(printingStudent.percentage)}
              </span>
              <button
                type="button"
                className="cancel-btn no-print"
                onClick={() => setPrintingStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <ConfirmDialog
          title="Delete Result"
          message="Are you sure you want to delete this result? This action cannot be undone."
          onConfirm={() => deleteResult(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  );
}

export default ResultManagement;
