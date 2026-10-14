// ========================================================
// RINA BAPU CHAUDHARI — PORTFOLIO JAVASCRIPT
// Features: Mobile Navigation, Copy Email, Form Validation, Dynamic Year, AI Chatbot
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initCopyEmail();
  initContactForm();
  initYear();
  initChatbot();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !isExpanded);
    toggle.classList.toggle("active");
    nav.classList.toggle("active");
  });

  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("active");
      nav.classList.remove("active");
    });
  });
}

// 1-Click Copy Email
function initCopyEmail() {
  const copyBtn = document.getElementById("copyEmailBtn");
  const email = "chaudharirina2007@gmail.com";
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard!");
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  });
}

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToast("Email copied: " + text);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Contact Form Validation
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const targetEmail = "chaudharirina2007@gmail.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const subject = document.getElementById("userSubject").value.trim();
    const message = document.getElementById("userMessage").value.trim();

    const nameErr = document.getElementById("nameError");
    const emailErr = document.getElementById("emailError");
    const subjectErr = document.getElementById("subjectError");
    const msgErr = document.getElementById("messageError");
    const status = document.getElementById("formStatus");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!name) {
      nameErr.textContent = "Please enter your name.";
      isValid = false;
    } else {
      nameErr.textContent = "";
    }

    if (!email || !emailPattern.test(email)) {
      emailErr.textContent = "Please enter a valid email address.";
      isValid = false;
    } else {
      emailErr.textContent = "";
    }

    if (!subject) {
      subjectErr.textContent = "Please enter a subject.";
      isValid = false;
    } else {
      subjectErr.textContent = "";
    }

    if (!message || message.length < 8) {
      msgErr.textContent = "Please write at least 8 characters.";
      isValid = false;
    } else {
      msgErr.textContent = "";
    }

    if (isValid) {
      status.className = "form-feedback success";
      status.textContent = `Thank you, ${name}! Opening your email client...`;

      const mailBody = `From: ${name} (${email})\n\n${message}`;
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      form.reset();
    } else {
      status.className = "form-feedback";
      status.textContent = "";
    }
  });
}

// Dynamic Current Year
function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ========================================================
// AI Chatbot Assistant Functionality
// ========================================================
function initChatbot() {
  const wrapper = document.getElementById("chatbotWrapper");
  const trigger = document.getElementById("chatbotTrigger");
  const windowEl = document.getElementById("chatbotWindow");
  const closeBtn = document.getElementById("chatCloseBtn");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messagesBox = document.getElementById("chatMessages");
  const quickPrompts = document.getElementById("quickPrompts");

  if (!trigger || !windowEl || !messagesBox) return;

  // Toggle Chatbot
  function toggleChat() {
    const isHidden = windowEl.hidden;
    windowEl.hidden = !isHidden;
    wrapper.classList.toggle("is-open", isHidden);
    if (isHidden) {
      input.focus();
      scrollToBottom();
    }
  }

  trigger.addEventListener("click", toggleChat);
  if (closeBtn) closeBtn.addEventListener("click", toggleChat);

  // Quick Prompt Chips
  if (quickPrompts) {
    quickPrompts.addEventListener("click", (e) => {
      const chip = e.target.closest(".prompt-chip");
      if (!chip) return;
      const query = chip.dataset.query;
      handleUserMessage(query);
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      handleUserMessage(text);
    });
  }

  function handleUserMessage(userText) {
    // 1. Add user message bubble
    appendMessage(userText, "user");

    // 2. Hide quick prompt chips after user starts chatting
    if (quickPrompts) {
      quickPrompts.style.display = "none";
    }

    // 3. Show typing indicator
    const typingIndicator = showTyping();
    scrollToBottom();

    // 4. Calculate response after realistic pause
    setTimeout(() => {
      typingIndicator.remove();
      const reply = generateBotResponse(userText);
      appendMessage(reply, "bot");
      scrollToBottom();
    }, 550);
  }

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = `<p>${text}</p>`;

    row.appendChild(bubble);
    messagesBox.appendChild(row);
  }

  function showTyping() {
    const row = document.createElement("div");
    row.className = "msg-row bot-row typing-row";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = `
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;

    row.appendChild(bubble);
    messagesBox.appendChild(row);
    return row;
  }

  function scrollToBottom() {
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  // Intelligent Response Knowledge Base
  function generateBotResponse(input) {
    const query = input.toLowerCase().trim();

    // Greetings
    if (query.match(/^(hi|hello|hey|greetings|namaste|good\s*(morning|evening|afternoon))/)) {
      return "Hello! 😊 Great to connect with you. What would you like to know about Rina? You can ask about her projects, skills, education, or how to contact her.";
    }

    // Projects
    if (query.includes("project") || query.includes("ecosort") || query.includes("waste") || query.includes("resume") || query.includes("screen")) {
      return "Rina has developed two featured academic projects:<br><br>" +
             "1. <strong>EcoSort — Smart Waste Management System:</strong> An automated waste segregation concept using computer vision logic.<br><br>" +
             "2. <strong>AI-Based Resume Screening System:</strong> An NLP text-parsing prototype that matches candidate CVs against job criteria.<br><br>" +
             "You can view more details in the <strong>Projects</strong> section above!";
    }

    // Skills / Tech stack
    if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("language") || query.includes("python") || query.includes("java") || query.includes("c")) {
      return "Here is Rina's technical toolset:<br><br>" +
             "• <strong>Core Programming:</strong> Python (Daily focus for DSA & AI)<br>" +
             "• <strong>Foundations:</strong> C & Java (Object-Oriented Programming, CodeChef certified)<br>" +
             "• <strong>Web Development:</strong> HTML5, CSS3, JavaScript<br>" +
             "• <strong>Data & AI:</strong> Data preprocessing, exploratory data analysis, and NLP fundamentals.<br>" +
             "• <strong>Databases:</strong> Currently learning SQL.";
    }

    // Education / College / CGPA / Branch
    if (query.includes("education") || query.includes("college") || query.includes("rcpit") || query.includes("cgpa") || query.includes("marks") || query.includes("degree") || query.includes("year") || query.includes("b.tech") || query.includes("btech")) {
      return "Rina is currently in her <strong>2nd Year</strong> pursuing a <strong>B.Tech in Artificial Intelligence & Data Science</strong> at <strong>R.C. Patel Institute of Technology, Shirpur</strong> (Expected 2027).<br><br>" +
             "• <strong>Current B.Tech CGPA:</strong> 7.0 / 10<br>" +
             "• <strong>HSC (Science):</strong> 77%<br>" +
             "• <strong>SSC (Distinction):</strong> 89%";
    }

    // CodeChef / Competitive Programming
    if (query.includes("codechef") || query.includes("coding profile") || query.includes("competitive")) {
      return "You can check out Rina's CodeChef profile here:<br><br>" +
             "👨‍🍳 <a href='https://www.codechef.com/college/dashboard' target='_blank' style='color:#06b6d4;text-decoration:underline;'><strong>Rina's CodeChef Dashboard &rarr;</strong></a><br><br>" +
             "She is certified by CodeChef in <strong>OOPS through Java</strong> and <strong>C Programming</strong>!";
    }

    // Contact / Email / LinkedIn / Phone
    if (query.includes("contact") || query.includes("email") || query.includes("reach") || query.includes("hire") || query.includes("message") || query.includes("phone") || query.includes("call") || query.includes("linkedin")) {
      return "You can get in touch with Rina directly through:<br><br>" +
             "• ✉️ <strong>Email:</strong> <a href='mailto:chaudharirina2007@gmail.com' style='color:#06b6d4;text-decoration:underline;'>chaudharirina2007@gmail.com</a><br>" +
             "• 💼 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/rina-chaudhari-b3a01a426' target='_blank' style='color:#06b6d4;text-decoration:underline;'>rina-chaudhari-b3a01a426</a><br>" +
             "• 👨‍🍳 <strong>CodeChef:</strong> <a href='https://www.codechef.com/college/dashboard' target='_blank' style='color:#06b6d4;text-decoration:underline;'>codechef.com/college/dashboard</a><br>" +
             "• 📍 <strong>Location:</strong> Shirpur, Maharashtra, India<br><br>" +
             "Feel free to use the contact form on this page to send a quick message!";
    }

    // Currently Learning / Roadmap
    if (query.includes("learning") || query.includes("study") || query.includes("roadmap") || query.includes("future")) {
      return "Rina is actively sharpening her skills in:<br><br>" +
             "1. Python DSA & Algorithmic Problem Solving<br>" +
             "2. Machine Learning & Statistical Data Analysis<br>" +
             "3. Responsive Web Development (JS & APIs)<br>" +
             "4. Relational Database Modeling with SQL";
    }

    // About / Bio
    if (query.includes("about") || query.includes("who is") || query.includes("tell me about") || query.includes("rina")) {
      return "Rina Bapu Chaudhari is an ambitious 2nd-year B.Tech engineering student in Artificial Intelligence & Data Science at RCPIT Shirpur. She is passionate about software engineering, data science fundamentals, and building practical technology with a strong work ethic!";
    }

    // Internships / Opportunities
    if (query.includes("intern") || query.includes("job") || query.includes("available") || query.includes("opportunity")) {
      return "Yes! Rina is actively seeking internship opportunities, mentorship, and collaborative projects. She brings strong discipline, rapid learning capability, and fresh enthusiasm. Reach out to her at <a href='mailto:chaudharirina2007@gmail.com' style='color:#06b6d4;text-decoration:underline;'>chaudharirina2007@gmail.com</a>!";
    }

    // Default Fallback
    return "Thanks for asking! I can provide info on:<br><br>" +
           "• <strong>Projects</strong> (EcoSort & AI Resume Screener)<br>" +
           "• <strong>Technical Skills</strong> (Python, AI/Data, Web, Java/C)<br>" +
           "• <strong>Education & CGPA</strong> (RCPIT Shirpur, 7.0 CGPA)<br>" +
           "• <strong>Contact Details</strong> (Email & LinkedIn)<br><br>" +
           "What would you like to explore?";
  }
}
