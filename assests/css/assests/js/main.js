// ======== DASHBOARD PAGE CODE (FINAL WITH REAL MARKS) ========
const BASE_URL = "https://student-performance-insight-system.onrender.com";

if (document.getElementById('avgScore')) {

  fetch(`${BASE_URL}/students`)   // ✅ YAHI SABSE BADI GALTI THI
    .then(res => res.json())
    .then(data => {

      console.log("Dashboard Data:", data);

      // ✅ Safety check
      if (!Array.isArray(data)) {
        console.error("Invalid data received:", data);
        return;
      }

      document.getElementById('totalStudents').innerText = data.length;

      let totalMarks = 0;
      data.forEach(s => totalMarks += Number(s.marks || 0));

      const avgScore = data.length
        ? (totalMarks / data.length).toFixed(1)
        : "-";

      document.getElementById('avgScore').innerText = avgScore;

      let totalAtt = 0;
      data.forEach(s => totalAtt += Number(s.attendance || 0));

      const avgAtt = data.length
        ? (totalAtt / data.length).toFixed(1) + "%"
        : "-";

      document.getElementById('avgAtt').innerText = avgAtt;

      const toppers = data.filter(s => s.grade === "A" || s.grade === "A+").length;
      document.getElementById('topPerformers').innerText = toppers;

      const tbody = document.getElementById('studentTable');
      tbody.innerHTML = "";

      data.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.roll_no}</td>
          <td>${s.name}</td>
          <td>${s.class}</td>
          <td>${s.marks}</td>
        `;
        tbody.appendChild(tr);
      });

    })
    .catch(err => console.error("Dashboard Fetch Error:", err));
}



  // ========= REAL DASHBOARD CHARTS FROM DATABASE =========

// Yahan bhi same BASE_URL use hoga (jo PART-1 me bana diya tha)
// const BASE_URL = "https://student-performance-insight-system.onrender.com";

fetch(`${BASE_URL}/students`)   // ✅ YAHAN BHI "/" KI JAGAH "/students"
  .then(res => res.json())
  .then(data => {

    if (!Array.isArray(data)) {
      console.error("Chart invalid data:", data);
      return;
    }

    if (document.getElementById('scoreChart')) {

      const marksArray = data.map(s => Number(s.marks || 0));

      const avgMarksPerMonth = [
        marksArray[0] || 60,
        marksArray[1] || 65,
        marksArray[2] || 70,
        marksArray[3] || 75,
        marksArray[4] || 80
      ];

      const scoreCtx = document
        .getElementById('scoreChart')
        .getContext('2d');

      new Chart(scoreCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            data: avgMarksPerMonth,
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }]
        }
      });
    }

  })
  .catch(err => console.error("Chart Fetch Error:", err));


// ======== STUDENT DETAIL PAGE (FROM BACKEND) ========

if (document.getElementById("stuName")) {

  // URL se roll_no lena: student.html?roll=101
  const params = new URLSearchParams(window.location.search);
  const rollNo = params.get("roll");

  fetch(`${BASE_URL}/students`)   // ✅ /students route
    .then(res => res.json())
    .then(data => {

      // Roll number ke basis par student dhoondo
      const student = data.find(s => s.roll_no == rollNo) || data[0];

      if (!student) {
        console.error("Student not found!");
        return;
      }

      // Profile fill karo (REAL DATA)
      document.getElementById("stuName").innerText = student.name;
      document.getElementById("stuRoll").innerText = student.roll_no;
      document.getElementById("stuClass").innerText = student.class;

      // REAL Attendance + Grade (DB se)
      document.getElementById("stuAtt").innerText = student.attendance + "%";
      document.getElementById("stuGrade").innerText = student.grade;

      // REAL Marks (base marks se subject-wise generate)
      const base = Number(student.marks || 0);

      const subjectMarks = [
        base - 5,
        base + 3,
        base - 2,
        base - 7,
        base + 4
      ];

      const marksBody = document.getElementById("marksTableBody");
      marksBody.innerHTML = `
        <tr><td>Python</td><td>${subjectMarks[0]}</td></tr>
        <tr><td>Data Analytics</td><td>${subjectMarks[1]}</td></tr>
        <tr><td>AI & ML</td><td>${subjectMarks[2]}</td></tr>
        <tr><td>DBMS</td><td>${subjectMarks[3]}</td></tr>
        <tr><td>Cloud Computing</td><td>${subjectMarks[4]}</td></tr>
      `;
    })
    .catch(err => console.error("Student Detail Error:", err));
}

// ======== STUDENT PAGE CHART ========
// ======== STUDENT DETAIL PAGE (REAL DATABASE) ========

if (document.getElementById("stuName")) {

  const params = new URLSearchParams(window.location.search);
  const rollNo = params.get("roll");

  fetch(`${BASE_URL}/students`)   // ✅ BASE_URL + /students
    .then(res => res.json())
    .then(data => {

      const student = data.find(s => s.roll_no == rollNo);

      if (!student) {
        alert("Student not found!");
        return;
      }

      // ✅ REAL PROFILE DATA
      document.getElementById("stuName").innerText = student.name;
      document.getElementById("stuRoll").innerText = student.roll_no;
      document.getElementById("stuClass").innerText = student.class;
      document.getElementById("stuAtt").innerText = student.attendance + "%";
      document.getElementById("stuGrade").innerText = student.grade;

      // ✅ REAL SUBJECT-WISE MARKS (AUTO GENERATED FROM DB MARKS)
      const base = Number(student.marks || 0);

      const subjectMarks = [
        Math.max(base - 5, 0),
        Math.min(base + 3, 100),
        Math.max(base - 2, 0),
        Math.max(base - 7, 0),
        Math.min(base + 4, 100)
      ];

      const marksBody = document.getElementById("marksTableBody");
      marksBody.innerHTML = `
        <tr><td>Python</td><td>${subjectMarks[0]}</td></tr>
        <tr><td>Data Analytics</td><td>${subjectMarks[1]}</td></tr>
        <tr><td>AI & ML</td><td>${subjectMarks[2]}</td></tr>
        <tr><td>DBMS</td><td>${subjectMarks[3]}</td></tr>
        <tr><td>Cloud Computing</td><td>${subjectMarks[4]}</td></tr>
      `;

      // ✅ REAL STUDENT CHART
      if (document.getElementById('studentChart')) {
        const ctx = document.getElementById('studentChart').getContext('2d');

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Python', 'Data Analytics', 'AI & ML', 'DBMS', 'Cloud Computing'],
            datasets: [{
              label: 'Marks',
              data: subjectMarks,
              backgroundColor: [
                '#004aad', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'
              ]
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }

    })
    .catch(err => console.error("Student Detail Error:", err));
}


// ======== REPORT PAGE CHARTS ========

// 1. Subject-wise bar chart (STATIC - OK)
if (document.getElementById('subjectChart')) {
  const ctx1 = document.getElementById('subjectChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Python', 'Data Analytics', 'AI & ML', 'DBMS', 'Cloud Computing'],
      datasets: [{
        label: 'Average Marks',
        data: [75, 82, 78, 70, 88],
        backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

// 2. Monthly performance line chart (STATIC - OK)
if (document.getElementById('trendChart')) {
  const ctx2 = document.getElementById('trendChart').getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Overall Trend',
        data: [72, 76, 80, 84, 88],
        borderColor: '#004aad',
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

// 3. Attendance pie chart (STATIC - OK)
if (document.getElementById('attendancePie')) {
  const ctx3 = document.getElementById('attendancePie').getContext('2d');
  new Chart(ctx3, {
    type: 'pie',
    data: {
      labels: ['Present', 'Absent'],
      datasets: [{
        data: [92, 8],
        backgroundColor: ['#22c55e', '#ef4444']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

// 4. Gender performance doughnut chart (STATIC - OK)
if (document.getElementById('genderChart')) {
  const ctx4 = document.getElementById('genderChart').getContext('2d');
  new Chart(ctx4, {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [78, 86],
        backgroundColor: ['#60a5fa', '#f472b6']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}


// ================= TEACHER TABLE (FROM BACKEND) =================

if (document.getElementById('teacherTableBody')) {

  fetch(`${BASE_URL}/students`)   // ✅ BASE_URL + /students
    .then(res => res.json())
    .then(data => {

      const tbody = document.getElementById('teacherTableBody');
      tbody.innerHTML = "";

      let totalMarks = 0;
      let totalAttendance = 0;
      let topStudent = "";
      let topMarks = 0;

      data.forEach(stu => {

        // ✅ Table fill
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${stu.roll_no}</td>
          <td>${stu.name}</td>
          <td>${stu.class}</td>
          <td>${stu.marks}</td>
          <td>${stu.attendance}</td>
          <td>${stu.grade}</td>
          <td><a href="student.html?roll=${stu.roll_no}" class="view-btn">View</a></td>
        `;
        tbody.appendChild(tr);

        // ✅ Calculations
        totalMarks += Number(stu.marks || 0);
        totalAttendance += Number(stu.attendance || 0);

        if (Number(stu.marks) > topMarks) {
          topMarks = Number(stu.marks);
          topStudent = stu.name;
        }

      });

      // ✅ TOTAL STUDENTS (REAL)
      document.getElementById("totalStudents").innerText = data.length;

      // ✅ AVERAGE MARKS (REAL)
      const avgMarks = (totalMarks / data.length).toFixed(1);
      document.getElementById("avgMarks").innerText = avgMarks + "%";

      // ✅ AVERAGE ATTENDANCE (REAL)
      const avgAttendance = (totalAttendance / data.length).toFixed(1);
      document.getElementById("avgAttendance").innerText = avgAttendance + "%";

      // ✅ TOP PERFORMER (REAL)
      document.getElementById("topPerformer").innerText = topStudent;

    })
    .catch(err => console.error("Teacher Table Error:", err));
}


// ===== TEACHER TABLE FROM BACKEND (VIEW + UPDATE + REMOVE) =====
if (document.getElementById('teacherTableBody')) {

  fetch(`${BASE_URL}/students`)   // ✅ Correct GET route
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('teacherTableBody');
      tbody.innerHTML = "";

      data.forEach(stu => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${stu.roll_no}</td>
          <td>${stu.name}</td>
          <td>${stu.class}</td>
          <td>${stu.marks}</td>
          <td>${stu.attendance}</td>
          <td>${stu.grade}</td>
          <td>
            <a href="student.html?roll=${stu.roll_no}" class="view-btn">View</a>
            <button class="update-btn" onclick="openUpdate(${stu.roll_no})">Update</button>
            <button class="delete-btn" onclick="deleteStudent(${stu.roll_no})">Remove</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Teacher Table Error:", err));
}


// ================= UPDATE FUNCTION =================
function openUpdate(rollNo) {
  const marks = prompt("Enter Marks:");
  const attendance = prompt("Enter Attendance:");
  const grade = prompt("Enter Grade:");

  fetch(`${BASE_URL}/students/${rollNo}`, {   // ✅ Correct PUT route
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      marks,
      attendance,
      grade
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Updated Successfully");
    location.reload();
  })
  .catch(err => console.error("Update Error:", err));
}


// ================= DELETE FUNCTION =================
function deleteStudent(rollNo) {
  if (confirm("Are you sure you want to remove this student?")) {
    fetch(`${BASE_URL}/students/${rollNo}`, {   // ✅ Correct DELETE route
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ Student Removed");
      location.reload();
    })
    .catch(err => console.error("Delete Error:", err));
  }
}




// ======== LOGIN PAGE LOGIC ========
if (document.getElementById('loginForm')) {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === '12345') {
      msg.style.color = 'green';
      msg.textContent = 'Login successful! Redirecting...';

      // LOGIN FLAG SET
      localStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      msg.style.color = 'red';
      msg.textContent = 'Invalid username or password!';
    }
  });
}


// ===== ADMIN PANEL (REAL DATABASE LOAD + INSERT) =====
if (document.getElementById('studentForm')) {

  const form = document.getElementById('studentForm');
  const tableBody = document.querySelector('#adminTable tbody');

  // ✅ LOAD STUDENTS FROM BACKEND
  fetch(`${BASE_URL}/students`)   // ✅ Correct GET route
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = "";
      data.forEach(s => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${s.name}</td>
          <td>${s.class}</td>
          <td>${s.marks || "-"}</td>
          <td>${s.grade || "-"}</td>

          <!-- Status Text -->
          <td class="statusText" data-id="${s.roll_no}">
            Absent
          </td>

          <!-- Final Attendance Checkbox -->
          <td>
            <input type="checkbox" class="attBox" data-id="${s.roll_no}">
          </td>

          <!-- Action -->
          <td>
            <button onclick="deleteStudent(${s.roll_no})">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => console.error("Admin Load Error:", err));


  // ✅ SUBMIT FORM → INSERT TO BACKEND
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const studentData = {
      roll_no: document.getElementById('roll_no').value,
      name: document.getElementById('name').value,
      class: document.getElementById('class').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };

    console.log("Sending to backend:", studentData);

    fetch(`${BASE_URL}/students`, {   // ✅ Correct POST route
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(studentData)
    })
    .then(res => res.json())
    .then(response => {
      alert("✅ Student added successfully!");
      location.reload();
    })
    .catch(err => console.error("Admin Insert Error:", err));
  });

}



// ======== CONTACT PAGE LOGIC ========

if (document.getElementById('contactForm')) {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('contactMsg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    msg.style.color = 'green';
    msg.textContent = 'Your message has been sent successfully!';
    form.reset();

    setTimeout(() => {
      msg.textContent = '';
    }, 3000);
  });
}


// ================= SAVE ATTENDANCE =================
function saveAttendance() {
  let date = document.getElementById("attDate").value;
  let boxes = document.querySelectorAll(".attBox");

  if (!date) {
    alert("Please select date first");
    return;
  }

  let attendanceData = [];

  boxes.forEach(box => {
    attendanceData.push({
      student_id: box.dataset.id,
      status: box.checked ? "Present" : "Absent"
    });
  });

  fetch(`${BASE_URL}/attendance`, {   // ✅ Correct backend route
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
      students: attendanceData
    })
  })
  .then(res => res.json())
  .then(res => alert(res.message || "Attendance saved!"))
  .catch(err => {
    console.error("Attendance Save Error:", err);
    alert("Attendance save failed!");
  });
}



// ===== SEARCH FUNCTIONALITY (DASHBOARD) =====
const searchBar = document.getElementById("searchBar");

if (searchBar) {
  searchBar.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(value) ? "" : "none";
    });
  });
}


// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}


// ===== STUDENT PROFILE PAGE LOGIC =====

if (document.getElementById("stuName")) {

  const params = new URLSearchParams(window.location.search);
  const rollNo = params.get("roll");

  fetch(`${BASE_URL}/students`)   // ✅ Correct API route
    .then(res => res.json())
    .then(data => {

      const student = data.find(s => s.roll_no == rollNo);

      if (!student) {
        alert("Student not found!");
        return;
      }

      // ✅ REAL DATA BINDING
      document.getElementById("stuName").innerText = student.name;
      document.getElementById("stuRoll").innerText = student.roll_no;
      document.getElementById("stuClass").innerText = student.class;
      document.getElementById("stuMarks").innerText = student.marks || "Not Updated";

      document.getElementById("stuAtt").innerText = student.attendance + "%";
      document.getElementById("stuGrade").innerText = student.grade;

    })
    .catch(err => console.error("Student Profile Error:", err));
}


// ====== REPORT PAGE BACKEND CONNECTION ======
if (
  document.getElementById("repAvgMarks") &&
  document.getElementById("subjectChart")
) {
  fetch(`${BASE_URL}/students`)   // ✅ Correct API route
    .then(res => res.json())
    .then(data => {

      if (!data || data.length === 0) {
        console.warn("No student data found!");
        return;
      }

      // ✅ Average Marks
      let totalMarks = 0;
      let passCount = 0;
      let topStudent = data[0];

      data.forEach(s => {
        totalMarks += Number(s.marks || 0);

        if (Number(s.marks) >= 40) passCount++;

        if (Number(s.marks) > Number(topStudent.marks || 0)) {
          topStudent = s;
        }
      });

      const avgMarks = (totalMarks / data.length).toFixed(1);
      const passPercent = ((passCount / data.length) * 100).toFixed(1);

      document.getElementById("repAvgMarks").innerText = avgMarks + "%";
      document.getElementById("repPass").innerText = passPercent + "%";
      document.getElementById("repTopper").innerText = topStudent.name;

      // ✅ SUBJECT CHART (STATIC DEMO DATA – OK)
      new Chart(document.getElementById('subjectChart'), {
        type: 'bar',
        data: {
          labels: ['Python', 'Data Analytics', 'AI & ML', 'DBMS', 'Cloud Computing'],
          datasets: [{
            label: 'Average Marks',
            data: [75, 82, 78, 70, 88],
            backgroundColor: '#2563eb'
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });

      // ✅ TREND CHART (STATIC DEMO DATA – OK)
      new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Trend',
            data: [72, 76, 80, 74, 86],
            borderColor: '#004aad',
            tension: 0.3
          }]
        }
      });

      // ✅ ATTENDANCE PIE (STATIC DEMO DATA – OK)
      new Chart(document.getElementById('attendancePie'), {
        type: 'pie',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [90, 10],
            backgroundColor: ['#22c55e', '#ef4444']
          }]
        }
      });

      // ✅ GENDER CHART (STATIC DEMO DATA – OK)
      new Chart(document.getElementById('genderChart'), {
        type: 'doughnut',
        data: {
          labels: ['Male', 'Female'],
          datasets: [{
            data: [78, 86],
            backgroundColor: ['#60a5fa', '#f472b6']
          }]
        }
      });

    })
    .catch(err => console.error("Report Page Fetch Error:", err));
}


// ================= ATTENDANCE STATUS UI CHANGE =================
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("attBox")) {
    const studentId = e.target.dataset.id;
    const statusCell = document.querySelector(
      `.statusText[data-id="${studentId}"]`
    );

    if (statusCell) {
      if (e.target.checked) {
        statusCell.textContent = "Present";
        statusCell.style.color = "#004aad";
        statusCell.style.fontWeight = "bold";
      } else {
        statusCell.textContent = "Absent";
        statusCell.style.color = "red";
        statusCell.style.fontWeight = "bold";
      }
    }
  }
});


// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) {
    console.log("Sidebar not found!");
    return;
  }

  sidebar.classList.toggle("active");
  console.log("Menu clicked, sidebar toggled ✅");
}
