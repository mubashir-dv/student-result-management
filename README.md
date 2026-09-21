# Student Result Management System

A React-based web application for managing student records and academic results, built as part of the ZYNVEX internship program.

**Live Demo:** https://student-result-management-app-sand.vercel.app

---

## Overview

This system allows administrators to register students, record their academic results, and view performance analytics through an interactive dashboard. It also includes a public **Student Portal** where a student can look up their own result using their roll number, without any edit access.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Custom CSS (CSS variables, responsive design, dark mode)
- **Data Storage:** Browser LocalStorage (no backend required)
- **Deployment:** Vercel (continuous deployment from GitHub)

---

## Features by Module

### Module 1 — Project Setup & Student Management
- React project set up with Vite
- Responsive navigation bar/header
- Student registration form (Name, Roll Number, Class, Student ID)
- Form validation with inline, field-level error messages
- Student records table with Add, View, Edit, and Delete
- Duplicate Roll Number / Student ID prevention
- Fully responsive UI (mobile, tablet, desktop)

### Module 2 — Marks Management & Calculations
- Add academic results per student (subject, total marks, obtained marks)
- Marks validation (no negative marks, obtained marks cannot exceed total, duplicate subject prevention)
- Automatic Total Marks, Obtained Marks, and Percentage calculation
- Subject-wise marks table linked to each student

### Module 3 — Result Management & Search
- Automatic grade calculation (A+, A, B, C, D, F)
- Consistent Pass/Fail status aligned with grade thresholds
- Full result card per student (student info + subject-wise marks + total, percentage, grade)
- Search by student name or roll number (Students and Results pages)
- Edit and Delete for both students and results, with a confirmation dialog before deleting
- Editing or deleting a student automatically keeps their results in sync (name/roll updates propagate; deleting a student removes their results)
- Printable, professionally designed Result Card (branded header, class/roll/ID, issue date, status badge, signature lines) with **Print / Save as PDF**

### Module 4 — Dashboard, Local Storage & Finalization
- Dashboard with live statistics: Total Students, Total Results, Pass Rate, Average Score
- Grade distribution chart and list of recently added students
- Top performer highlight
- Full LocalStorage integration — all data persists after refresh
- **Student Portal:** public, read-only result lookup by roll number (no edit access)
- Dark mode toggle
- Optional student photo upload (shown across student list, details, results, and the result card)
- UI/UX polish: hover effects, zebra-striped tables, sticky table headers, smooth page transitions
- Mobile and desktop responsive testing completed
- Bug fixing (data-sync issues, grade/status consistency, layout issues on wide screens)
- Deployed live on Vercel

---

## Project Structure

```
student-result-management/
├── src/
│   ├── assets/
│   │   └── Icons.jsx            # Reusable inline SVG icon set
│   ├── components/
│   │   ├── Dashboard.jsx        # Stats, charts, recent activity
│   │   ├── StudentManagement.jsx
│   │   ├── ResultManagement.jsx
│   │   ├── StudentPortal.jsx    # Public read-only result lookup
│   │   └── ConfirmDialog.jsx    # Reusable delete confirmation
│   ├── App.jsx                  # Navigation and page routing
│   └── App.css                  # All application styling
└── README.md
```

---

## Running Locally

```bash
git clone <repository-url>
cd student-result-management
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Author

**Mubashir Ahmed**
Internship ID: ZYNVEX-CERT-1365
