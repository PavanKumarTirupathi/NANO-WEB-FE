// =========================
// THEME
// =========================
const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  themeBtn.innerText = document.body.classList.contains("light") ? "☀️" : "🌙";
};

// =========================
// SMOOTH SCROLL
// =========================
document.documentElement.style.scrollBehavior = "smooth";

// =========================
// SCROLL REVEAL
// =========================
const rows = document.querySelectorAll(".row");

window.addEventListener("scroll", () => {
  rows.forEach(row => {
    if (row.getBoundingClientRect().top < window.innerHeight - 100) {
      row.classList.add("show");
    }
  });
});

// =========================
// IMAGE GLOW + TILT
// =========================
const wraps = document.querySelectorAll(".img-wrap");

wraps.forEach(wrap => {

  wrap.addEventListener("mouseenter", () => {
    wrap.classList.add("active");
  });

  wrap.addEventListener("mouseleave", () => {
    wrap.classList.remove("active");
    const img = wrap.querySelector("img");
    if (img) img.style.transform = "none";
  });

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    wrap.style.setProperty("--x", x + "%");
    wrap.style.setProperty("--y", y + "%");
    wrap.style.setProperty("--x2", (x + 40) % 100 + "%");
    wrap.style.setProperty("--y2", (y + 40) % 100 + "%");

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(e.clientY - rect.top - centerY) / 12;
    const rotateY = (e.clientX - rect.left - centerX) / 12;

    const img = wrap.querySelector("img");
    if (img) {
      img.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }
  });

});

// =========================
// 🔥 STORY SCROLL (FIXED)
// =========================
const storySection = document.querySelector(".story");

if (storySection) {

  const storyTexts = document.querySelectorAll(".story-text");
  const storyImages = document.querySelectorAll(".story-img");

  window.addEventListener("scroll", () => {

    const sectionTop = storySection.offsetTop;
    const sectionHeight = storySection.offsetHeight;
    const scrollY = window.scrollY;

    const progress = (scrollY - sectionTop) / (sectionHeight - window.innerHeight);

    storyTexts.forEach((text, i) => {
      text.classList.remove("active");
      storyImages[i]?.classList.remove("active");

      if (progress >= i * 0.33 && progress < (i + 1) * 0.33) {
        text.classList.add("active");
        storyImages[i]?.classList.add("active");
      }
    });

  });
}

// =========================
// 🔥 POPUP FIX (WORKING)
// =========================

const openDemo = document.getElementById("openDemo");
const closeDemo = document.getElementById("closeDemo");
const modal = document.getElementById("demoModal");

if (openDemo && modal) {
  openDemo.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

if (closeDemo && modal) {
  closeDemo.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

// click outside close
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}
// =========================
// NAV ACTIVE
// =========================
const navLinks = document.querySelectorAll(".nav-links a");

const sectionsMap = {
  "#problem": document.querySelector("#problem"),
  "#how": document.querySelector("#how"),
  "#features": document.querySelector("#features"),
  "#use": document.querySelector("#use"),
  "#privacy": document.querySelector("#privacy")
};

window.addEventListener("scroll", () => {

  let current = "";

  for (let key in sectionsMap) {
    const section = sectionsMap[key];
    if (!section) continue;

    const rect = section.getBoundingClientRect();

    if (rect.top <= window.innerHeight / 2) {
      current = key;
    }
  }

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });

});
// =========================
// 🔥 REAL MIC TRANSCRIPTION
// =========================

const recordBtn = document.getElementById("recordBtn");
const transcript = document.getElementById("transcript");
const summary = document.getElementById("summary");
const insights = document.getElementById("insights");

let recognition;
let isRecording = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let text = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }

    transcript.value = text;
  };

  recognition.onerror = (e) => {
    console.error("Speech error:", e);
  };
}

recordBtn.onclick = () => {
  
  if (!recognition) {
    alert("Your browser does not support speech recognition");
    return;
  }

  isRecording = !isRecording;

  if (isRecording) {
    recognition.start();
    recordBtn.innerText = "⏹ Stop Recording";
  } else {
    recognition.stop();
    recordBtn.innerText = "🎤 Start Recording";

    generateSummary(transcript.value);
  }
};
function generateSummary(text) {
  if (!text) return;

  // TEMP MOCK (until API added)
  summary.innerText = "Summary: " + text.slice(0, 80) + "...";

  insights.innerText =
    "Words: " + text.split(" ").length +
    " | Sentiment: Neutral";
}
// =========================
// 🔥 AUDIO UPLOAD
// =========================

// =========================
// 🔥 ADVANCED AUDIO UPLOAD SYSTEM
// =========================

const uploadBtn = document.getElementById("uploadBtn");
const audioInput = document.getElementById("audioInput");
const submitBtn = document.getElementById("submitBtn");

let uploadedFile = null;
let uploadTranscriptBuffer = "";
let isProcessingUpload = false;
let uploadIntervalId = null;

const sampleTranscripts = [
  "Meeting discussion about quarterly",
  "Meeting discussion about quarterly goals and",
  "Meeting discussion about quarterly goals and project deadlines for the next",
  "Meeting discussion about quarterly goals and project deadlines for the next three months with team leads present.",
  "Meeting discussion about quarterly goals and project deadlines for the next three months with team leads present. Key focus areas discussed."
];

uploadBtn.onclick = () => {
  audioInput.click();
};

audioInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploadedFile = file;
  uploadTranscriptBuffer = "";
  isProcessingUpload = true;
  
  transcript.value = `Processing: ${file.name}...`;
  submitBtn.style.display = "none";
  loader.style.display = "block";
  summary.innerText = "Analyzing audio...";
  insights.innerText = "Transcription in progress...";

  simulateRealtimeTranscription();
};

function simulateRealtimeTranscription() {
  let index = 0;
  uploadIntervalId = setInterval(() => {
    if (index < sampleTranscripts.length && isProcessingUpload) {
      uploadTranscriptBuffer = sampleTranscripts[index];
      transcript.value = uploadTranscriptBuffer;
      
      updateUploadAnalysis(uploadTranscriptBuffer);
      index++;
    } else {
      clearInterval(uploadIntervalId);
      isProcessingUpload = false;
      loader.style.display = "none";
      
      if (uploadedFile && uploadTranscriptBuffer) {
        finalizeUploadAnalysis(uploadTranscriptBuffer);
      }
    }
  }, 600);
}

function updateUploadAnalysis(text) {
  if (!text) return;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const summaryPreview = text.slice(0, 80) + (text.length > 80 ? "..." : "");
  
  summary.innerText = "Live summary: " + summaryPreview;
  
  const insights_arr = [];
  insights_arr.push(`Words: ${wordCount}`);
  if (/deadline|urgent|goal|meeting|discussion/.test(text.toLowerCase())) insights_arr.push("Key topics detected");
  if (/team|leads/.test(text.toLowerCase())) insights_arr.push("Collaborative focus");
  
  insights.innerText = insights_arr.length > 0 ? insights_arr.join(" | ") : "Processing...";
}

function finalizeUploadAnalysis(finalText) {
  if (!finalText) return;
  
  const wordCount = finalText.split(/\s+/).filter(Boolean).length;
  summary.innerText = "Summary: Audio transcribed and analyzed. " + finalText.slice(0, 65) + "...";
  
  insights.innerText = `Words: ${wordCount} | Confidence: High | File: ${uploadedFile.name.slice(0, 25)}`;
  submitBtn.style.display = "none";
}

submitBtn.onclick = () => {
  if (!uploadedFile) return;
  if (isProcessingUpload) {
    isProcessingUpload = false;
    clearInterval(uploadIntervalId);
    loader.style.display = "none";
    finalizeUploadAnalysis(uploadTranscriptBuffer);
  }
};// =========================
// 🔥 STATUS SYSTEM (STEP 1)
// =========================

const recStatus = document.getElementById("recStatus");
const timerEl = document.getElementById("timer");
const loader = document.getElementById("loader");

let timerInterval;
let seconds = 0;

function startTimer() {
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    timerEl.innerText = `${min}:${sec}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// =========================
// 🔥 LIVE TRANSCRIPT (STEP 3)
// =========================

if (recognition) {
  recognition.onresult = (event) => {
    let text = "";

    for (let i = 0; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }

    transcript.value = text;
  };
}

// =========================
// 🔥 RECORD BUTTON UPGRADE (STEP 2)
// =========================

recordBtn.onclick = () => {

  if (!recognition) {
    alert("Speech recognition not supported");
    return;
  }

  isRecording = !isRecording;

  if (isRecording) {

    recognition.start();

    recStatus.innerText = "Recording...";
    loader.style.display = "none";

    startTimer();

    recordBtn.innerText = "⏹ Stop Recording";

  } else {

    recognition.stop();

    recStatus.innerText = "Processing...";
    loader.style.display = "block";

    stopTimer();

    recordBtn.innerText = "🎤 Start Recording";

    setTimeout(() => {
      recStatus.innerText = "Completed";
      loader.style.display = "none";
      generateSummary(transcript.value);
    }, 1200);
  }
};
// =========================
// 🔥 WAVE CONTROL
// =========================

const wave = document.getElementById("wave");

function startWave() {
  if (wave) wave.classList.add("active");
}

function stopWave() {
  if (wave) wave.classList.remove("active");
}
// =========================
// 🔥 STEP 4 — BUTTON GLOW + WAVE SYNC
// =========================

// Hook into existing record button logic safely
const originalRecordHandler = recordBtn.onclick;

recordBtn.onclick = function () {

  // run your existing logic first
  originalRecordHandler();

  // 🔥 AFTER that → add enhancements

  if (isRecording) {

    // button glow
    recordBtn.classList.add("recording");

    // wave start
    startWave();

  } else {

    // remove glow
    recordBtn.classList.remove("recording");

    // stop wave
    stopWave();

  }
};


// =========================
// 🔥 STEP 6 — STATUS COLOR SYNC
// =========================

// Observe status text changes and apply classes
const statusObserver = new MutationObserver(() => {

  const text = recStatus.innerText.toLowerCase();

  recStatus.classList.remove("recording", "processing", "done");

  if (text.includes("record")) {
    recStatus.classList.add("recording");
  } else if (text.includes("process")) {
    recStatus.classList.add("processing");
  } else if (text.includes("complete")) {
    recStatus.classList.add("done");
  }

});

// start observing status changes
if (recStatus) {
  statusObserver.observe(recStatus, { childList: true });
}
// =========================
// 🔥 REAL AUDIO REACTIVE WAVE
// =========================

let audioContext;
let analyser;
let microphone;
let dataArray;
let animationId;

async function initAudioWave() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();

    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

  } catch (err) {
    console.error("Mic access denied", err);
  }
}

function animateWave() {
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  const bars = document.querySelectorAll("#wave span");

  bars.forEach((bar, i) => {
    const value = dataArray[i] || 0;

    // 🔥 convert audio level → height
    const height = Math.max(10, value * 0.6);

    bar.style.height = height + "px";
  });

  animationId = requestAnimationFrame(animateWave);
}

function startRealWave() {
  if (!audioContext) {
    initAudioWave().then(() => {
      animateWave();
    });
  } else {
    animateWave();
  }
}

function stopRealWave() {
  cancelAnimationFrame(animationId);

  document.querySelectorAll("#wave span").forEach(bar => {
    bar.style.height = "10px";
  });
}
// =========================
// 🔥 PROBLEM SCROLL TRIGGER
// =========================

const problemCards = document.querySelectorAll(".problem-card");

function revealProblemCards() {
  problemCards.forEach(card => {
    const rect = card.getBoundingClientRect();

    if (rect.top < window.innerHeight - 80) {
      card.classList.add("show");
    }
  });
}

// run on scroll
window.addEventListener("scroll", revealProblemCards);

// run once on load
revealProblemCards();
document.querySelectorAll(".how-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--x", x + "%");
    card.style.setProperty("--y", y + "%");
  });
});
// =========================
// 🔥 SHOWCASE GLOW FOLLOW
// =========================

document.querySelectorAll(".showcase-img").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--x", x + "%");
    card.style.setProperty("--y", y + "%");
  });
});
// =========================
// 🔥 FOOTER CTA BUTTON
// =========================

document.querySelectorAll(".footer .try-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById("demoModal");
    modal?.classList.add("active");
  });
});
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth" });
  });
});