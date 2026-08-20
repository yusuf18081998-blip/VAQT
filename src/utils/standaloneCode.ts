export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="uz" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VAQT — Zamonaviy Soat, Sekundomer & Pomodoro</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Asosiy CSS Ulanishi -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Orqa fon nurlanish effektlari (Ambient Glows) -->
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>
  <div class="ambient-glow glow-3"></div>

  <!-- Asosiy Konteyner -->
  <div class="app-wrapper">
    <!-- Yuqori Navigatsiya & Boshqaruv -->
    <header class="glass-header">
      <div class="brand">
        <div class="brand-icon">
          <i data-lucide="clock"></i>
        </div>
        <div class="brand-text">
          <span class="logo-title">VAQT</span>
          <span class="logo-badge">PRO</span>
        </div>
      </div>

      <!-- Menyu Tugmalari (Tabs) -->
      <nav class="nav-tabs" role="tablist">
        <button class="tab-btn active" data-tab="clock" title="Aniq Soat">
          <i data-lucide="clock-4"></i>
          <span>Soat</span>
        </button>
        <button class="tab-btn" data-tab="stopwatch" title="Sekundomer">
          <i data-lucide="timer"></i>
          <span>Sekundomer</span>
        </button>
        <button class="tab-btn" data-tab="pomodoro" title="Pomodoro Taymeri">
          <i data-lucide="flame"></i>
          <span>Pomodoro</span>
        </button>
        <button class="tab-btn" data-tab="countdown" title="Qaytma Taymer">
          <i data-lucide="hourglass"></i>
          <span>Taymer</span>
        </button>
      </nav>

      <!-- O'ng tomondagi tugmalar: Tema, Ovoz, Sozlamalar -->
      <div class="header-actions">
        <button id="themeToggleBtn" class="icon-btn" title="Mavzuni almashtirish (Dark/Light)">
          <i data-lucide="sun" id="themeIcon"></i>
        </button>
        <button id="soundTestBtn" class="icon-btn" title="Signal ovozini sinab ko'rish">
          <i data-lucide="volume-2"></i>
        </button>
        <button id="fullscreenBtn" class="icon-btn" title="To'liq ekran">
          <i data-lucide="maximize"></i>
        </button>
      </div>
    </header>

    <!-- Asosiy Bo'limlar -->
    <main class="main-content">
      <!-- 1. SOAT BO'LIMI -->
      <section id="clock-tab" class="tab-panel active">
        <div class="glass-card main-clock-card">
          <div class="clock-mode-toggles">
            <button id="toggleFormatBtn" class="chip-btn">24 Soatlik format</button>
            <button id="toggleAnalogBtn" class="chip-btn"><i data-lucide="compass"></i> Analog soat</button>
          </div>

          <!-- Raqamli Soat -->
          <div id="digitalClockContainer" class="digital-clock-display">
            <div class="time-main">
              <span id="clockHours">00</span><span class="colon-pulse">:</span><span id="clockMinutes">00</span><span class="colon-pulse">:</span><span id="clockSeconds">00</span>
              <span id="clockAmPm" class="ampm-tag"></span>
            </div>
            <div class="date-display" id="clockDate">Yuklanmoqda...</div>
          </div>

          <!-- Analog Soat (Yashirin/Ko'rinuvchi) -->
          <div id="analogClockContainer" class="analog-clock-wrapper hidden">
            <div class="analog-dial">
              <div class="analog-center"></div>
              <div class="hand hour-hand" id="analogHour"></div>
              <div class="hand minute-hand" id="analogMinute"></div>
              <div class="hand second-hand" id="analogSecond"></div>
              <div class="dial-marker marker-12">12</div>
              <div class="dial-marker marker-3">3</div>
              <div class="dial-marker marker-6">6</div>
              <div class="dial-marker marker-9">9</div>
            </div>
          </div>
        </div>

        <!-- Dunyo Vaqtlari Kartalari -->
        <div class="world-clock-section">
          <h3 class="section-title"><i data-lucide="globe"></i> Dunyo Shaharlari Vaqti</h3>
          <div class="world-grid" id="worldCitiesGrid">
            <!-- Dinamik generatsiya qilinadi -->
          </div>
        </div>
      </section>

      <!-- 2. SEKUNDOMER BO'LIMI -->
      <section id="stopwatch-tab" class="tab-panel">
        <div class="glass-card stopwatch-card">
          <div class="stopwatch-display">
            <span id="swMinutes">00</span>:<span id="swSeconds">00</span>.<span id="swMillis" class="millis">00</span>
          </div>

          <div class="control-actions">
            <button id="swStartBtn" class="btn btn-primary"><i data-lucide="play"></i> Boshlash</button>
            <button id="swLapBtn" class="btn btn-secondary" disabled><i data-lucide="flag"></i> Davra (Lap)</button>
            <button id="swResetBtn" class="btn btn-danger" disabled><i data-lucide="rotate-ccw"></i> Tozalash</button>
          </div>

          <!-- Davralar (Laps) Ro'yxati -->
          <div class="laps-container" id="lapsContainer">
            <div class="laps-header">
              <span>Davra #</span>
              <span>Oraliq vaqt</span>
              <span>Jami vaqt</span>
            </div>
            <div class="laps-list" id="lapsList">
              <p class="empty-laps">Hozircha davralar qayd etilmadi</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. POMODORO BO'LIMI -->
      <section id="pomodoro-tab" class="tab-panel">
        <div class="glass-card pomodoro-card">
          <!-- Pomodoro Rejimlari -->
          <div class="pomodoro-modes">
            <button class="pomo-mode-btn active" data-mode="focus">🎯 Dars / Fokus (25m)</button>
            <button class="pomo-mode-btn" data-mode="shortBreak">☕ Qisqa tanaffus (5m)</button>
            <button class="pomo-mode-btn" data-mode="longBreak">🌴 Katta tanaffus (15m)</button>
          </div>

          <!-- Aylanma Taymer Ko'rsatkichi -->
          <div class="circular-timer-container">
            <svg class="progress-ring" width="280" height="280" viewBox="0 0 280 280">
              <circle class="progress-ring-track" cx="140" cy="140" r="120" />
              <circle id="pomoProgressRing" class="progress-ring-circle" cx="140" cy="140" r="120" />
            </svg>
            <div class="timer-center-content">
              <div id="pomoTimeDisplay" class="pomo-timer-digits">25:00</div>
              <span id="pomoStatusText" class="pomo-status">Fokus vaqti</span>
              <div class="pomodoro-streak">
                <span id="pomoCycleBadge">Sessiya 1/4</span>
              </div>
            </div>
          </div>

          <!-- Boshqaruv Tugmalari -->
          <div class="control-actions">
            <button id="pomoStartBtn" class="btn btn-primary"><i data-lucide="play"></i> Boshlash</button>
            <button id="pomoSkipBtn" class="btn btn-secondary"><i data-lucide="skip-forward"></i> O'tkazib yuborish</button>
            <button id="pomoResetBtn" class="btn btn-danger"><i data-lucide="rotate-ccw"></i> Qaytarish</button>
          </div>

          <!-- Pomodoro Sozlamalari (Accordion/Tugma) -->
          <div class="pomo-custom-settings">
            <div class="settings-row">
              <label>Fokus (daq): <input type="number" id="customFocusInput" min="1" max="120" value="25"></label>
              <label>Qisqa tanaffus (daq): <input type="number" id="customShortInput" min="1" max="30" value="5"></label>
              <label>Uzoq tanaffus (daq): <input type="number" id="customLongInput" min="1" max="60" value="15"></label>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. QAYTMA TAYMER (COUNTDOWN) -->
      <section id="countdown-tab" class="tab-panel">
        <div class="glass-card countdown-card">
          <div id="cdInputSection" class="countdown-inputs">
            <div class="time-input-group">
              <input type="number" id="cdHoursInput" min="0" max="99" value="0" placeholder="00">
              <span class="unit-label">Soat</span>
            </div>
            <span class="input-sep">:</span>
            <div class="time-input-group">
              <input type="number" id="cdMinutesInput" min="0" max="59" value="5" placeholder="00">
              <span class="unit-label">Daqiqa</span>
            </div>
            <span class="input-sep">:</span>
            <div class="time-input-group">
              <input type="number" id="cdSecondsInput" min="0" max="59" value="0" placeholder="00">
              <span class="unit-label">Soniya</span>
            </div>
          </div>

          <div class="quick-presets">
            <button class="preset-btn" data-add="60">+1 daq</button>
            <button class="preset-btn" data-add="300">+5 daq</button>
            <button class="preset-btn" data-add="600">+10 daq</button>
            <button class="preset-btn" data-add="1800">+30 daq</button>
          </div>

          <!-- Ishlayotgan Taymer Ko'rsatkichi -->
          <div id="cdDisplaySection" class="cd-display-wrapper hidden">
            <div class="countdown-digits" id="cdTimeDisplay">00:05:00</div>
          </div>

          <div class="control-actions">
            <button id="cdStartBtn" class="btn btn-primary"><i data-lucide="play"></i> Taymerni boshlash</button>
            <button id="cdResetBtn" class="btn btn-danger" disabled><i data-lucide="rotate-ccw"></i> Tozalash</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Pastki qism / Footer -->
    <footer class="glass-footer">
      <p>© 2026 VAQT Platformasi — Ishonchli, Aniq va Zamonaviy Vaqt Menejmenti</p>
    </footer>
  </div>

  <!-- Skriptlar -->
  <script src="script.js"></script>
</body>
</html>
`;

export const STANDALONE_CSS = `/* ==========================================================
   VAQT — Glassmorphism Dizayn Stili (style.css)
   Zamonaviy shaffof oyna effekti, neon gradient va responsive dizayn
========================================================== */

:root {
  --bg-gradient: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #030712 100%);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-glow: rgba(99, 102, 241, 0.4);
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --font-main: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

html.light {
  --bg-gradient: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%);
  --text-main: #0f172a;
  --text-muted: #475569;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-glow: rgba(79, 70, 229, 0.25);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-main);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

body {
  background: var(--bg-gradient);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  position: relative;
}

/* Ambient Orqa Fon Aylanalari */
.ambient-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}
.glow-1 {
  width: 450px;
  height: 450px;
  top: -100px;
  left: -100px;
  background: rgba(99, 102, 241, 0.25);
}
.glow-2 {
  width: 400px;
  height: 400px;
  bottom: -50px;
  right: -50px;
  background: rgba(168, 85, 247, 0.2);
}
.glow-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  right: 25%;
  background: rgba(16, 185, 129, 0.15);
}

.app-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 24px 16px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Glassmorphism Header */
.glass-header {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: 20px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-icon {
  background: linear-gradient(135deg, var(--primary), #a855f7);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px var(--primary-glow);
}
.brand-text {
  display: flex;
  align-items: center;
  gap: 6px;
}
.logo-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.logo-badge {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
}

/* Navigatsiya Tabs */
.nav-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--glass-border);
  padding: 4px;
  border-radius: 14px;
  gap: 4px;
}
.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}
.tab-btn:hover {
  color: var(--text-main);
}
.tab-btn.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 15px var(--primary-glow);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

/* Asosiy Glass Card */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: 28px;
  padding: 36px 24px;
  text-align: center;
  position: relative;
}

.tab-panel {
  display: none;
  animation: fadeIn 0.4s ease forwards;
}
.tab-panel.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Soat Stili */
.clock-mode-toggles {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}
.chip-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.chip-btn:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.15);
}

.digital-clock-display .time-main {
  font-family: var(--font-mono);
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -2px;
  color: var(--text-main);
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: wrap;
}
.colon-pulse {
  animation: pulse 1s infinite;
  opacity: 0.8;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.ampm-tag {
  font-size: 24px;
  font-family: var(--font-main);
  margin-left: 12px;
  color: var(--primary);
  font-weight: 600;
}
.date-display {
  font-size: 18px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: capitalize;
}

/* Analog Soat */
.analog-clock-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.analog-dial {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 4px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
}
.analog-center {
  width: 12px;
  height: 12px;
  background: var(--primary);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 6px;
}
.hour-hand {
  width: 6px;
  height: 60px;
  background: var(--text-main);
  margin-left: -3px;
  z-index: 5;
}
.minute-hand {
  width: 4px;
  height: 80px;
  background: var(--primary);
  margin-left: -2px;
  z-index: 6;
}
.second-hand {
  width: 2px;
  height: 90px;
  background: var(--accent-rose);
  margin-left: -1px;
  z-index: 7;
}
.dial-marker {
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
}
.marker-12 { top: 8px; left: 50%; transform: translateX(-50%); }
.marker-3 { right: 12px; top: 50%; transform: translateY(-50%); }
.marker-6 { bottom: 8px; left: 50%; transform: translateX(-50%); }
.marker-9 { left: 12px; top: 50%; transform: translateY(-50%); }
.hidden { display: none !important; }

/* Dunyo Soatlari */
.world-clock-section {
  margin-top: 24px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.world-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
}
.world-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  padding: 16px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.world-city-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.city-name { font-weight: 700; font-size: 15px; }
.city-flag { font-size: 20px; }
.city-time { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--primary); }
.city-diff { font-size: 12px; color: var(--text-muted); }

/* Sekundomer */
.stopwatch-display {
  font-family: var(--font-mono);
  font-size: 72px;
  font-weight: 700;
  margin-bottom: 28px;
}
.millis {
  font-size: 40px;
  color: var(--primary);
}
.control-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.btn {
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary), #a855f7);
  color: white;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
}
.btn-danger {
  background: rgba(244, 63, 94, 0.2);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #f87171;
}

/* Laps */
.laps-container {
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
}
.laps-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  border-bottom: 1px solid var(--glass-border);
}
.lap-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 18px;
  font-family: var(--font-mono);
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.lap-item.fastest { color: var(--accent-emerald); font-weight: 700; }
.lap-item.slowest { color: var(--accent-rose); }
.empty-laps { padding: 20px; color: var(--text-muted); font-size: 14px; }

/* Pomodoro */
.pomodoro-modes {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.pomo-mode-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}
.pomo-mode-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 15px var(--primary-glow);
}

.circular-timer-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}
.progress-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 10;
}
.progress-ring-circle {
  fill: none;
  stroke: var(--primary);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 753.98;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.5s linear;
}
.timer-center-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.pomo-timer-digits {
  font-family: var(--font-mono);
  font-size: 52px;
  font-weight: 700;
}
.pomo-status {
  font-size: 15px;
  color: var(--text-muted);
  font-weight: 500;
}
.pomodoro-streak {
  margin-top: 6px;
}
#pomoCycleBadge {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.pomo-custom-settings {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--glass-border);
}
.settings-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-muted);
}
.settings-row input {
  width: 55px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 4px 8px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
  margin-left: 6px;
}

/* Qaytma Taymer (Countdown) */
.countdown-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.time-input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.time-input-group input {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 700;
  color: var(--text-main);
  text-align: center;
}
.unit-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}
.input-sep {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.quick-presets {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.preset-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}
.preset-btn:hover {
  background: var(--primary);
  color: white;
}
.countdown-digits {
  font-family: var(--font-mono);
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 28px;
}

/* Footer */
.glass-footer {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  padding: 12px;
}

/* Responsive Dizayn */
@media (max-width: 680px) {
  .digital-clock-display .time-main,
  .stopwatch-display,
  .countdown-digits {
    font-size: 46px;
  }
  .millis { font-size: 26px; }
  .glass-header { flex-direction: column; align-items: stretch; }
  .nav-tabs { justify-content: space-around; }
  .tab-btn span { display: none; }
  .tab-btn { padding: 10px 14px; }
}
`;

export const STANDALONE_JS = `/**
 * ==========================================================
 * VAQT — Asosiy JavaScript Mantiqi (script.js)
 * Real-time soat, Sekundomer, Pomodoro, Qaytma taymer va Audio sintez
 * ==========================================================
 */

// Ikonkalarni ishga tushirish (Lucide)
if (window.lucide) {
  window.lucide.createIcons();
}

/* ----------------------------------------------------------
   1. OVOZLI SIGNAL (Web Audio API orqali sof sintez)
---------------------------------------------------------- */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Chiroyli Zen qo'ng'iroq signali
function playAlarmSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = [528, 1056, 1584, 2112];
    const decays = [2.5, 2.0, 1.4, 0.8];
    const gains = [0.5, 0.2, 0.1, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[idx]);
    });
  } catch (err) {
    console.error('Audio xatolik:', err);
  }
}

/* ----------------------------------------------------------
   2. TEMA VA NAVIGATSIYA BOSHQARUVI
---------------------------------------------------------- */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const soundTestBtn = document.getElementById('soundTestBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Dark / Light rejimini almashtirish
themeToggleBtn?.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  if (isDark) {
    html.classList.remove('dark');
    html.classList.add('light');
    localStorage.setItem('vaqt_theme', 'light');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    localStorage.setItem('vaqt_theme', 'dark');
  }
});

// Saqlangan temani tiklash
if (localStorage.getItem('vaqt_theme') === 'light') {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
}

// Ovozni sinash tugmasi
soundTestBtn?.addEventListener('click', () => {
  playAlarmSound();
});

// To'liq ekran rejimi
fullscreenBtn?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

// Tablar almashinuvi
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(\`\${tabId}-tab\`)?.classList.add('active');
  });
});

/* ----------------------------------------------------------
   3. ANIQ VAQT & DUNYO SOATLARI
---------------------------------------------------------- */
let is24HourFormat = true;
let showAnalog = false;

const clockHours = document.getElementById('clockHours');
const clockMinutes = document.getElementById('clockMinutes');
const clockSeconds = document.getElementById('clockSeconds');
const clockAmPm = document.getElementById('clockAmPm');
const clockDate = document.getElementById('clockDate');
const toggleFormatBtn = document.getElementById('toggleFormatBtn');
const toggleAnalogBtn = document.getElementById('toggleAnalogBtn');
const digitalClockContainer = document.getElementById('digitalClockContainer');
const analogClockContainer = document.getElementById('analogClockContainer');

const analogHour = document.getElementById('analogHour');
const analogMinute = document.getElementById('analogMinute');
const analogSecond = document.getElementById('analogSecond');

toggleFormatBtn?.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat;
  toggleFormatBtn.textContent = is24HourFormat ? '24 Soatlik format' : '12 Soatlik (AM/PM)';
});

toggleAnalogBtn?.addEventListener('click', () => {
  showAnalog = !showAnalog;
  if (showAnalog) {
    analogClockContainer?.classList.remove('hidden');
    digitalClockContainer?.classList.add('hidden');
    toggleAnalogBtn.innerHTML = '<i data-lucide="monitor"></i> Raqamli soat';
  } else {
    analogClockContainer?.classList.add('hidden');
    digitalClockContainer?.classList.remove('hidden');
    toggleAnalogBtn.innerHTML = '<i data-lucide="compass"></i> Analog soat';
  }
  if (window.lucide) window.lucide.createIcons();
});

const UZBEK_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];
const UZBEK_WEEKDAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  let ampm = '';
  if (!is24HourFormat) {
    ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
  }

  if (clockHours) clockHours.textContent = String(h).padStart(2, '0');
  if (clockMinutes) clockMinutes.textContent = String(m).padStart(2, '0');
  if (clockSeconds) clockSeconds.textContent = String(s).padStart(2, '0');
  if (clockAmPm) clockAmPm.textContent = ampm;

  if (clockDate) {
    const day = now.getDate();
    const month = UZBEK_MONTHS[now.getMonth()];
    const weekday = UZBEK_WEEKDAYS[now.getDay()];
    const year = now.getFullYear();
    clockDate.textContent = \`\${day}-\${month}, \${weekday}, \${year}\`;
  }

  // Analog soat burchaklari
  if (showAnalog) {
    const secDeg = (s / 60) * 360;
    const minDeg = ((m + s / 60) / 60) * 360;
    const hourDeg = (((now.getHours() % 12) + m / 60) / 12) * 360;

    if (analogSecond) analogSecond.style.transform = \`rotate(\${secDeg}deg)\`;
    if (analogMinute) analogMinute.style.transform = \`rotate(\${minDeg}deg)\`;
    if (analogHour) analogHour.style.transform = \`rotate(\${hourDeg}deg)\`;
  }

  updateWorldClocks();
}

// Dunyo shaharlari ro'yxati
const WORLD_CITIES = [
  { name: 'Toshkent', country: 'Oʻzbekiston', timeZone: 'Asia/Tashkent', flag: '🇺🇿' },
  { name: 'Makka', country: 'Saudiya Arabistoni', timeZone: 'Asia/Riyadh', flag: '🇸🇦' },
  { name: 'Istanbul', country: 'Turkiya', timeZone: 'Europe/Istanbul', flag: '🇹🇷' },
  { name: 'London', country: 'Buyuk Britaniya', timeZone: 'Europe/London', flag: '🇬🇧' },
  { name: 'Nyu-York', country: 'AQSH', timeZone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Tokio', country: 'Yaponiya', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
];

function initWorldClocks() {
  const grid = document.getElementById('worldCitiesGrid');
  if (!grid) return;
  grid.innerHTML = WORLD_CITIES.map(city => \`
    <div class="world-card">
      <div class="world-city-header">
        <span class="city-name">\${city.name}</span>
        <span class="city-flag">\${city.flag}</span>
      </div>
      <div class="city-time" id="city-\${city.name}">--:--:--</div>
      <div class="city-diff">\${city.country}</div>
    </div>
  \`).join('');
}

function updateWorldClocks() {
  const now = new Date();
  WORLD_CITIES.forEach(city => {
    const el = document.getElementById(\`city-\${city.name}\`);
    if (el) {
      try {
        const timeStr = new Intl.DateTimeFormat('uz-UZ', {
          timeZone: city.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);
        el.textContent = timeStr;
      } catch (e) {
        el.textContent = '--:--:--';
      }
    }
  });
}

setInterval(updateClock, 1000);
initWorldClocks();
updateClock();

/* ----------------------------------------------------------
   4. SEKUNDOMER (STOPWATCH)
---------------------------------------------------------- */
let swStartTime = 0;
let swElapsedTime = 0;
let swInterval = null;
let swRunning = false;
let swLaps = [];
let lastLapTime = 0;

const swMinutes = document.getElementById('swMinutes');
const swSeconds = document.getElementById('swSeconds');
const swMillis = document.getElementById('swMillis');
const swStartBtn = document.getElementById('swStartBtn');
const swLapBtn = document.getElementById('swLapBtn');
const swResetBtn = document.getElementById('swResetBtn');
const lapsList = document.getElementById('lapsList');

function formatSwTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = Math.floor((ms % 1000) / 10);
  return {
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
    mil: String(mil).padStart(2, '0')
  };
}

function renderSw() {
  const currentTotal = swElapsedTime + (swRunning ? (performance.now() - swStartTime) : 0);
  const formatted = formatSwTime(currentTotal);
  if (swMinutes) swMinutes.textContent = formatted.m;
  if (swSeconds) swSeconds.textContent = formatted.s;
  if (swMillis) swMillis.textContent = formatted.mil;
}

swStartBtn?.addEventListener('click', () => {
  if (!swRunning) {
    swRunning = true;
    swStartTime = performance.now();
    swInterval = setInterval(renderSw, 25);
    swStartBtn.innerHTML = '<i data-lucide="pause"></i> Toʻxtatish';
    swStartBtn.classList.replace('btn-primary', 'btn-secondary');
    swLapBtn.disabled = false;
    swResetBtn.disabled = false;
  } else {
    swRunning = false;
    swElapsedTime += performance.now() - swStartTime;
    clearInterval(swInterval);
    swStartBtn.innerHTML = '<i data-lucide="play"></i> Davom ettirish';
    swStartBtn.classList.replace('btn-secondary', 'btn-primary');
    swLapBtn.disabled = true;
  }
  if (window.lucide) window.lucide.createIcons();
});

swLapBtn?.addEventListener('click', () => {
  if (!swRunning) return;
  const currentTotal = swElapsedTime + (performance.now() - swStartTime);
  const lapDuration = currentTotal - lastLapTime;
  lastLapTime = currentTotal;

  swLaps.unshift({
    num: swLaps.length + 1,
    lapMs: lapDuration,
    totalMs: currentTotal
  });
  renderLaps();
});

swResetBtn?.addEventListener('click', () => {
  swRunning = false;
  clearInterval(swInterval);
  swStartTime = 0;
  swElapsedTime = 0;
  lastLapTime = 0;
  swLaps = [];
  renderSw();
  renderLaps();
  swStartBtn.innerHTML = '<i data-lucide="play"></i> Boshlash';
  swStartBtn.classList.replace('btn-secondary', 'btn-primary');
  swLapBtn.disabled = true;
  swResetBtn.disabled = true;
  if (window.lucide) window.lucide.createIcons();
});

function renderLaps() {
  if (!lapsList) return;
  if (swLaps.length === 0) {
    lapsList.innerHTML = '<p class="empty-laps">Hozircha davralar qayd etilmadi</p>';
    return;
  }

  let minLap = Infinity;
  let maxLap = -Infinity;
  if (swLaps.length > 1) {
    swLaps.forEach(l => {
      if (l.lapMs < minLap) minLap = l.lapMs;
      if (l.lapMs > maxLap) maxLap = l.lapMs;
    });
  }

  lapsList.innerHTML = swLaps.map(lap => {
    const lapFmt = formatSwTime(lap.lapMs);
    const totFmt = formatSwTime(lap.totalMs);
    let extraClass = '';
    if (swLaps.length > 1) {
      if (lap.lapMs === minLap) extraClass = 'fastest';
      if (lap.lapMs === maxLap) extraClass = 'slowest';
    }
    return \`
      <div class="lap-item \${extraClass}">
        <span>#\${lap.num}</span>
        <span>+\${lapFmt.m}:\${lapFmt.s}.\${lapFmt.mil}</span>
        <span>\${totFmt.m}:\${totFmt.s}.\${totFmt.mil}</span>
      </div>
    \`;
  }).join('');
}

/* ----------------------------------------------------------
   5. POMODORO TAYMERI
---------------------------------------------------------- */
let pomoMode = 'focus';
let pomoDurations = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
let pomoTimeLeft = pomoDurations.focus;
let pomoRunning = false;
let pomoTimer = null;
let completedSessions = 0;

const pomoProgressRing = document.getElementById('pomoProgressRing');
const pomoTimeDisplay = document.getElementById('pomoTimeDisplay');
const pomoStatusText = document.getElementById('pomoStatusText');
const pomoStartBtn = document.getElementById('pomoStartBtn');
const pomoSkipBtn = document.getElementById('pomoSkipBtn');
const pomoResetBtn = document.getElementById('pomoResetBtn');
const pomoModeBtns = document.querySelectorAll('.pomo-mode-btn');
const pomoCycleBadge = document.getElementById('pomoCycleBadge');

const customFocusInput = document.getElementById('customFocusInput');
const customShortInput = document.getElementById('customShortInput');
const customLongInput = document.getElementById('customLongInput');

const RING_CIRCUMFERENCE = 2 * Math.PI * 120; // r=120 -> 753.98

function updatePomoDisplay() {
  const m = Math.floor(pomoTimeLeft / 60);
  const s = pomoTimeLeft % 60;
  if (pomoTimeDisplay) {
    pomoTimeDisplay.textContent = \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;
  }
  const total = pomoDurations[pomoMode];
  const offset = RING_CIRCUMFERENCE - (pomoTimeLeft / total) * RING_CIRCUMFERENCE;
  if (pomoProgressRing) {
    pomoProgressRing.style.strokeDashoffset = String(offset);
  }
}

pomoModeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pomoModeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pomoMode = btn.getAttribute('data-mode');
    resetPomo();
    if (pomoStatusText) {
      pomoStatusText.textContent = pomoMode === 'focus' ? 'Fokus vaqti' : (pomoMode === 'shortBreak' ? 'Qisqa tanaffus' : 'Katta tanaffus');
    }
  });
});

pomoStartBtn?.addEventListener('click', () => {
  if (!pomoRunning) {
    pomoRunning = true;
    pomoTimer = setInterval(() => {
      if (pomoTimeLeft > 0) {
        pomoTimeLeft--;
        updatePomoDisplay();
      } else {
        clearInterval(pomoTimer);
        pomoRunning = false;
        playAlarmSound();
        if (pomoMode === 'focus') {
          completedSessions++;
          if (pomoCycleBadge) pomoCycleBadge.textContent = \`Sessiya \${(completedSessions % 4) + 1}/4\`;
          alert('Fokus vaqti tugadi! Ajoyib natija. Endi biroz dam oling.');
        } else {
          alert('Tanaffus tugadi! Yangi sessiyaga tayyormisiz?');
        }
        resetPomo();
      }
    }, 1000);
    pomoStartBtn.innerHTML = '<i data-lucide="pause"></i> Toʻxtatish';
  } else {
    pomoRunning = false;
    clearInterval(pomoTimer);
    pomoStartBtn.innerHTML = '<i data-lucide="play"></i> Davom ettirish';
  }
  if (window.lucide) window.lucide.createIcons();
});

function resetPomo() {
  pomoRunning = false;
  clearInterval(pomoTimer);
  pomoTimeLeft = pomoDurations[pomoMode];
  updatePomoDisplay();
  if (pomoStartBtn) pomoStartBtn.innerHTML = '<i data-lucide="play"></i> Boshlash';
  if (window.lucide) window.lucide.createIcons();
}

pomoResetBtn?.addEventListener('click', resetPomo);

pomoSkipBtn?.addEventListener('click', () => {
  if (confirm('Joriy oraliqni oʻtkazib yuborishni xohlaysizmi?')) {
    resetPomo();
  }
});

// Custom sozlamalarni qabul qilish
[customFocusInput, customShortInput, customLongInput].forEach(input => {
  input?.addEventListener('change', () => {
    pomoDurations.focus = (parseInt(customFocusInput?.value) || 25) * 60;
    pomoDurations.shortBreak = (parseInt(customShortInput?.value) || 5) * 60;
    pomoDurations.longBreak = (parseInt(customLongInput?.value) || 15) * 60;
    resetPomo();
  });
});

updatePomoDisplay();

/* ----------------------------------------------------------
   6. QAYTMA TAYMER (COUNTDOWN)
---------------------------------------------------------- */
let cdTotalSeconds = 0;
let cdSecondsLeft = 0;
let cdRunning = false;
let cdInterval = null;

const cdHoursInput = document.getElementById('cdHoursInput');
const cdMinutesInput = document.getElementById('cdMinutesInput');
const cdSecondsInput = document.getElementById('cdSecondsInput');
const cdStartBtn = document.getElementById('cdStartBtn');
const cdResetBtn = document.getElementById('cdResetBtn');
const cdInputSection = document.getElementById('cdInputSection');
const cdDisplaySection = document.getElementById('cdDisplaySection');
const cdTimeDisplay = document.getElementById('cdTimeDisplay');
const presetBtns = document.querySelectorAll('.preset-btn');

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const addSec = parseInt(btn.getAttribute('data-add')) || 0;
    let curM = parseInt(cdMinutesInput?.value) || 0;
    curM += Math.floor(addSec / 60);
    if (cdMinutesInput) cdMinutesInput.value = curM;
  });
});

cdStartBtn?.addEventListener('click', () => {
  if (!cdRunning) {
    if (cdSecondsLeft <= 0) {
      const h = parseInt(cdHoursInput?.value) || 0;
      const m = parseInt(cdMinutesInput?.value) || 0;
      const s = parseInt(cdSecondsInput?.value) || 0;
      cdTotalSeconds = h * 3600 + m * 60 + s;
      cdSecondsLeft = cdTotalSeconds;
    }

    if (cdSecondsLeft <= 0) {
      alert('Iltimos, taymer vaqtini kiriting!');
      return;
    }

    cdRunning = true;
    cdInputSection?.classList.add('hidden');
    cdDisplaySection?.classList.remove('hidden');
    cdResetBtn.disabled = false;
    cdStartBtn.innerHTML = '<i data-lucide="pause"></i> Toʻxtatish';

    cdInterval = setInterval(() => {
      if (cdSecondsLeft > 0) {
        cdSecondsLeft--;
        renderCdDisplay();
      } else {
        clearInterval(cdInterval);
        cdRunning = false;
        playAlarmSound();
        alert('⏰ Taymer vaqti tugadi!');
        resetCd();
      }
    }, 1000);
    renderCdDisplay();
  } else {
    cdRunning = false;
    clearInterval(cdInterval);
    cdStartBtn.innerHTML = '<i data-lucide="play"></i> Davom ettirish';
  }
  if (window.lucide) window.lucide.createIcons();
});

function renderCdDisplay() {
  const h = Math.floor(cdSecondsLeft / 3600);
  const m = Math.floor((cdSecondsLeft % 3600) / 60);
  const s = cdSecondsLeft % 60;
  if (cdTimeDisplay) {
    cdTimeDisplay.textContent = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;
  }
}

function resetCd() {
  cdRunning = false;
  clearInterval(cdInterval);
  cdSecondsLeft = 0;
  cdInputSection?.classList.remove('hidden');
  cdDisplaySection?.classList.add('hidden');
  if (cdStartBtn) cdStartBtn.innerHTML = '<i data-lucide="play"></i> Taymerni boshlash';
  if (cdResetBtn) cdResetBtn.disabled = true;
  if (window.lucide) window.lucide.createIcons();
}

cdResetBtn?.addEventListener('click', resetCd);
`;
