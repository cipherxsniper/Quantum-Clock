#!/usr/bin/env node
// quantumClockFull.js
// Full backward-spinning quantum clock for terminal (Termux friendly)

const fs = require("fs");
const path = require("path");

// Output file for recording first observer states
const recordFile = path.join(__dirname, "quantumClockStates.json");

// Load existing state records or initialize
let observerRecords = { past: null, present: null, future: null };
if (fs.existsSync(recordFile)) {
  try {
    observerRecords = JSON.parse(fs.readFileSync(recordFile, "utf8"));
  } catch {}
}

// Terminal clear
const clear = () => process.stdout.write("\x1B[2J\x1B[0f");

// Circle points for a 12-position clock
const circlePoints = [
  [0, -3],  [1, -2], [2, -1], [3, 0],
  [2, 1],   [1, 2],  [0, 3],  [-1, 2],
  [-2, 1],  [-3, 0], [-2, -1], [-1, -2]
];

// Determine observer state (Past / Present / Future) based on hand position
function getObserverState(pos) {
  const idx = Math.floor(pos % circlePoints.length);
  if (idx >= 0 && idx <= 3) return "Past";
  if (idx >= 4 && idx <= 7) return "Present";
  return "Future";
}

// Record first occurrence of observer state
function recordObserverState(state, timeStr) {
  if (!observerRecords[state.toLowerCase()]) {
    observerRecords[state.toLowerCase()] = timeStr;
    fs.writeFileSync(recordFile, JSON.stringify(observerRecords, null, 2));
  }
}

// Draw the clock with glowing arc for Past → Present → Future
function drawClock(pos) {
  const canvasSize = 7;
  let canvas = Array.from({ length: canvasSize * 2 + 1 }, () =>
    Array.from({ length: canvasSize * 2 + 1 }, () => " ")
  );

  // Draw circle outline
  for (let i = 0; i < circlePoints.length; i++) {
    const [x, y] = circlePoints[i];
    let symbol = "o";

    // Arc coloring effect
    if (i < 4) symbol = ".";     // Past
    else if (i < 8) symbol = "o"; // Present
    else symbol = "*";           // Future

    canvas[y + canvasSize][x + canvasSize] = symbol;
  }

  // Draw center
  canvas[canvasSize][canvasSize] = "•";

  // Draw hand
  const [hx, hy] = circlePoints[Math.floor(pos) % circlePoints.length];
  canvas[hy + canvasSize][hx + canvasSize] = ">";

  // Time string
  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  // Determine observer state
  const observerState = getObserverState(pos);

  // Record first observer state occurrence
  recordObserverState(observerState, timeStr);

  // Clear and render
  clear();
  console.log("=== Thomas Lee Harvey Quantum Clock Live ===");
  console.log(`Time: ${timeStr}  Observer: ${observerState}`);
  console.log(canvas.map(row => row.join("")).join("\n"));
  console.log("\nPast (.)  ←  Present (o)  →  Future (*)\n");
  console.log("First Observer Times:", observerRecords);
}

// Backward spinning clock
let handPos = 0;
setInterval(() => {
  drawClock(circlePoints.length - (handPos % circlePoints.length));
  handPos += 0.1; // smooth sub-step
}, 100);
