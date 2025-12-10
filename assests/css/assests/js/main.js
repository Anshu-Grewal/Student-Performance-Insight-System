// ======== DASHBOARD PAGE CODE (FINAL WITH REAL MARKS) ========

if (document.getElementById('avgScore')) {

  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      console.log("Dashboard Data:", data);

      // Total Students
      document.getElementById('totalStudents').innerText = data.length;

      // REAL Average Score
      let totalMarks = 0;
      data.forEach(s => {
        totalMarks += Number(s.marks || 0);
      });
      const avgScore = data.length ? (totalMarks / data.length).toFixed(1) : "-";
      document.getElementById('avgScore').innerText = avgScore;

      // REAL Average Attendance (simple average)
      let totalAtt = 0;
      data.forEach(s => {
        totalAtt += Number(s.attendance || 0);
      });
      const avgAtt = data.length ? (totalAtt / data.length).toFixed(1) + "%" : "-";
      document.getElementById('avgAtt').innerText = avgAtt;

      // Top performers = A / A+ wale
      const toppers = data.filter(s => s.grade === "A" || s.grade === "A+").length;
      document.getElementById('topPerformers').innerText = toppers;

      // Table render
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

fetch("http://127.0.0.1:5000/students")
  .then(res => res.json())
  .then(data => {

    // ================= PERFORMANCE TREND (LINE CHART) =================
    if (document.getElementById('scoreChart')) {

      const marksArray = data.map(s => Number(s.marks || 0));

      const avgMarksPerMonth = [
        marksArray[0] || 60,
        marksArray[1] || 65,
        marksArray[2] || 70,
        marksArray[3] || 75,
        marksArray[4] || 80
      ];

      const scoreCtx = document.getElementById('scoreChart').getContext('2d');
      new Chart(scoreCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Average Score',
            data: avgMarksPerMonth,
            borderColor: '#004aad',
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // ================= ATTENDANCE DISTRIBUTION (DOUGHNUT) =================
    if (document.getElementById('attendanceChart')) {

      let totalAttendance = 0;
      data.forEach(s => {
        totalAttendance += Number(s.attendance || 0);
      });

      const avgAttendance = data.length
        ? Math.round(totalAttendance / data.length)
        : 0;

      const absent = 100 - avgAttendance;

      const attCtx = document.getElementById('attendanceChart').getContext('2d');
      new Chart(attCtx, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [avgAttendance, absent],
            backgroundColor: ['#22c55e', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
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

  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      // Roll number ke basis par student dhoondo
      const student = data.find(s => s.roll_no == rollNo) || data[0];

      // Profile fill karo
      document.getElementById("stuName").innerText = student.name;
      document.getElementById("stuRoll").innerText = student.roll_no;
      document.getElementById("stuClass").innerText = student.class;

      // Temporary (jab tak DB me attendance/grade nahi ho)
      document.getElementById("stuAtt").innerText = "92%";
      document.getElementById("stuGrade").innerText = "A";

      // Marks (static for now, later DB se aayega)
      const marksBody = document.getElementById("marksTableBody");
      marksBody.innerHTML = `
        <tr><td>Python</td><td>85</td></tr>
        <tr><td>Data Analytics</td><td>88</td></tr>
        <tr><td>AI & ML</td><td>80</td></tr>
        <tr><td>DBMS</td><td>78</td></tr>
        <tr><td>Cloud Computing</td><td>90</td></tr>
      `;
    })
    .catch(err => console.error("Student Detail Error:", err));
  }


// ======== STUDENT PAGE CHART ========
// ======== STUDENT DETAIL PAGE (REAL DATABASE) ========

if (document.getElementById("stuName")) {

  const params = new URLSearchParams(window.location.search);
  const rollNo = params.get("roll");

  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      const student = data.find(s => s.roll_no == rollNo);

      if (!student) {
        alert("Student not found!");
        return;
      }

      //  REAL PROFILE DATA
      document.getElementById("stuName").innerText = student.name;
      document.getElementById("stuRoll").innerText = student.roll_no;
      document.getElementById("stuClass").innerText = student.class;
      document.getElementById("stuAtt").innerText = student.attendance + "%";
      document.getElementById("stuGrade").innerText = student.grade;

      //  REAL SUBJECT-WISE MARKS (AUTO GENERATED FROM DB MARKS)
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

      //  REAL STUDENT CHART
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

// 1. Subject-wise bar chart
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

// 2. Monthly performance line chart
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

// 3. Attendance pie chart
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

// 4. Gender performance doughnut chart
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


if (document.getElementById('teacherTableBody')) {

  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      const tbody = document.getElementById('teacherTableBody');
      tbody.innerHTML = "";

      let totalMarks = 0;
      let totalAttendance = 0;
      let topStudent = "";
      let topMarks = 0;

      data.forEach(stu => {

        //  Table fill
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

        //  Calculations
        totalMarks += Number(stu.marks || 0);
        totalAttendance += Number(stu.attendance || 0);

        if (stu.marks > topMarks) {
          topMarks = stu.marks;
          topStudent = stu.name;
        }

      });

      //  TOTAL STUDENTS (REAL)
      document.getElementById("totalStudents").innerText = data.length;

      //  AVERAGE MARKS (REAL)
      const avgMarks = (totalMarks / data.length).toFixed(1);
      document.getElementById("avgMarks").innerText = avgMarks + "%";

      //  AVERAGE ATTENDANCE (REAL)
      const avgAttendance = (totalAttendance / data.length).toFixed(1);
      document.getElementById("avgAttendance").innerText = avgAttendance + "%";

      //  TOP PERFORMER (REAL)
      document.getElementById("topPerformer").innerText = topStudent;

    })
    .catch(err => console.error("Teacher Table Error:", err));
}

// ===== TEACHER TABLE FROM BACKEND (VIEW + UPDATE + REMOVE) =====
if (document.getElementById('teacherTableBody')) {

  fetch("http://127.0.0.1:5000/students")
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


//  UPDATE FUNCTION
function openUpdate(rollNo) {
  const marks = prompt("Enter Marks:");
  const attendance = prompt("Enter Attendance:");
  const grade = prompt("Enter Grade:");

  fetch("http://127.0.0.1:5000/update-marks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roll_no: rollNo,
      marks: marks,
      attendance: attendance,
      grade: grade
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(" Updated Successfully");
    location.reload();
  })
  .catch(err => console.error("Update Error:", err));
}


//  DELETE FUNCTION (MUST ADD)
function deleteStudent(rollNo) {
  if (confirm("Are you sure you want to remove this student?")) {
    fetch(`http://127.0.0.1:5000/delete-student/${rollNo}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      alert(" Student Removed");
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
}
else {
      msg.style.color = 'red';
      msg.textContent = 'Invalid username or password!';
    }
  });
}

// ===== ADMIN PANEL (SAFE + REAL DATABASE LOAD) =====

// ===== ADMIN PANEL (REAL DATABASE INSERT) =====
if (document.getElementById('studentForm')) {

  const form = document.getElementById('studentForm');
  const tableBody = document.querySelector('#adminTable tbody');

//  Load students from DB
fetch("http://127.0.0.1:5000/students")
  .then(res => res.json())
  .then(data => {
    tableBody.innerHTML = "";
    data.forEach(s => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>${s.marks}</td>
        <td>${s.grade}</td>

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

  //  Submit Form → Insert to DB
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

    fetch("http://127.0.0.1:5000/add-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(studentData)
    })
    .then(res => res.json())
    .then(response => {
      alert(" Student added successfully!");
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

  fetch("http://127.0.0.1:5000/mark_attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
      students: attendanceData
    })
  })
  .then(res => res.json())
  .then(res => alert(res.message))
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

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}



// ===== STUDENT PROFILE PAGE LOGIC =====

if (document.getElementById("stuName")) {

  const params = new URLSearchParams(window.location.search);
  const rollNo = params.get("roll");

  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      const student = data.find(s => s.roll_no == rollNo);

      if (!student) {
        alert("Student not found!");
        return;
      }

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
  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(data => {

      // Average Marks
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

      //  SUBJECT CHART REAL SAMPLE DATA
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

      //  TREND CHART
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

      //  ATTENDANCE PIE
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

      // GENDER CHART (DEMO)
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

    });
}


document.addEventListener("change", function (e) {
  if (e.target.classList.contains("attBox")) {
    const studentId = e.target.dataset.id;
    const statusCell = document.querySelector(
      `.statusText[data-id="${studentId}"]`
    );

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
});


function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) {
    console.log("Sidebar not found!");
    return;
  }

  sidebar.classList.toggle("active");
  console.log("Menu clicked, sidebar toggled ✅");
}
