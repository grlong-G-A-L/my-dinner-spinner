window.onerror = function(msg, src, line, col, err) {
  document.title = "ERR: " + msg;
  var d = document.createElement("div");
  d.style.cssText = "position:fixed;top:0;left:0;right:0;background:red;color:#fff;padding:12px;z-index:9999;font:14px monospace;white-space:pre-wrap";
  d.textContent = "Error at line " + line + ":\n" + msg + "\n" + (err && err.stack || "");
  document.body.prepend(d);
};

(() => {
  "use strict";

  // ── Wheel Themes ──────────────────────────────────────────────────
  const WHEEL_THEMES = {
    dinner: {
      label: "Dinner", emoji: "\u{1F37D}\uFE0F",
      challengeSlices: [3, 0, 4],
      categories: [
        { name: "Veggies", emoji: "\u{1F966}", color: "#43A047", highlight: "#66BB6A",
          face: { bg: "#43A047", skin: "#81C784", eyes: "#1B5E20", blush: "#A5D6A7" },
          items: ["Broccoli", "Carrots", "Peas", "Corn", "Spinach", "Green Beans", "Zucchini", "Sweet Potato"] },
        { name: "Fruits", emoji: "\u{1F353}", color: "#FB8C00", highlight: "#FFA726",
          face: { bg: "#FB8C00", skin: "#FFB74D", eyes: "#E65100", blush: "#FFCC80" },
          items: ["Apples", "Bananas", "Strawberries", "Grapes", "Watermelon", "Blueberries", "Mango", "Peaches"] },
        { name: "Dairy", emoji: "\u{1F9C0}", color: "#00ACC1", highlight: "#26C6DA",
          face: { bg: "#00ACC1", skin: "#80DEEA", eyes: "#006064", blush: "#B2EBF2" },
          items: ["Milk", "Cheese", "Yogurt", "Butter", "Ice Cream", "Cottage Cheese", "Cream Cheese"] },
        { name: "Protein", emoji: "\u{1F357}", color: "#E53935", highlight: "#EF5350",
          face: { bg: "#E53935", skin: "#EF9A9A", eyes: "#B71C1C", blush: "#FFCDD2" },
          items: ["Chicken", "Beef", "Fish", "Eggs", "Beans", "Turkey", "Shrimp", "Tofu"] },
        { name: "Sides", emoji: "\u{1F372}", color: "#FFB300", highlight: "#FFCA28",
          face: { bg: "#FFB300", skin: "#FFE082", eyes: "#E65100", blush: "#FFF8E1" },
          items: ["Mashed Potatoes", "Rice", "Mac & Cheese", "Coleslaw", "Cornbread", "Baked Beans", "Dinner Rolls", "Applesauce", "Potato Salad", "Garlic Bread"] },
        { name: "Drinks", emoji: "\u{1F95B}", color: "#1E88E5", highlight: "#42A5F5",
          face: { bg: "#1E88E5", skin: "#90CAF9", eyes: "#0D47A1", blush: "#BBDEFB" },
          items: ["Water", "Juice", "Smoothie", "Lemonade", "Milk", "Hot Cocoa", "Sparkling Water"] },
      ]
    },
    breakfast: {
      label: "Breakfast", emoji: "\u{1F373}",
      challengeSlices: [1, 3, 5],
      categories: [
        { name: "Cereal", emoji: "\u{1F963}", color: "#FFB300", highlight: "#FFCA28",
          face: { bg: "#FFB300", skin: "#FFE082", eyes: "#E65100", blush: "#FFF8E1" },
          items: ["Cheerios", "Granola", "Oatmeal", "Corn Flakes", "Rice Krispies", "Muesli"] },
        { name: "Eggs", emoji: "\u{1F95A}", color: "#FDD835", highlight: "#FFEE58",
          face: { bg: "#FDD835", skin: "#FFF9C4", eyes: "#F57F17", blush: "#FFF59D" },
          items: ["Scrambled Eggs", "Fried Egg", "Hard Boiled", "Omelette", "Egg Muffin", "Egg & Cheese"] },
        { name: "Fruit", emoji: "\u{1F34C}", color: "#FB8C00", highlight: "#FFA726",
          face: { bg: "#FB8C00", skin: "#FFB74D", eyes: "#E65100", blush: "#FFCC80" },
          items: ["Banana", "Apple Slices", "Berries", "Melon", "Grapes", "Fruit Cup", "Orange Slices"] },
        { name: "Toast", emoji: "\u{1F35E}", color: "#8D6E63", highlight: "#A1887F",
          face: { bg: "#8D6E63", skin: "#BCAAA4", eyes: "#4E342E", blush: "#D7CCC8" },
          items: ["Toast & Jam", "Peanut Butter Toast", "Cinnamon Toast", "Bagel", "English Muffin", "Waffles"] },
        { name: "Pancakes", emoji: "\u{1F95E}", color: "#E53935", highlight: "#EF5350",
          face: { bg: "#E53935", skin: "#EF9A9A", eyes: "#B71C1C", blush: "#FFCDD2" },
          items: ["Pancakes", "French Toast", "Crepes", "Pancake Bites", "Blueberry Pancakes"] },
        { name: "Drinks", emoji: "\u{1F34A}", color: "#1E88E5", highlight: "#42A5F5",
          face: { bg: "#1E88E5", skin: "#90CAF9", eyes: "#0D47A1", blush: "#BBDEFB" },
          items: ["Orange Juice", "Milk", "Apple Juice", "Smoothie", "Hot Cocoa", "Water"] },
      ]
    },
    snack: {
      label: "Snack", emoji: "\u{1F36A}",
      challengeSlices: [0, 2, 4],
      categories: [
        { name: "Crunchy", emoji: "\u{1F96C}", color: "#43A047", highlight: "#66BB6A",
          face: { bg: "#43A047", skin: "#81C784", eyes: "#1B5E20", blush: "#A5D6A7" },
          items: ["Crackers", "Pretzels", "Popcorn", "Celery Sticks", "Carrot Sticks", "Granola Bar", "Rice Cakes"] },
        { name: "Fruity", emoji: "\u{1F347}", color: "#AB47BC", highlight: "#CE93D8",
          face: { bg: "#AB47BC", skin: "#E1BEE7", eyes: "#6A1B9A", blush: "#F3E5F5" },
          items: ["Apple Slices", "Grapes", "Dried Fruit", "Fruit Leather", "Raisins", "Banana"] },
        { name: "Cheesy", emoji: "\u{1F9C0}", color: "#FFB300", highlight: "#FFCA28",
          face: { bg: "#FFB300", skin: "#FFE082", eyes: "#E65100", blush: "#FFF8E1" },
          items: ["String Cheese", "Cheese Cubes", "Cheese & Crackers", "Cheese Puffs", "Goldfish"] },
        { name: "Dips", emoji: "\u{1FAD5}", color: "#00ACC1", highlight: "#26C6DA",
          face: { bg: "#00ACC1", skin: "#80DEEA", eyes: "#006064", blush: "#B2EBF2" },
          items: ["Hummus", "Ranch & Veggies", "Apple & PB", "Guacamole", "Yogurt Dip", "Salsa"] },
        { name: "Sweet", emoji: "\u{1F36F}", color: "#E53935", highlight: "#EF5350",
          face: { bg: "#E53935", skin: "#EF9A9A", eyes: "#B71C1C", blush: "#FFCDD2" },
          items: ["Yogurt", "Trail Mix", "Fruit Snacks", "Granola Bites", "Applesauce", "Pudding"] },
        { name: "Frozen", emoji: "\u{1F366}", color: "#1E88E5", highlight: "#42A5F5",
          face: { bg: "#1E88E5", skin: "#90CAF9", eyes: "#0D47A1", blush: "#BBDEFB" },
          items: ["Frozen Grapes", "Popsicle", "Frozen Yogurt", "Ice Cream Bar", "Smoothie Pop"] },
      ]
    },
    lunchbox: {
      label: "Lunchbox", emoji: "\u{1F9F3}",
      challengeSlices: [0, 2, 4],
      categories: [
        { name: "Sandwich", emoji: "\u{1F96A}", color: "#8D6E63", highlight: "#A1887F",
          face: { bg: "#8D6E63", skin: "#BCAAA4", eyes: "#4E342E", blush: "#D7CCC8" },
          items: ["PB & J", "Turkey Sandwich", "Ham & Cheese", "Grilled Cheese", "Wrap", "Bagel & Cream Cheese"] },
        { name: "Fruit", emoji: "\u{1F34E}", color: "#E53935", highlight: "#EF5350",
          face: { bg: "#E53935", skin: "#EF9A9A", eyes: "#B71C1C", blush: "#FFCDD2" },
          items: ["Apple", "Grapes", "Banana", "Strawberries", "Mandarin", "Fruit Cup"] },
        { name: "Veggie", emoji: "\u{1F955}", color: "#43A047", highlight: "#66BB6A",
          face: { bg: "#43A047", skin: "#81C784", eyes: "#1B5E20", blush: "#A5D6A7" },
          items: ["Baby Carrots", "Cucumber Slices", "Cherry Tomatoes", "Celery", "Snap Peas", "Bell Pepper Strips"] },
        { name: "Snack", emoji: "\u{1F36A}", color: "#FFB300", highlight: "#FFCA28",
          face: { bg: "#FFB300", skin: "#FFE082", eyes: "#E65100", blush: "#FFF8E1" },
          items: ["Crackers", "Cheese Stick", "Granola Bar", "Pretzels", "Goldfish", "Trail Mix"] },
        { name: "Drink", emoji: "\u{1F9C3}", color: "#1E88E5", highlight: "#42A5F5",
          face: { bg: "#1E88E5", skin: "#90CAF9", eyes: "#0D47A1", blush: "#BBDEFB" },
          items: ["Water", "Juice Box", "Milk", "Smoothie", "Lemonade"] },
        { name: "Treat", emoji: "\u{1F370}", color: "#AB47BC", highlight: "#CE93D8",
          face: { bg: "#AB47BC", skin: "#E1BEE7", eyes: "#6A1B9A", blush: "#F3E5F5" },
          items: ["Cookie", "Brownie Bite", "Fruit Snacks", "Muffin", "Rice Krispie Treat", "Pudding Cup"] },
      ]
    }
  };

  // ── Avatars ─────────────────────────────────────────────────────────
  const AVATARS = [
    { id: "fox", emoji: "\u{1F98A}" },
    { id: "cat", emoji: "\u{1F431}" },
    { id: "bear", emoji: "\u{1F43B}" },
    { id: "bunny", emoji: "\u{1F430}" },
    { id: "unicorn", emoji: "\u{1F984}" },
    { id: "panda", emoji: "\u{1F43C}" },
    { id: "penguin", emoji: "\u{1F427}" },
    { id: "frog", emoji: "\u{1F438}" },
  ];

  function avatarEmoji(id) {
    var a = AVATARS.find(function(av) { return av.id === id; });
    return a ? a.emoji : "\u{1F466}";
  }

  // ── Badges ──────────────────────────────────────────────────────────
  const BADGES = [
    { id: "first_spin", name: "First Spin", emoji: "\u{2B50}", desc: "Complete your first spin",
      check: function(p) { return p.stars >= 1; } },
    { id: "veggie_champ", name: "Veggie Champ", emoji: "\u{1F966}", desc: "Eat 5 veggies",
      check: function(p) { return (p.history.Veggies || 0) >= 5; } },
    { id: "fruit_fan", name: "Fruit Fan", emoji: "\u{1F353}", desc: "Eat 5 fruits",
      check: function(p) { return (p.history.Fruits || 0) >= 5; } },
    { id: "dairy_star", name: "Dairy Star", emoji: "\u{1F9C0}", desc: "Eat 5 dairy",
      check: function(p) { return (p.history.Dairy || 0) >= 5; } },
    { id: "protein_power", name: "Protein Power", emoji: "\u{1F357}", desc: "Eat 5 proteins",
      check: function(p) { return (p.history.Protein || 0) >= 5; } },
    { id: "sides_master", name: "Sides Master", emoji: "\u{1F372}", desc: "Eat 5 sides",
      check: function(p) { return (p.history.Sides || 0) >= 5; } },
    { id: "hydration_hero", name: "Hydration Hero", emoji: "\u{1F95B}", desc: "Drink 5 drinks",
      check: function(p) { return (p.history.Drinks || 0) >= 5; } },
    { id: "balanced_plate", name: "Balanced Plate", emoji: "\u{1F37D}\uFE0F", desc: "Eat from all 6 dinner categories",
      check: function(p) {
        var cats = ["Veggies", "Fruits", "Dairy", "Protein", "Sides", "Drinks"];
        return cats.every(function(c) { return (p.history[c] || 0) >= 1; });
      } },
    { id: "super_taster", name: "Super Taster", emoji: "\u{1F60B}", desc: "Eat 20 total items",
      check: function(p) {
        var total = 0;
        Object.keys(p.history).forEach(function(k) { total += p.history[k]; });
        return total >= 20;
      } },
    { id: "dinner_legend", name: "Dinner Legend", emoji: "\u{1F3C6}", desc: "Earn 25 stars",
      check: function(p) { return p.stars >= 25; } },
  ];

  // ── Profile Manager ─────────────────────────────────────────────────
  var DATA_KEY = "dinnerSpinnerData";

  function defaultProfile(name, avatar, existingStars) {
    return {
      name: name,
      avatar: avatar,
      stars: existingStars || 0,
      badges: [],
      history: {}
    };
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}

    var oldStars = parseInt(localStorage.getItem("dinnerSpinnerStars") || "0", 10);
    var data = {
      activeProfile: "player1",
      profiles: {
        player1: defaultProfile("Player 1", "fox", oldStars)
      }
    };
    localStorage.removeItem("dinnerSpinnerStars");
    saveData(data);
    return data;
  }

  function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  var appData = loadData();

  function activeProfile() {
    return appData.profiles[appData.activeProfile];
  }

  function saveProfile() {
    saveData(appData);
  }

  function createProfile(name, avatarId) {
    var id = "p_" + Date.now();
    appData.profiles[id] = defaultProfile(name, avatarId, 0);
    saveData(appData);
    return id;
  }

  function deleteProfile(id) {
    if (Object.keys(appData.profiles).length <= 1) return false;
    delete appData.profiles[id];
    if (appData.activeProfile === id) {
      appData.activeProfile = Object.keys(appData.profiles)[0];
    }
    saveData(appData);
    return true;
  }

  function switchProfile(id) {
    if (!appData.profiles[id]) return;
    appData.activeProfile = id;
    saveData(appData);
    refreshUI();
  }

  // ── Active theme state ──────────────────────────────────────────────
  var activeThemeId = "dinner";
  var CATEGORIES = WHEEL_THEMES.dinner.categories;
  var SLICE_COUNT = CATEGORIES.length;
  var SLICE_ANGLE = (2 * Math.PI) / SLICE_COUNT;
  var CHALLENGE_SLICES = WHEEL_THEMES.dinner.challengeSlices;

  function setTheme(themeId) {
    activeThemeId = themeId;
    var theme = WHEEL_THEMES[themeId];
    CATEGORIES = theme.categories;
    SLICE_COUNT = CATEGORIES.length;
    SLICE_ANGLE = (2 * Math.PI) / SLICE_COUNT;
    CHALLENGE_SLICES = theme.challengeSlices;
    document.querySelectorAll(".theme-pill").forEach(function(btn) {
      btn.classList.toggle("active", btn.dataset.theme === themeId);
    });
    drawWheel();
  }

  // ── DOM refs ────────────────────────────────────────────────────────
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = document.getElementById("spinBtn");
  const arrowEl = document.querySelector(".arrow");
  const mascotEl = document.getElementById("mascot");
  const challengeBtn = document.getElementById("challengeBtn");

  const profileAvatarEl = document.getElementById("profileAvatar");
  const profileNameEl = document.getElementById("profileName");
  const profileStarsEl = document.getElementById("profileStars");
  const profileBarEl = document.getElementById("profileBar");
  const profileSwitchBtn = document.getElementById("profileSwitchBtn");
  const trophyBtn = document.getElementById("trophyBtn");

  const modal = document.getElementById("modal");
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

  const profilePickerOverlay = document.getElementById("profilePicker");
  const profileListEl = document.getElementById("profileList");
  const addProfileBtn = document.getElementById("addProfileBtn");
  const profileFormEl = document.getElementById("profileForm");
  const profileNameInput = document.getElementById("profileNameInput");
  const avatarGridEl = document.getElementById("avatarGrid");
  const profileFormSave = document.getElementById("profileFormSave");
  const profileFormCancel = document.getElementById("profileFormCancel");

  const badgeCaseOverlay = document.getElementById("badgeCase");
  const badgeGridEl = document.getElementById("badgeGrid");
  const badgeCaseClose = document.getElementById("badgeCaseClose");

  const badgeToastEl = document.getElementById("badgeToast");

  // ── Game state ──────────────────────────────────────────────────────
  let rotation = 0;
  let velocity = 0;
  let spinning = false;
  let animFrameId = null;
  let size = 0;
  let center = 0;
  let radius = 0;
  let challengeMode = false;
  let challengeResults = [];
  let challengeStep = 0;
  let prevSliceIdx = -1;
  var lastWinCategory = null;

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
      xyloNote(800 + Math.random() * 400, t, 0.08, 0.09);
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
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(t); osc.stop(t + 0.3);
      var len = audioCtx.sampleRate * 0.2;
      var buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      var src = audioCtx.createBufferSource(); src.buffer = buf;
      var ng = audioCtx.createGain();
      var filt = audioCtx.createBiquadFilter();
      filt.type = "highpass"; filt.frequency.value = 2000;
      src.connect(filt); filt.connect(ng); ng.connect(audioCtx.destination);
      ng.gain.setValueAtTime(0.06, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      src.start(t);
    } catch (_) {}
  }

  function playFanfare() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function(freq, i) {
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

  function playBadgeChime() {
    try {
      if (!ensureAudio()) return;
      var t = audioCtx.currentTime;
      xyloNote(783.99, t, 0.3, 0.12);
      xyloNote(1046.5, t + 0.1, 0.3, 0.12);
      chimeNote(1568, t + 0.2, 0.6, 0.1);
      chimeNote(2093, t + 0.3, 0.8, 0.06);
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

  // ── Cartoon food face ──────────────────────────────────────────────
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

      ctx.font = Math.round(size * 0.13) + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cat.emoji, radius * 0.72, 0);

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
    lastWinCategory = cat.name;
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

  // ── Stars & History ──────────────────────────────────────────────
  function addStar(count) {
    var p = activeProfile();
    p.stars += count;
    profileStarsEl.textContent = p.stars;
    playStarChime();
    profileBarEl.classList.remove("pop");
    void profileBarEl.offsetWidth;
    profileBarEl.classList.add("pop");
    saveProfile();
    checkBadges();
    if (p.stars > 0 && p.stars % 5 === 0) {
      setTimeout(showSuperEater, 500);
    }
  }

  function incrementHistory(categoryName) {
    var p = activeProfile();
    if (!p.history[categoryName]) p.history[categoryName] = 0;
    p.history[categoryName]++;
    saveProfile();
  }

  document.getElementById("starReset").addEventListener("click", function(e) {
    e.stopPropagation();
    var p = activeProfile();
    if (p.stars === 0) return;
    if (confirm("Reset " + p.name + "'s stars back to 0?")) {
      p.stars = 0;
      profileStarsEl.textContent = 0;
      saveProfile();
    }
  });

  ateItBtn.addEventListener("click", function() {
    if (lastWinCategory) incrementHistory(lastWinCategory);
    addStar(1);
    closeModal();
  });

  challengeAteItBtn.addEventListener("click", function() {
    challengeResults.forEach(function(r) {
      incrementHistory(r.category);
    });
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

  // ── Badge checking ───────────────────────────────────────────────
  function checkBadges() {
    var p = activeProfile();
    var newBadges = [];
    BADGES.forEach(function(b) {
      if (p.badges.indexOf(b.id) === -1 && b.check(p)) {
        p.badges.push(b.id);
        newBadges.push(b);
      }
    });
    saveProfile();
    if (newBadges.length > 0) {
      showBadgeToasts(newBadges);
    }
  }

  var badgeToastQueue = [];
  var badgeToastActive = false;

  function showBadgeToasts(badges) {
    badges.forEach(function(b) { badgeToastQueue.push(b); });
    if (!badgeToastActive) drainBadgeToast();
  }

  function drainBadgeToast() {
    if (badgeToastQueue.length === 0) {
      badgeToastActive = false;
      return;
    }
    badgeToastActive = true;
    var b = badgeToastQueue.shift();
    badgeToastEl.innerHTML = '<span class="badge-toast-emoji">' + b.emoji + '</span> Badge: <strong>' + b.name + '</strong>';
    badgeToastEl.classList.add("show");
    playBadgeChime();
    setTimeout(function() {
      badgeToastEl.classList.remove("show");
      setTimeout(drainBadgeToast, 400);
    }, 2500);
  }

  // ── Badge trophy case ────────────────────────────────────────────
  function showBadgeCase() {
    var p = activeProfile();
    badgeGridEl.innerHTML = "";
    BADGES.forEach(function(b) {
      var unlocked = p.badges.indexOf(b.id) !== -1;
      var item = document.createElement("div");
      item.className = "badge-item" + (unlocked ? " unlocked" : "");
      item.innerHTML =
        '<div class="badge-emoji">' + (unlocked ? b.emoji : "?") + '</div>' +
        '<div class="badge-name">' + b.name + '</div>' +
        '<div class="badge-desc">' + b.desc + '</div>';
      badgeGridEl.appendChild(item);
    });
    badgeCaseOverlay.classList.add("active");
  }

  trophyBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    showBadgeCase();
  });

  badgeCaseClose.addEventListener("click", function() {
    badgeCaseOverlay.classList.remove("active");
  });

  badgeCaseOverlay.addEventListener("click", function(e) {
    if (e.target === badgeCaseOverlay) badgeCaseOverlay.classList.remove("active");
  });

  // ── Profile picker ───────────────────────────────────────────────
  var selectedAvatar = "fox";

  function showProfilePicker() {
    profileFormEl.style.display = "none";
    profileListEl.style.display = "";
    renderProfileList();
    profilePickerOverlay.classList.add("active");
  }

  function renderProfileList() {
    profileListEl.innerHTML = "";
    var keys = Object.keys(appData.profiles);
    keys.forEach(function(id) {
      var p = appData.profiles[id];
      var card = document.createElement("div");
      card.className = "profile-card" + (id === appData.activeProfile ? " active" : "");
      card.innerHTML =
        '<span class="profile-card-avatar">' + avatarEmoji(p.avatar) + '</span>' +
        '<span class="profile-card-name">' + p.name + '</span>' +
        '<span class="profile-card-stars">\u2B50 ' + p.stars + '</span>';

      if (keys.length > 1) {
        var del = document.createElement("button");
        del.className = "profile-card-delete";
        del.textContent = "\u2715";
        del.title = "Delete " + p.name;
        del.addEventListener("click", function(e) {
          e.stopPropagation();
          if (confirm("Delete " + p.name + "'s profile? This can't be undone.")) {
            deleteProfile(id);
            renderProfileList();
            refreshUI();
          }
        });
        card.appendChild(del);
      }

      card.addEventListener("click", function() {
        switchProfile(id);
        profilePickerOverlay.classList.remove("active");
      });
      profileListEl.appendChild(card);
    });
  }

  addProfileBtn.addEventListener("click", function() {
    if (Object.keys(appData.profiles).length >= 6) {
      alert("Maximum 6 profiles!");
      return;
    }
    profileListEl.style.display = "none";
    profileFormEl.style.display = "";
    profileNameInput.value = "";
    selectedAvatar = "fox";
    renderAvatarGrid();
    profileNameInput.focus();
  });

  function renderAvatarGrid() {
    avatarGridEl.innerHTML = "";
    AVATARS.forEach(function(av) {
      var btn = document.createElement("button");
      btn.className = "avatar-btn" + (av.id === selectedAvatar ? " selected" : "");
      btn.textContent = av.emoji;
      btn.addEventListener("click", function() {
        selectedAvatar = av.id;
        renderAvatarGrid();
      });
      avatarGridEl.appendChild(btn);
    });
  }

  profileFormSave.addEventListener("click", function() {
    var name = profileNameInput.value.trim();
    if (!name) { profileNameInput.focus(); return; }
    if (name.length > 12) name = name.substring(0, 12);
    var id = createProfile(name, selectedAvatar);
    switchProfile(id);
    profilePickerOverlay.classList.remove("active");
  });

  profileFormCancel.addEventListener("click", function() {
    profileFormEl.style.display = "none";
    profileListEl.style.display = "";
  });

  profileSwitchBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    showProfilePicker();
  });

  profilePickerOverlay.addEventListener("click", function(e) {
    if (e.target === profilePickerOverlay) profilePickerOverlay.classList.remove("active");
  });

  // ── Theme selector ───────────────────────────────────────────────
  document.querySelectorAll(".theme-pill").forEach(function(btn) {
    btn.addEventListener("click", function() {
      if (spinning) return;
      setTheme(btn.dataset.theme);
    });
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
      iconCanvas.width = 48; iconCanvas.height = 48;
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
      challengeMode = false;
      spin(0.15 + Math.min(Math.abs(dy) / dt, 3) * 0.3);
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
      challengeMode = false;
      spin(0.15 + Math.min(Math.abs(dy) / dt, 3) * 0.3);
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

  // ── Refresh UI from profile data ─────────────────────────────────
  function refreshUI() {
    var p = activeProfile();
    profileAvatarEl.textContent = avatarEmoji(p.avatar);
    profileNameEl.textContent = p.name;
    profileStarsEl.textContent = p.stars;
  }

  // ── Init ─────────────────────────────────────────────────────────
  refreshUI();
  setTheme("dinner");
  resize();

})();
