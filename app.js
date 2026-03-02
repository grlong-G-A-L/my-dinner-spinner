window.onerror = function(msg, src, line, col, err) {
  document.title = "ERR: " + msg;
  var d = document.createElement("div");
  d.style.cssText = "position:fixed;top:0;left:0;right:0;background:red;color:#fff;padding:12px;z-index:9999;font:14px monospace;white-space:pre-wrap";
  d.textContent = "Error at line " + line + ":\n" + msg + "\n" + (err && err.stack || "");
  document.body.prepend(d);
};

(() => {
  "use strict";

  const CATEGORIES = [
    {
      name: "Veggies",
      emoji: "\u{1F966}",
      color: "#43A047",
      highlight: "#66BB6A",
      face: { bg: "#43A047", skin: "#81C784", eyes: "#1B5E20", blush: "#A5D6A7" },
      items: ["Broccoli", "Carrots", "Peas", "Corn", "Spinach", "Green Beans", "Zucchini", "Sweet Potato"],
    },
    {
      name: "Fruits",
      emoji: "\u{1F353}",
      color: "#FB8C00",
      highlight: "#FFA726",
      face: { bg: "#FB8C00", skin: "#FFB74D", eyes: "#E65100", blush: "#FFCC80" },
      items: ["Apples", "Bananas", "Strawberries", "Grapes", "Watermelon", "Blueberries", "Mango", "Peaches"],
    },
    {
      name: "Dairy",
      emoji: "\u{1F9C0}",
      color: "#00ACC1",
      highlight: "#26C6DA",
      face: { bg: "#00ACC1", skin: "#80DEEA", eyes: "#006064", blush: "#B2EBF2" },
      items: ["Milk", "Cheese", "Yogurt", "Butter", "Ice Cream", "Cottage Cheese", "Cream Cheese"],
    },
    {
      name: "Protein",
      emoji: "\u{1F357}",
      color: "#E53935",
      highlight: "#EF5350",
      face: { bg: "#E53935", skin: "#EF9A9A", eyes: "#B71C1C", blush: "#FFCDD2" },
      items: ["Chicken", "Beef", "Fish", "Eggs", "Beans", "Turkey", "Shrimp", "Tofu"],
    },
    {
      name: "Sides",
      emoji: "\u{1F372}",
      color: "#FFB300",
      highlight: "#FFCA28",
      face: { bg: "#FFB300", skin: "#FFE082", eyes: "#E65100", blush: "#FFF8E1" },
      items: ["Mashed Potatoes", "Rice", "Mac & Cheese", "Coleslaw", "Cornbread", "Baked Beans", "Dinner Rolls", "Applesauce", "Potato Salad", "Garlic Bread"],
    },
    {
      name: "Drinks",
      emoji: "\u{1F95B}",
      color: "#1E88E5",
      highlight: "#42A5F5",
      face: { bg: "#1E88E5", skin: "#90CAF9", eyes: "#0D47A1", blush: "#BBDEFB" },
      items: ["Water", "Juice", "Smoothie", "Lemonade", "Milk", "Hot Cocoa", "Sparkling Water"],
    },
  ];

  const SLICE_COUNT = CATEGORIES.length;
  const SLICE_ANGLE = (2 * Math.PI) / SLICE_COUNT;
  const CHALLENGE_SLICES = [3, 0, 4];

  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spinBtn");
  const arrowEl = document.querySelector(".arrow");
  const mascotEl = document.getElementById("mascot");
  const starCountEl = document.getElementById("starCount");
  const starBarEl = document.getElementById("starBar");
  const challengeBtn = document.getElementById("challengeBtn");

  const modal = document.getElementById("modal");
  const modalEmoji = document.getElementById("modalEmoji");
  const modalTitle = document.getElementById("modalTitle");
  const suggestionsEl = document.getElementById("suggestions");
  const spinAgainBtn = document.getElementById("spinAgainBtn");
  const ateItBtn = document.getElementById("ateItBtn");
  const confettiEl = document.getElementById("confetti");

  const challengeModal = document.getElementById("challengeModal");
  const mealSlotsEl = document.getElementById("mealSlots");
  const challengeAgainBtn = document.getElementById("challengeAgainBtn");
  const challengeAteItBtn = document.getElementById("challengeAteItBtn");
  const challengeConfettiEl = document.getElementById("challengeConfetti");

  const superEaterOverlay = document.getElementById("superEater");
  const superConfettiEl = document.getElementById("superConfetti");
  const superEaterClose = document.getElementById("superEaterClose");

  let rotation = 0;
  let velocity = 0;
  let spinning = false;
  let animFrameId = null;
  let size = 0;
  let center = 0;
  let radius = 0;
  let stars = parseInt(localStorage.getItem("dinnerSpinnerStars") || "0", 10);
  let challengeMode = false;
  let challengeResults = [];
  let challengeStep = 0;
  let prevSliceIdx = -1;

  starCountEl.textContent = stars;

  // ── Sound (Web Audio, fully guarded) ─────────────────────────────
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  var xyloWave = null;
  var chimeWave = null;

  function ensureAudio() {
    try {
      if (!AudioCtx) return false;
      if (!audioCtx) {
        audioCtx = new AudioCtx();
        var real = new Float32Array([0, 1, 0.6, 0.2, 0.15, 0.1, 0.05, 0.02]);
        var imag = new Float32Array(real.length);
        xyloWave = audioCtx.createPeriodicWave(real, imag);
        var chimeReal = new Float32Array([0, 1, 0.4, 0.3, 0.1, 0.08, 0.15, 0.05, 0.03]);
        var chimeImag = new Float32Array(chimeReal.length);
        chimeWave = audioCtx.createPeriodicWave(chimeReal, chimeImag);
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      return true;
    } catch (_) { return false; }
  }

  function xyloNote(freq, startTime, duration, vol) {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.setPeriodicWave(xyloWave);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(vol * 0.4, startTime + duration * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function chimeNote(freq, startTime, duration, vol) {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.setPeriodicWave(chimeWave);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(vol * 0.5, startTime + duration * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function playTick() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      var freq = 800 + Math.random() * 400;
      xyloNote(freq, t, 0.08, 0.09);
    } catch (_) {}
  }

  function playWhoosh() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.setPeriodicWave(xyloWave);
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.18);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.3);

      var len = audioCtx.sampleRate * 0.2;
      var buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      var src = audioCtx.createBufferSource();
      src.buffer = buf;
      var ng = audioCtx.createGain();
      var filt = audioCtx.createBiquadFilter();
      filt.type = "highpass";
      filt.frequency.value = 2000;
      src.connect(filt);
      filt.connect(ng);
      ng.connect(audioCtx.destination);
      ng.gain.setValueAtTime(0.06, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      src.start(t);
    } catch (_) {}
  }

  function playFanfare() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      var notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach(function(freq, i) {
        xyloNote(freq, t + i * 0.1, 0.45, 0.13);
        if (i >= 3) chimeNote(freq * 2, t + i * 0.1 + 0.02, 0.6, 0.04);
      });
    } catch (_) {}
  }

  function playSuperFanfare() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      var notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1318.5, 1568];
      notes.forEach(function(freq, i) {
        xyloNote(freq, t + i * 0.09, 0.5, 0.14);
        chimeNote(freq * 2, t + i * 0.09 + 0.02, 0.7, 0.04);
      });
      chimeNote(2093, t + notes.length * 0.09, 1.0, 0.06);
    } catch (_) {}
  }

  function playStarChime() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      chimeNote(1318.5, t, 0.4, 0.1);
      chimeNote(1568, t + 0.08, 0.5, 0.1);
      xyloNote(2093, t + 0.16, 0.35, 0.07);
    } catch (_) {}
  }

  // ── Canvas sizing ────────────────────────────────────────────────
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    size = rect.width;
    if (size === 0) size = 300;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    center = size / 2;
    radius = center - 8;
    drawWheel();
  }

  window.addEventListener("resize", resize);

  // ── Cartoon food face (on wheel canvas) ──────────────────────────
  function drawFoodFace(x, y, sz, face) {
    ctx.save();
    var r = sz / 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = face.skin; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5; ctx.stroke();

    var eyeR = r * 0.22, eyeGap = r * 0.38, eyeY = y - r * 0.12;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x - eyeGap, eyeY, eyeR, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x + eyeGap, eyeY, eyeR, 0, 2 * Math.PI); ctx.fill();

    var pupilR = eyeR * 0.55;
    ctx.fillStyle = face.eyes;
    ctx.beginPath(); ctx.arc(x - eyeGap + 0.5, eyeY + 0.5, pupilR, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x + eyeGap + 0.5, eyeY + 0.5, pupilR, 0, 2 * Math.PI); ctx.fill();

    var shR = pupilR * 0.45;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x - eyeGap - 0.5, eyeY - 1, shR, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x + eyeGap - 0.5, eyeY - 1, shR, 0, 2 * Math.PI); ctx.fill();

    ctx.fillStyle = face.blush; ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.arc(x - r * 0.55, y + r * 0.15, r * 0.18, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.55, y + r * 0.15, r * 0.18, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(x, y + r * 0.08, r * 0.32, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = face.eyes; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.stroke();
    ctx.restore();
  }

  // ── Food face for mini canvas (modals) ───────────────────────────
  function drawFoodFaceMini(c, x, y, sz, face) {
    var r = sz / 2;
    c.beginPath(); c.arc(x, y, r, 0, 2 * Math.PI);
    c.fillStyle = face.skin; c.fill();
    c.strokeStyle = "rgba(0,0,0,0.1)"; c.lineWidth = 1; c.stroke();

    var eyeR = r * 0.22, eyeGap = r * 0.38, eyeY = y - r * 0.12;
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(x - eyeGap, eyeY, eyeR, 0, 2 * Math.PI); c.fill();
    c.beginPath(); c.arc(x + eyeGap, eyeY, eyeR, 0, 2 * Math.PI); c.fill();
    var pupilR = eyeR * 0.55;
    c.fillStyle = face.eyes;
    c.beginPath(); c.arc(x - eyeGap + 0.5, eyeY + 0.5, pupilR, 0, 2 * Math.PI); c.fill();
    c.beginPath(); c.arc(x + eyeGap + 0.5, eyeY + 0.5, pupilR, 0, 2 * Math.PI); c.fill();
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(x - eyeGap - 0.5, eyeY - 1, pupilR * 0.45, 0, 2 * Math.PI); c.fill();
    c.beginPath(); c.arc(x + eyeGap - 0.5, eyeY - 1, pupilR * 0.45, 0, 2 * Math.PI); c.fill();
    c.fillStyle = face.blush; c.globalAlpha = 0.45;
    c.beginPath(); c.arc(x - r * 0.55, y + r * 0.15, r * 0.18, 0, 2 * Math.PI); c.fill();
    c.beginPath(); c.arc(x + r * 0.55, y + r * 0.15, r * 0.18, 0, 2 * Math.PI); c.fill();
    c.globalAlpha = 1;
    c.beginPath();
    c.arc(x, y + r * 0.08, r * 0.32, 0.1 * Math.PI, 0.9 * Math.PI);
    c.strokeStyle = face.eyes; c.lineWidth = 2; c.lineCap = "round"; c.stroke();
  }

  // ── Rainbow ring ─────────────────────────────────────────────────
  var RAINBOW = ["#FF1744", "#FF9100", "#FFEA00", "#00E676", "#00B0FF", "#D500F9"];

  function drawRainbowRing() {
    var ringW = 6, ringR = radius + 4;
    var seg = (2 * Math.PI) / RAINBOW.length;
    for (var i = 0; i < RAINBOW.length; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, ringR, i * seg, (i + 1) * seg + 0.02);
      ctx.strokeStyle = RAINBOW[i]; ctx.lineWidth = ringW; ctx.stroke();
    }
  }

  // ── Curved text along an arc ──────────────────────────────────────
  function drawCurvedText(text, angStart, angEnd, dist) {
    var padding = 0.06;
    var aStart = angStart + padding;
    var aEnd = angEnd - padding;
    var charAngle = (aEnd - aStart) / (text.length + 1);
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + Math.round(size * 0.036) + "px 'Nunito', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    for (var i = 0; i < text.length; i++) {
      var angle = aStart + charAngle * (i + 1);
      ctx.save();
      ctx.rotate(angle);
      ctx.fillText(text[i], dist, 0);
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
  }

  // ── Draw wheel ───────────────────────────────────────────────────
  function drawWheel(highlightIdx) {
    if (highlightIdx === undefined) highlightIdx = -1;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    for (var i = 0; i < SLICE_COUNT; i++) {
      var startAngle = i * SLICE_ANGLE;
      var endAngle = startAngle + SLICE_ANGLE;
      var cat = CATEGORIES[i];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = i === highlightIdx ? cat.highlight : cat.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      var midAngle = startAngle + SLICE_ANGLE / 2;
      ctx.rotate(midAngle);

      // Emoji toward the outer rim
      ctx.font = Math.round(size * 0.13) + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cat.emoji, radius * 0.72, 0);

      // Label in front (closer to center), drawn last so it's on top
      ctx.fillStyle = "#fff";
      ctx.font = "bold " + Math.round(size * 0.046) + "px 'Nunito', sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(cat.name, radius * 0.43, 0);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 4;
    ctx.stroke();

    drawRainbowRing();
    ctx.restore();
  }

  // ── Winning slice ────────────────────────────────────────────────
  function getWinningIndex() {
    var twoPi = 2 * Math.PI;
    var arrowAngle = 3 * Math.PI / 2;
    var effective = ((arrowAngle - rotation) % twoPi + twoPi) % twoPi;
    return Math.floor(effective / SLICE_ANGLE) % SLICE_COUNT;
  }

  // ── Animation loop ───────────────────────────────────────────────
  var FRICTION = 0.985;
  var MIN_VELOCITY = 0.001;

  function animate() {
    rotation += velocity;
    velocity *= FRICTION;

    var currIdx = getWinningIndex();
    if (currIdx !== prevSliceIdx && velocity > 0.01) {
      arrowEl.classList.add("tick");
      setTimeout(function() { arrowEl.classList.remove("tick"); }, 80);
      playTick();
      prevSliceIdx = currIdx;
    }

    drawWheel();

    if (Math.abs(velocity) < MIN_VELOCITY) {
      velocity = 0;
      spinning = false;
      spinBtn.disabled = false;
      challengeBtn.disabled = false;
      cancelAnimationFrame(animFrameId);
      onSpinComplete();
      return;
    }

    animFrameId = requestAnimationFrame(animate);
  }

  // ── Spin ─────────────────────────────────────────────────────────
  function spin(initialVelocity) {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    challengeBtn.disabled = true;
    prevSliceIdx = -1;
    velocity = initialVelocity || (0.25 + Math.random() * 0.35);
    setMascotState("excited");
    playWhoosh();
    animFrameId = requestAnimationFrame(animate);
  }

  spinBtn.addEventListener("mousedown", function(e) { e.stopPropagation(); });
  spinBtn.addEventListener("touchstart", function(e) { e.stopPropagation(); });
  spinBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    challengeMode = false;
    spin();
  });

  // ── Mascot ───────────────────────────────────────────────────────
  function setMascotState(state) {
    mascotEl.className = "mascot";
    if (state) mascotEl.classList.add(state);
  }

  // ── On spin complete ─────────────────────────────────────────────
  function onSpinComplete() {
    var winIdx = getWinningIndex();
    var cat = CATEGORIES[winIdx];
    drawWheel(winIdx);
    playFanfare();
    setMascotState("cheering");

    if (challengeMode) {
      challengeResults.push({
        category: cat.name,
        food: pickRandom(cat.items, 1)[0],
        face: cat.face,
      });
      challengeStep++;
      if (challengeStep < CHALLENGE_SLICES.length) {
        setTimeout(function() { targetSpin(CHALLENGE_SLICES[challengeStep]); }, 900);
      } else {
        setTimeout(showChallengeResult, 600);
      }
      return;
    }

    showSingleResult(cat);
  }

  // ── Single result modal ──────────────────────────────────────────
  function showSingleResult(cat) {
    modalTitle.textContent = cat.name;
    suggestionsEl.innerHTML = "";
    pickRandom(cat.items, 3).forEach(function(item) {
      var li = document.createElement("li");
      li.textContent = item;
      suggestionsEl.appendChild(li);
    });
    spawnConfetti(confettiEl);
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
    confettiEl.innerHTML = "";
    setMascotState(null);
  }

  spinAgainBtn.addEventListener("click", function() {
    closeModal();
    challengeMode = false;
    setTimeout(function() { spin(); }, 400);
  });

  modal.addEventListener("click", function(e) {
    if (e.target === modal) closeModal();
  });

  // ── Stars ────────────────────────────────────────────────────────
  function addStar(count) {
    stars += count;
    localStorage.setItem("dinnerSpinnerStars", stars);
    starCountEl.textContent = stars;
    playStarChime();
    starBarEl.classList.remove("pop");
    void starBarEl.offsetWidth;
    starBarEl.classList.add("pop");
    if (stars > 0 && stars % 5 === 0) {
      setTimeout(showSuperEater, 500);
    }
  }

  document.getElementById("starReset").addEventListener("click", function(e) {
    e.stopPropagation();
    if (stars === 0) return;
    if (confirm("Reset all your stars back to 0?")) {
      stars = 0;
      localStorage.setItem("dinnerSpinnerStars", 0);
      starCountEl.textContent = 0;
    }
  });

  ateItBtn.addEventListener("click", function() {
    addStar(1);
    closeModal();
  });

  challengeAteItBtn.addEventListener("click", function() {
    addStar(3);
    closeChallengeModal();
  });

  function showSuperEater() {
    playSuperFanfare();
    spawnConfetti(superConfettiEl);
    superEaterOverlay.classList.add("active");
    setMascotState("cheering");
  }

  superEaterClose.addEventListener("click", function() {
    superEaterOverlay.classList.remove("active");
    superConfettiEl.innerHTML = "";
    setMascotState(null);
  });

  // ── Dinner Challenge ─────────────────────────────────────────────
  function targetSpin(sliceIdx) {
    velocity = 0.35 + Math.random() * 0.15;
    spinning = true;
    spinBtn.disabled = true;
    challengeBtn.disabled = true;
    prevSliceIdx = -1;
    setMascotState("excited");
    playWhoosh();
    animFrameId = requestAnimationFrame(animate);
  }

  challengeBtn.addEventListener("click", function() {
    if (spinning) return;
    challengeMode = true;
    challengeResults = [];
    challengeStep = 0;
    targetSpin(CHALLENGE_SLICES[0]);
  });

  function showChallengeResult() {
    mealSlotsEl.innerHTML = "";
    challengeResults.forEach(function(r) {
      var slot = document.createElement("div");
      slot.className = "meal-slot";

      var iconCanvas = document.createElement("canvas");
      iconCanvas.width = 48;
      iconCanvas.height = 48;
      iconCanvas.className = "meal-slot-icon";
      drawFoodFaceMini(iconCanvas.getContext("2d"), 24, 24, 22, r.face);

      var info = document.createElement("div");
      info.className = "meal-slot-info";
      info.innerHTML = '<span class="meal-slot-category">' + r.category + '</span><span class="meal-slot-food">' + r.food + '</span>';

      slot.appendChild(iconCanvas);
      slot.appendChild(info);
      mealSlotsEl.appendChild(slot);
    });

    playFanfare();
    spawnConfetti(challengeConfettiEl);
    challengeModal.classList.add("active");
    setMascotState("cheering");
  }

  function closeChallengeModal() {
    challengeModal.classList.remove("active");
    challengeConfettiEl.innerHTML = "";
    challengeMode = false;
    setMascotState(null);
  }

  challengeAgainBtn.addEventListener("click", function() {
    closeChallengeModal();
    setTimeout(function() {
      challengeMode = true;
      challengeResults = [];
      challengeStep = 0;
      targetSpin(CHALLENGE_SLICES[0]);
    }, 400);
  });

  challengeModal.addEventListener("click", function(e) {
    if (e.target === challengeModal) closeChallengeModal();
  });

  // ── Swipe / flick to spin ────────────────────────────────────────
  var touchStartY = 0, touchStartTime = 0;

  canvas.addEventListener("touchstart", function(e) {
    if (spinning) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  canvas.addEventListener("touchend", function(e) {
    if (spinning) return;
    var dy = touchStartY - e.changedTouches[0].clientY;
    var dt = Date.now() - touchStartTime;
    if (dy > 30 && dt < 500) {
      var speed = Math.min(Math.abs(dy) / dt, 3);
      challengeMode = false;
      spin(0.15 + speed * 0.3);
    }
  }, { passive: true });

  var mouseStartY = 0, mouseStartTime = 0, mouseDown = false;

  canvas.addEventListener("mousedown", function(e) {
    if (spinning) return;
    mouseDown = true;
    mouseStartY = e.clientY;
    mouseStartTime = Date.now();
  });

  window.addEventListener("mouseup", function(e) {
    if (!mouseDown || spinning) return;
    mouseDown = false;
    var dy = mouseStartY - e.clientY;
    var dt = Date.now() - mouseStartTime;
    if (dy > 30 && dt < 500) {
      var speed = Math.min(Math.abs(dy) / dt, 3);
      challengeMode = false;
      spin(0.15 + speed * 0.3);
    }
  });

  // ── Shake to spin ────────────────────────────────────────────────
  var lastShakeTime = 0;

  function handleMotion(e) {
    var acc = e.accelerationIncludingGravity;
    if (!acc) return;
    var total = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    var now = Date.now();
    if (total > 25 && now - lastShakeTime > 1200 && !spinning) {
      lastShakeTime = now;
      challengeMode = false;
      spin(0.3 + Math.random() * 0.25);
    }
  }

  if (window.DeviceMotionEvent) {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      document.body.addEventListener("click", function reqPerm() {
        DeviceMotionEvent.requestPermission().then(function(state) {
          if (state === "granted") window.addEventListener("devicemotion", handleMotion);
        }).catch(function() {});
        document.body.removeEventListener("click", reqPerm);
      }, { once: true });
    } else {
      window.addEventListener("devicemotion", handleMotion);
    }
  }

  // ── Confetti ─────────────────────────────────────────────────────
  var CONFETTI_COLORS = ["#FF1744", "#FFD600", "#00E676", "#00B0FF", "#FF9100", "#D500F9", "#FF3D00"];

  function spawnConfetti(container) {
    container.innerHTML = "";
    for (var i = 0; i < 45; i++) {
      var piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.left = (Math.random() * 100) + "%";
      piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.animationDuration = (1 + Math.random() * 1.5) + "s";
      piece.style.animationDelay = (Math.random() * 0.5) + "s";
      piece.style.width = (6 + Math.random() * 8) + "px";
      piece.style.height = (6 + Math.random() * 8) + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      container.appendChild(piece);
    }
  }

  // ── Utilities ────────────────────────────────────────────────────
  function pickRandom(arr, count) {
    var shuffled = arr.slice().sort(function() { return 0.5 - Math.random(); });
    return shuffled.slice(0, count);
  }

  // ── Init ─────────────────────────────────────────────────────────
  resize();

})();
