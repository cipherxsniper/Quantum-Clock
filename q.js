#!/usr/bin/env node
/**
 * Thomas Lee Harvey Quantum Clock - Natural Flow State Full Version
 * Features:
 * - Circle spinning backwards
 * - Dynamic Past → Present → Future via Natural Flow State Equation
 * - Smooth sub-second motion
 * - Color-coded glow for observer state
 * - First-time state logging
 */

const fs = require('fs');
const readline = require('readline');

const logFile = './quantumClockObserverLog.txt';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  past: '\x1b[34m',    // Blue
  present: '\x1b[32m', // Green
  future: '\x1b[35m',  // Magenta
  hand: '\x1b[33m',    // Yellow
  glow: '\x1b[36m',    // Cyan
};

// Clock settings
const size = 11; // radius
let stateRecorded = { Past: false, Present: false, Future: false };
const phaseOffset = 1000; // Φ in miles
const c = 186000; // speed of light in mi/sec
const v = 3 / 3600; // observer speed ~3mi/h in mi/sec
const startTime = Date.now(); // clock reference

// Natural Flow State Equation
function naturalFlowState(t) {
  const psi = c * t + v * t + phaseOffset;
  return Math.floor(psi % 3); // 0=Past, 1=Present, 2=Future
}

// Map NFS result to observer state
function getObserverState(t) {
  const nfs = naturalFlowState(t);
  if (nfs === 0) return 'Past';
  if (nfs === 1) return 'Present';
  return 'Future';
}

// Record first-time entries
function recordState(state, timeStr) {
  if (!stateRecorded[state]) {
    fs.appendFileSync(logFile, `${timeStr} → First observed state: ${state}\n`);
    stateRecorded[state] = true;
  }
}

// Render terminal circle with hand
function renderClock(sec, observerState) {
  let output = '';
  const angle = (2 * Math.PI * ((60 - sec) % 60)) / 60; // backwards spin

  for (let y = -size; y <= size; y++) {
    for (let x = -size; x <= size; x++) {
      const distance = Math.sqrt(x * x + y * y);
      const handX = Math.round(Math.sin(angle) * size);
      const handY = -Math.round(Math.cos(angle) * size);

      if (x === handX && y === handY) {
        output += colors.hand + '>' + colors.reset;
      } else if (distance > size - 0.5 && distance < size + 0.5) {
        // Circle glow changes based on observer state
        output += colors[observerState.toLowerCase()] + 'o' + colors.reset;
      } else {
        output += ' ';
      }
    }
    output += '\n';
  }
  return output;
}

// Main clock loop
async function runQuantumClock() {
  while (true) {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);

    const now = new Date();
    const elapsedSec = (Date.now() - startTime) / 1000;
    const observerState = getObserverState(elapsedSec);
    recordState(observerState, now.toLocaleTimeString());

    console.log(`${colors.glow}=== Thomas Lee Harvey Quantum Clock ===${colors.reset}`);
    console.log(`Time: ${now.toLocaleTimeString()}    Observer is: ${colors[observerState.toLowerCase()]}${observerState}${colors.reset}\n`);
    console.log(renderClock(now.getSeconds() + now.getMilliseconds() / 1000, observerState));
    console.log(`${colors.past}Past${colors.reset} ← ${colors.present}Present${colors.reset} → ${colors.future}Future${colors.reset}\n`);

    await sleep(100); // smooth 10fps
  }
}

runQuantumClock().catch(console.error);
