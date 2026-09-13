import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { UploadIcon, EmptyBoxIcon } from "../assets/Icons";

function getInitials(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function StudentManagement() {
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    studentClass: "",
    studentId: "",
    photo: "",
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, photo: "Please select an image file." });
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrors({
        ...errors,
        photo: "Image must be smaller than 1MB.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setStudent((prev) => ({ ...prev, photo: reader.result }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setStudent((prev) => ({ ...prev, photo: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!student.name.trim()) {
      newErrors.name = "Student name is required.";
    }

    if (!student.rollNo.trim()) {
      newErrors.rollNo = "Roll number is required.";
    } else {
      const duplicateRoll = students.some(
        (item) =>
          item.rollNo.trim().toLowerCase() ===
            student.rollNo.trim().toLowerCase() &&
          item.id !== editingId
      );

      if (duplicateRoll) {
        newErrors.rollNo = "This roll number is already used.";
      }
    }

    if (!student.studentClass.trim()) {
      newErrors.studentClass = "Class is required.";
    }

    if (!student.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    } else {
      const duplicateId = students.some(
        (item) =>
          item.studentId.trim().toLowerCase() ===
            student.studentId.trim().toLowerCase() &&
          item.id !== editingId
      );

      if (duplicateId) {
        newErrors.studentId = "This student ID is already used.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
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

      const savedResults = localStorage.getItem("results");

      if (savedResults) {
        const results = JSON.parse(savedResults);

        const updatedResults = results.map((item) =>
          item.studentId === editingId
            ? {
                ...item,
                studentName: student.name,
                rollNo: student.rollNo,
              }
            : item
        );

        localStorage.setItem(
          "results",
          JSON.stringify(updatedResults)
        );
      }

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
      photo: "",
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
        photo: selectedStudent.photo || "",
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

  const deleteStudent = (id) => {
    setStudents(
      students.filter((student) => student.id !== id)
    );

    const savedResults = localStorage.getItem("results");

    if (savedResults) {
      const results = JSON.parse(savedResults);

      const remainingResults = results.filter(
        (item) => item.studentId !== id
      );

      localStorage.setItem(
        "results",
        JSON.stringify(remainingResults)
      );
    }

    if (viewingStudent?.id === id) {
      setViewingStudent(null);
    }

    setConfirmDeleteId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrors({});

    setStudent({
      name: "",
      rollNo: "",
      studentClass: "",
      studentId: "",
      photo: "",
    });
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
    <>
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
          <div className="photo-upload-row">
            <div className="photo-preview">
              {student.photo ? (
                <img src={student.photo} alt="Preview" />
              ) : (
                <span>{getInitials(student.name)}</span>
              )}
            </div>

            <div className="photo-upload-actions">
              <label className="upload-btn">
                <UploadIcon />
                {student.photo ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>

              {student.photo && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={removePhoto}
                >
                  Remove
                </button>
              )}

              {errors.photo && (
                <span className="field-error">{errors.photo}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter student name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Roll Number</label>

              <input
                type="text"
                name="rollNo"
                value={student.rollNo}
                onChange={handleChange}
                placeholder="Enter roll number"
                className={errors.rollNo ? "input-error" : ""}
              />
              {errors.rollNo && (
                <span className="field-error">{errors.rollNo}</span>
              )}
            </div>

            <div className="form-group">
              <label>Class</label>

              <input
                type="text"
                name="studentClass"
                value={student.studentClass}
                onChange={handleChange}
                placeholder="Enter class"
                className={errors.studentClass ? "input-error" : ""}
              />
              {errors.studentClass && (
                <span className="field-error">
                  {errors.studentClass}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Student ID</label>

              <input
                type="text"
                name="studentId"
                value={student.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                className={errors.studentId ? "input-error" : ""}
              />
              {errors.studentId && (
                <span className="field-error">
                  {errors.studentId}
                </span>
              )}
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

      <section className="students-section">
        <div className="section-header">
          <h2>Student Records</h2>
          <span>{students.length} Students</span>
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

        {students.length === 0 ? (
          <div className="empty-state">
            <EmptyBoxIcon />
            <p>No students added yet.</p>
            <span>
              Add a student using the form above.
            </span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <EmptyBoxIcon />
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
                {filteredStudents.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="name-cell">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="avatar avatar-photo"
                          />
                        ) : (
                          <span className="avatar">
                            {getInitials(item.name)}
                          </span>
                        )}
                        {item.name}
                      </div>
                    </td>
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
                          setConfirmDeleteId(item.id)
                        }
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

      {viewingStudent && (
        <section className="details-card">
          <div className="details-header">
            <h2>Student Details</h2>

            <button
              className="close-btn"
              onClick={() =>
                setViewingStudent(null)
              }
            >
              ×
            </button>
          </div>

          {viewingStudent.photo ? (
            <img
              src={viewingStudent.photo}
              alt={viewingStudent.name}
              className="details-photo"
            />
          ) : (
            <div className="details-photo details-photo-fallback">
              {getInitials(viewingStudent.name)}
            </div>
          )}

          <div className="details-grid">
            <div>
              <span>Student Name</span>
              <strong>
                {viewingStudent.name}
              </strong>
            </div>

            <div>
              <span>Roll Number</span>
              <strong>
                {viewingStudent.rollNo}
              </strong>
            </div>

            <div>
              <span>Class</span>
              <strong>
                {viewingStudent.studentClass}
              </strong>
            </div>

            <div>
              <span>Student ID</span>
              <strong>
                {viewingStudent.studentId}
              </strong>
            </div>
          </div>
        </section>
      )}

      {confirmDeleteId !== null && (
        <ConfirmDialog
          title="Delete Student"
          message="Are you sure you want to delete this student? This action cannot be undone."
          onConfirm={() => deleteStudent(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  );
}

export default StudentManagement;
