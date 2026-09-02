import { useEffect, useState } from "react";

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

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "results",
      JSON.stringify(results)
    );
  }, [results]);

  const handleChange = (e) => {
    setResult({
      ...result,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !result.studentId ||
      !result.subject ||
      !result.totalMarks ||
      !result.obtainedMarks
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (
      Number(result.obtainedMarks) >
      Number(result.totalMarks)
    ) {
      alert(
        "Obtained marks cannot be greater than total marks."
      );
      return;
    }

    const selectedStudent = students.find(
      (student) =>
        student.id === Number(result.studentId)
    );

    if (!selectedStudent) {
      alert("Please select a student.");
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
                subject: result.subject,
                totalMarks: Number(result.totalMarks),
                obtainedMarks: Number(
                  result.obtainedMarks
                ),
              }
            : item
        )
      );

      setEditingId(null);
    } else {
      const newResult = {
        id: Date.now(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        subject: result.subject,
        totalMarks: Number(result.totalMarks),
        obtainedMarks: Number(result.obtainedMarks),
      };

      setResults([...results, newResult]);
    }

    setResult({
      studentId: "",
      subject: "",
      totalMarks: "",
      obtainedMarks: "",
    });
  };

  const editResult = (id) => {
    const selectedResult = results.find(
      (item) => item.id === id
    );

    if (selectedResult) {
      setResult({
        studentId: String(selectedResult.studentId),
        subject: selectedResult.subject,
        totalMarks: String(selectedResult.totalMarks),
        obtainedMarks: String(
          selectedResult.obtainedMarks
        ),
      });

      setEditingId(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setResult({
      studentId: "",
      subject: "",
      totalMarks: "",
      obtainedMarks: "",
    });
  };

  const deleteResult = (id) => {
    setResults(
      results.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }
  };

  const calculatePercentage = (
    obtained,
    total
  ) => {
    return ((obtained / total) * 100).toFixed(1);
  };

  const getStatus = (obtained, total) => {
    const percentage =
      (obtained / total) * 100;

    return percentage >= 40 ? "Pass" : "Fail";
  };

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
              >
                <option value="">
                  Select student
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name} -{" "}
                    {student.rollNo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                value={result.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
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
              />
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
              />
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
              onClick={cancelEdit}
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
            {results.length} Results
          </span>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <p>No results added yet.</p>

            <span>
              Add a result using the form above.
            </span>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Subject</th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item, index) => {
                  const percentage =
                    calculatePercentage(
                      item.obtainedMarks,
                      item.totalMarks
                    );

                  const status = getStatus(
                    item.obtainedMarks,
                    item.totalMarks
                  );

                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>{item.studentName}</td>

                      <td>{item.subject}</td>

                      <td>{item.totalMarks}</td>

                      <td>{item.obtainedMarks}</td>

                      <td>{percentage}%</td>

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
                            deleteResult(item.id)
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
    </>
  );
}

export default ResultManagement;