const API_URL = "http://localhost:5001/api";

const careerQuestions = {
  frontend: [
    "What is the role of HTML, CSS, and JavaScript in frontend development?",
    "Explain responsive web design.",
    "What is the difference between React and normal JavaScript?"
  ],
  backend: [
    "What is the role of a backend developer?",
    "What is an API and why is it used?",
    "Explain database connection in backend development."
  ],
  fullstack: [
    "What is full stack development?",
    "How does frontend communicate with backend?",
    "Explain how login works in a full stack web application."
  ],
  dataanalyst: [
    "What is data analysis?",
    "What is the use of Excel, SQL, and Power BI?",
    "How do you clean raw data?"
  ],
  datascientist: [
    "What is data science?",
    "What is machine learning?",
    "Explain the difference between classification and regression."
  ],
  ai: [
    "What is artificial intelligence?",
    "What is the difference between AI, ML, and deep learning?",
    "How can AI be used in interview preparation platforms?"
  ],
  cybersecurity: [
    "What is cybersecurity?",
    "What is phishing?",
    "Explain authentication and authorization."
  ],
  cloud: [
    "What is cloud computing?",
    "What is the difference between IaaS, PaaS, and SaaS?",
    "What is the use of AWS or Azure?"
  ],
  devops: [
    "What is DevOps?",
    "What is CI/CD?",
    "What is Docker and why is it used?"
  ],
  uiux: [
    "What is UI/UX design?",
    "What is the difference between UI and UX?",
    "Why is user research important?"
  ]
};

let selectedCareer = "";
let currentQuestionIndex = 0;

function selectCareer() {
  selectedCareer = document.getElementById("careerSelect").value;
  currentQuestionIndex = 0;
  loadQuestion();
}

function loadQuestion() {
  const questionText = document.getElementById("questionText");
  const questionNumber = document.getElementById("questionNumber");
  const answer = document.getElementById("answer");
  const result = document.getElementById("result");

  if (!questionText || !questionNumber) return;

  if (!selectedCareer) {
    questionNumber.innerText = "Question";
    questionText.innerText = "Select a career path to start.";
    return;
  }

  questionNumber.innerText = `Question ${currentQuestionIndex + 1}`;
  questionText.innerText =
    careerQuestions[selectedCareer][currentQuestionIndex];

  if (answer) answer.value = "";
  if (result) result.innerHTML = "";
}

function nextQuestion() {
  if (!selectedCareer) {
    alert("Please select a career path first.");
    return;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex >= careerQuestions[selectedCareer].length) {
    currentQuestionIndex = 0;
  }

  loadQuestion();
}

function calculateScore(answer) {
  let score = 30;

  if (answer.length > 30) score += 20;
  if (answer.length > 80) score += 20;
  if (answer.length > 150) score += 15;

  const keywords = [
    "html", "css", "javascript", "react", "frontend",
    "backend", "api", "database", "server", "client",
    "sql", "cloud", "aws", "azure", "docker",
    "security", "authentication", "machine learning",
    "ai", "data", "design", "user"
  ];

  keywords.forEach((word) => {
    if (answer.toLowerCase().includes(word)) {
      score += 3;
    }
  });

  if (score > 100) score = 100;
  return score;
}

function generateFeedback(score) {
  if (score >= 85) {
    return "Excellent answer. You explained the concept clearly with strong technical understanding.";
  } else if (score >= 70) {
    return "Good answer. Add one practical example to make it stronger.";
  } else if (score >= 50) {
    return "Average answer. Add more technical keywords and explanation.";
  } else {
    return "Weak answer. Your answer is too short. Explain meaning, use, and example.";
  }
}

async function submitInterview() {
  const answer = document.getElementById("answer").value;
  const resultDiv = document.getElementById("result");

  if (!selectedCareer) {
    alert("Please select a career path first.");
    return;
  }

  if (answer.trim() === "") {
    resultDiv.innerHTML =
      `<p style="color:red; margin-top:20px;">Please enter your answer.</p>`;
    return;
  }

  const question = careerQuestions[selectedCareer][currentQuestionIndex];
  const score = calculateScore(answer);
  const feedback = generateFeedback(score);

  resultDiv.innerHTML = `
    <div style="margin-top:30px;background:rgba(255,255,255,0.08);padding:25px;border-radius:15px;">
      <h2>AI Evaluation Result</h2>
      <p style="margin-top:15px;"><strong>Career:</strong> ${selectedCareer}</p>
      <p style="margin-top:10px;"><strong>Question:</strong> ${question}</p>
      <p style="margin-top:10px;"><strong>Score:</strong> ${score}/100</p>
      <p style="margin-top:10px;"><strong>Feedback:</strong> ${feedback}</p>
    </div>
  `;

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    await fetch(`${API_URL}/sessions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        title: question,
        type: selectedCareer,
        score: score
      })
    });
  }
}

async function registerUser() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    window.location.href = "login.html";
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  }
}

async function uploadResume() {
  const fileInput = document.getElementById("resumeFile");
  const uploadResult = document.getElementById("uploadResult");

  if (!fileInput.files[0]) {
    uploadResult.innerHTML =
      `<p style="color:red;">Please select a resume file.</p>`;
    return;
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);

  const res = await fetch(`${API_URL}/upload/resume`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("resumeFileName", data.filename);
    window.location.href = "resume-result.html";
  } else {
    uploadResult.innerHTML = `<p style="color:red;">${data.message}</p>`;
  }
}

async function loadProgress() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const res = await fetch(`${API_URL}/sessions/${user.id}`);
  const sessions = await res.json();

  const sessionCount = document.getElementById("sessionCount");
  const averageScore = document.getElementById("averageScore");
  const resumeCount = document.getElementById("resumeCount");
  const bestScore = document.getElementById("bestScore");
  const scoreChart = document.getElementById("scoreChart");
  const performanceInsight = document.getElementById("performanceInsight");

  if (sessionCount) {
    sessionCount.innerText = `${sessions.length} Sessions Completed`;
  }

  if (averageScore) {
    if (sessions.length === 0) {
      averageScore.innerText = "0%";
    } else {
      const total = sessions.reduce((sum, item) => sum + item.score, 0);
      const avg = Math.round(total / sessions.length);
      averageScore.innerText = `${avg}%`;
    }
  }

  if (bestScore) {
  if (sessions.length === 0) {
    bestScore.innerText = "0%";
  } else {
    const best = Math.max(...sessions.map(item => item.score));
    bestScore.innerText = `${best}%`;
  }
}

if (scoreChart) {
  if (sessions.length === 0) {
    scoreChart.innerHTML = "<p>No chart data available.</p>";
  } else {
    let chartHTML = "";

    sessions.forEach((item) => {
      chartHTML += `
        <div style="margin-top:20px; text-align:left;">
          <p>${item.type} - ${item.score}%</p>
          <div style="background:rgba(255,255,255,0.15); border-radius:10px;">
            <div style="
              width:${item.score}%;
              background:#38bdf8;
              padding:8px;
              border-radius:10px;
            "></div>
          </div>
        </div>
      `;
    });

    scoreChart.innerHTML = chartHTML;
  }
}

if (performanceInsight) {
  if (sessions.length === 0) {
    performanceInsight.innerText = "Complete interview sessions to get insights.";
  } else {
    const total = sessions.reduce((sum, item) => sum + item.score, 0);
    const avg = Math.round(total / sessions.length);

    if (avg >= 85) {
      performanceInsight.innerText =
        "Excellent progress. You are performing at a strong interview preparation level.";
    } else if (avg >= 70) {
      performanceInsight.innerText =
        "Good progress. Focus on adding more examples and technical keywords.";
    } else {
      performanceInsight.innerText =
        "Needs improvement. Practice longer answers with better explanations.";
    }
  }
}

  if (resumeCount) {
    resumeCount.innerText = localStorage.getItem("resumeFileName")
      ? "1 Resume Uploaded"
      : "0 Uploads";
  }
}

function loadResumeResult() {

  const fileName =
    localStorage.getItem("resumeFileName");

  const resultBox =
    document.getElementById("resumeAnalysisResult");

  if (!resultBox) return;

  if (!fileName) {

    resultBox.innerHTML =
      `<p>No resume uploaded yet.</p>`;

    return;
  }

  /* AI STYLE MOCK ANALYSIS */

  const detectedSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MySQL"
  ];

  const missingSkills = [
    "Docker",
    "AWS",
    "GitHub Actions",
    "TypeScript"
  ];

  const careerMatches = [
    "Frontend Developer",
    "Full Stack Developer",
    "AI Web App Developer"
  ];

  const atsScore = 82;

  let atsMessage = "";

  if (atsScore >= 85) {

    atsMessage =
      "Excellent ATS compatibility.";

  } else if (atsScore >= 70) {

    atsMessage =
      "Good ATS score but improvements are recommended.";

  } else {

    atsMessage =
      "Low ATS score. Add more technical keywords.";
  }

  resultBox.innerHTML = `

    <div style="text-align:left; line-height:1.9;">

      <h2 style="color:#38bdf8;">
        Resume Analysis Report
      </h2>

      <br />

      <p>
        <strong>Uploaded Resume:</strong>
        ${fileName}
      </p>

      <p>
        <strong>ATS Compatibility Score:</strong>
        ${atsScore}/100
      </p>

      <p>
        <strong>ATS Result:</strong>
        ${atsMessage}
      </p>

      <br />

      <h3 style="color:#38bdf8;">
        Detected Skills
      </h3>

      <p>
        ${detectedSkills.join(", ")}
      </p>

      <br />

      <h3 style="color:#38bdf8;">
        Missing Recommended Skills
      </h3>

      <p>
        ${missingSkills.join(", ")}
      </p>

      <br />

      <h3 style="color:#38bdf8;">
        Career Match Suggestions
      </h3>

      <p>
        ${careerMatches.join(", ")}
      </p>

      <br />

      <h3 style="color:#38bdf8;">
        AI Suggestions
      </h3>

      <ul style="padding-left:20px;">

        <li>
          Add measurable achievements in projects.
        </li>

        <li>
          Add cloud and DevOps related skills.
        </li>

        <li>
          Include GitHub and LinkedIn profile links.
        </li>

        <li>
          Add certifications and internship experience.
        </li>

      </ul>

    </div>

  `;
}


function uploadProfilePhoto() {
  const photoInput = document.getElementById("profilePhotoInput");
  const preview = document.getElementById("profilePreview");

  if (!photoInput.files[0]) {
    alert("Please select a photo.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem("profilePhoto", reader.result);
    preview.src = reader.result;
    preview.style.display = "block";
  };

  reader.readAsDataURL(photoInput.files[0]);
}

function loadProfilePhoto() {
  const savedPhoto = localStorage.getItem("profilePhoto");
  const preview = document.getElementById("profilePreview");

  if (savedPhoto && preview) {
    preview.src = savedPhoto;
    preview.style.display = "block";
  }
}

function deleteProfilePhoto() {
  localStorage.removeItem("profilePhoto");

  const preview = document.getElementById("profilePreview");
  const photoInput = document.getElementById("profilePhotoInput");

  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  if (photoInput) {
    photoInput.value = "";
  }

  alert("Profile photo deleted.");
}

async function loadAdminStats() {

  const totalUsers = document.getElementById("totalUsers");
  const totalSessions = document.getElementById("totalSessions");

  if (!totalUsers || !totalSessions) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {

    alert("Access Denied. Admins Only.");

    window.location.href = "dashboard.html";

    return;
  }

  try {

    const res = await fetch(`${API_URL}/admin/stats`);

    const data = await res.json();

    totalUsers.innerText = data.totalUsers;
    totalSessions.innerText = data.totalSessions;

  } catch (error) {

    console.log(error);

  }

}

function showAdminButton() {

  const user = JSON.parse(localStorage.getItem("user"));

  const adminCard = document.getElementById("adminCard");

  if (!adminCard) return;

  if (user && user.role === "admin") {
    adminCard.style.display = "block";
  }

}

async function loadUsers() {

  const usersContainer =
    document.getElementById("usersContainer");

  if (!usersContainer) return;

  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return;
  }

  try {

    const res =
      await fetch(`${API_URL}/users`);

    const users = await res.json();

    if (users.length === 0) {

      usersContainer.innerHTML =
        "<p>No users found.</p>";

      return;
    }

    let html = "";

    users.forEach((item) => {

      html += `
        <div style="
          background:rgba(255,255,255,0.08);
          padding:20px;
          border-radius:15px;
          margin-top:15px;
          text-align:left;
        ">

          <p><strong>Name:</strong> ${item.name}</p>

          <p><strong>Email:</strong> ${item.email}</p>

          <p><strong>Role:</strong> ${item.role}</p>

          <button
            onclick="deleteUser(${item.id})"
            style="
              margin-top:15px;
              background:red;
              color:white;
              border:none;
              padding:10px 20px;
              border-radius:8px;
              cursor:pointer;
            "
          >
            Delete User
          </button>

        </div>
      `;
    });

    usersContainer.innerHTML = html;

  } catch (error) {

    console.log(error);

  }

}

async function deleteUser(userId) {

  const confirmDelete =
    confirm("Delete this user?");

  if (!confirmDelete) return;

  try {

    const res =
      await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE"
      });

    const data = await res.json();

    alert(data.message);

    loadUsers();

  } catch (error) {

    console.log(error);

  }

}

async function loadSessions() {
  const sessionsContainer = document.getElementById("sessionsContainer");

  if (!sessionsContainer) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/sessions/admin/all`);
    const sessions = await res.json();

    if (sessions.length === 0) {
      sessionsContainer.innerHTML = "<p>No sessions found.</p>";
      return;
    }

    let html = "";

    sessions.forEach((item) => {
      html += `
        <div style="
          background:rgba(255,255,255,0.08);
          padding:20px;
          border-radius:15px;
          margin-top:15px;
          text-align:left;
        ">
          <p><strong>User:</strong> ${item.name}</p>
          <p><strong>Email:</strong> ${item.email}</p>
          <p><strong>Career/Type:</strong> ${item.type}</p>
          <p><strong>Question:</strong> ${item.title}</p>
          <p><strong>Score:</strong> ${item.score}/100</p>

          <button
            onclick="deleteSession(${item.id})"
            style="
              margin-top:15px;
              background:red;
              color:white;
              border:none;
              padding:10px 20px;
              border-radius:8px;
              cursor:pointer;
            "
          >
            Delete Session
          </button>
        </div>
      `;
    });

    sessionsContainer.innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}

async function deleteSession(sessionId) {
  const confirmDelete = confirm("Delete this session?");

  if (!confirmDelete) return;

  const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
    method: "DELETE"
  });

  const data = await res.json();

  alert(data.message);

  loadSessions();
  loadAdminStats();
}

function loadProfileDetails() {
  const user = JSON.parse(localStorage.getItem("user"));

  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (!user || !profileName || !profileEmail) return;

  profileName.value = user.name;
  profileEmail.value = user.email;
}

async function updateProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  const name = document.getElementById("profileName").value;
  const email = document.getElementById("profileEmail").value;

  const res = await fetch(`${API_URL}/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email })
  });

  const data = await res.json();

  alert(data.message);

  if (res.ok) {
    const updatedUser = {
      ...user,
      name: name,
      email: email
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

loadQuestion();
loadProgress();
loadResumeResult();
loadProfilePhoto();
loadAdminStats();
showAdminButton();
loadUsers();
loadSessions();
loadProfileDetails();