const body = document.querySelector("body"),
  sidebar = document.querySelector(".sidebar"),
  toggle = document.querySelector(".toggle"),
  modeSwitch = document.querySelector(".toggle-switch"),
  modeText = document.querySelector(".mode-text"),
  searchBtn = document.querySelector(".search-bar");

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  //   document.querySelector(".mode-text").innertext=""

  if (body.classList.contains("dark")) {
    modeText.innerText = " Light Mode ";
  } else modeText.innerText = " Dark Mode ";
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  localStorage.removeItem("isLoggedIn"); // or your login key
  localStorage.removeItem("loggedInUser"); // optional, depending on your app
  window.location.href = "../LoginRegister.html"; // Redirect to login page
});

//quiz
  const questions = {
    networks: [
      {q: "What does IP stand for?", options:["Internet Protocol", "Internal Program", "Internet Process", "Integrated Protocol"], answer:0},
      {q: "Which device connects multiple networks?", options:["Switch", "Router", "Hub", "Repeater"], answer:1},
      {q: "What layer of the OSI model handles routing?", options:["Transport", "Network", "Data Link", "Session"], answer:1}
    ],
    webdev: [
      {q: "What does HTML stand for?", options:["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"], answer:0},
      {q: "Which tag is used to create a hyperlink in HTML?", options:["<link>", "<a>", "<href>", "<hyperlink>"], answer:1},
      {q: "CSS stands for?", options:["Creative Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], answer:2}
    ],
    python: [
      {q: "What is the output of print(2**3)?", options:["6", "8", "9", "5"], answer:1},
      {q: "Which keyword is used to define a function?", options:["function", "def", "fun", "define"], answer:1},
      {q: "How do you insert COMMENTS in Python code?", options:["// this is comment", "# this is comment", "/* comment */", "<!-- comment -->"], answer:1}
    ],
    cloud: [
      {q: "What does IaaS stand for?", options:["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Interface as a Service"], answer:1},
      {q: "Which is NOT a cloud provider?", options:["AWS", "Google Cloud", "Microsoft Azure", "Oracle DB"], answer:3},
      {q: "What type of cloud deployment is public cloud?", options:["Exclusive to one user", "Shared among many users", "Private network only", "On-premises only"], answer:1}
    ],
    databases: [
      {q: "Which SQL command is used to retrieve data?", options:["GET", "SELECT", "RETRIEVE", "FETCH"], answer:1},
      {q: "What does ACID stand for in databases?", options:["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Isolation, Durability", "Atomicity, Consistency, Integration, Durability", "Atomicity, Control, Isolation, Durability"], answer:0},
      {q: "Which is a NoSQL database?", options:["MySQL", "MongoDB", "Oracle", "PostgreSQL"], answer:1}
    ],
    htmlcss: [
      {q: "Which CSS property controls the text size?", options:["font-style", "text-size", "font-size", "text-style"], answer:2},
      {q: "What does HTML stand for?", options:["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinking Text Marking Language"], answer:1},
      {q: "Which tag is used to define an internal style sheet?", options:["<style>", "<css>", "<script>", "<link>"], answer:0}
    ]
  };

  // Elements
  const subjectSelect = document.getElementById('subject-select');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const subjectMsg = document.getElementById('subject-message');
  const quizDiv = document.getElementById('quiz');
  const progressDiv = document.getElementById('progress');
  const questionDiv = document.getElementById('question');
  const optionsDiv = document.getElementById('options');
  const nextBtn = document.getElementById('next-btn');
  const scoreDiv = document.getElementById('score');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  let currentSubject = '';
  let currentQIndex = 0;
  let selectedAnswer = null;
  let score = 0;

  function saveAttempt(subject, score, total) {
    const key = 'quizAttempts';
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    if (!data[subject]) data[subject] = [];
    data[subject].push({ score, total, date: new Date().toLocaleString() });
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadHistory() {
    const key = 'quizAttempts';
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    historyList.innerHTML = '';

    if (!currentSubject || !data[currentSubject] || data[currentSubject].length === 0) {
      historyList.innerHTML = '<li>No attempts yet for this subject.</li>';
      clearHistoryBtn.disabled = true;
      return;
    }

    clearHistoryBtn.disabled = false;

    data[currentSubject].forEach((attempt, i) => {
      const li = document.createElement('li');
      li.textContent = `Attempt ${i + 1}: ${attempt.score} / ${attempt.total} — ${attempt.date}`;
      historyList.appendChild(li);
    });
  }

  function clearHistory() {
    if (!currentSubject) return;
    if (!confirm(`Are you sure you want to clear all attempts for "${subjectSelect.options[subjectSelect.selectedIndex].text}"?`)) return;

    const key = 'quizAttempts';
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    if (data[currentSubject]) {
      delete data[currentSubject];
      localStorage.setItem(key, JSON.stringify(data));
      loadHistory();
    }
  }

  function resetQuizUI() {
    scoreDiv.style.display = 'none';
    nextBtn.disabled = true;
    selectedAnswer = null;
    optionsDiv.innerHTML = '';
    questionDiv.textContent = '';
    progressDiv.textContent = '';
  }

  function loadQuestion() {
    resetQuizUI();
    const qList = questions[currentSubject];
    if (!qList) return;

    if (currentQIndex >= qList.length) {
      finishQuiz();
      return;
    }

    const currentQ = qList[currentQIndex];
    progressDiv.textContent = `Question ${currentQIndex + 1} of ${qList.length}`;
    questionDiv.textContent = currentQ.q;

    currentQ.options.forEach((opt, i) => {
      const optDiv = document.createElement('div');
      optDiv.classList.add('option');
      optDiv.textContent = opt;
      optDiv.tabIndex = 0; // Make focusable
      optDiv.addEventListener('click', () => selectOption(i, optDiv));
      optDiv.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOption(i, optDiv);
        }
      });
      optionsDiv.appendChild(optDiv);
    });
  }

  function selectOption(index, optDiv) {
    if (selectedAnswer !== null) return; // prevent multiple selections
    selectedAnswer = index;

    // Highlight selected
    [...optionsDiv.children].forEach(child => child.classList.remove('selected'));
    optDiv.classList.add('selected');

    nextBtn.disabled = false;
  }

  function finishQuiz() {
    const totalQ = questions[currentSubject].length;
    scoreDiv.textContent = `You scored ${score} out of ${totalQ}!`;
    scoreDiv.style.display = 'block';
    quizDiv.style.display = 'none';
    startQuizBtn.disabled = false;
    subjectSelect.disabled = false;

    saveAttempt(currentSubject, score, totalQ);
    loadHistory();
  }

  nextBtn.addEventListener('click', () => {
    const correctIndex = questions[currentSubject][currentQIndex].answer;
    if (selectedAnswer === correctIndex) score++;

    currentQIndex++;
    selectedAnswer = null;
    nextBtn.disabled = true;

    if (currentQIndex < questions[currentSubject].length) {
      loadQuestion();
    } else {
      finishQuiz();
    }
  });

  startQuizBtn.addEventListener('click', () => {
    const selected = subjectSelect.value;
    subjectMsg.textContent = '';
    if (!selected) {
      subjectMsg.textContent = 'Please select a subject to start the quiz.';
      return;
    }
    currentSubject = selected;
    currentQIndex = 0;
    score = 0;
    startQuizBtn.disabled = true;
    subjectSelect.disabled = true;
    quizDiv.style.display = 'block';
    scoreDiv.style.display = 'none';
    loadQuestion();
    loadHistory();
  });

  clearHistoryBtn.addEventListener('click', clearHistory);

  // Initialize history for empty selection
  loadHistory();