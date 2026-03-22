// quantumClockPsiF.js
// Quantum Clock with Ψ_f calculation for each 8:20 tick
// Credit: Thomas Lee Harvey

const fs = require("fs");
const path = require("path");

// -------------------- CONFIG --------------------
const TICK_INTERVAL_SEC = 500; // 8 min 20 sec = 500 seconds
const SECOND_COUNT = 60;       // Count 0 to 60 seconds per tick
const LOG_FILE = path.join(__dirname, "quantum_clock_psi_f_log.json");

// Physics constants (Sun-Earth scenario)
const C = 186282; // speed of light in mi/s
const V = 186282 * 0.1; // example: adjust Earth motion (~18.61 mi/s)
const PHI = 1000; // perceptual correction in miles

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, JSON.stringify([]));
let logData = JSON.parse(fs.readFileSync(LOG_FILE));

// -------------------- HELPERS --------------------
function saveLog(entry) {
    logData.push(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));
}

// Calculate Ψ_f
function calculatePsiF(c, t, v, phi) {
    const ct = c * t;
    const vt = v * t;
    const psiF = ct + vt + phi;
    return { psiF, ct, vt, phi };
}

// -------------------- QUANTUM CLOCK --------------------
let tickCount = logData.length;

async function runTick() {
    tickCount++;
    const tickStart = new Date();
    console.log(`\n=== Quantum Tick #${tickCount} ===`);
    console.log(`Tick started at: ${tickStart.toISOString()}`);

    // Secondary count 0 -> 60 seconds
    for (let sec = 0; sec <= SECOND_COUNT; sec++) {
        process.stdout.write(`Second Count: ${sec}\r`);
        await new Promise(res => setTimeout(res, 1000));
    }

    // -------------------- Ψ_f Calculation --------------------
    const { psiF, ct, vt, phi } = calculatePsiF(C, TICK_INTERVAL_SEC, V, PHI);

    console.log(`\nΨ_f Calculation:`);
    console.log(`c·t (light signal)     : ${ct.toLocaleString()} mi`);
    console.log(`v·t (observer motion)  : ${vt.toLocaleString()} mi`);
    console.log(`Φ (perceptual correction): ${phi.toLocaleString()} mi`);
    console.log(`Total Ψ_f               : ${psiF.toLocaleString()} mi`);

    // Log tick
    const tickEnd = new Date();
    const entry = {
        tickNumber: tickCount,
        tickStart: tickStart.toISOString(),
        tickEnd: tickEnd.toISOString(),
        durationSec: (tickEnd - tickStart) / 1000,
        psiF: {
            total: psiF,
            ct,
            vt,
            phi
        }
    };

    saveLog(entry);

    // Schedule next tick
    setTimeout(runTick, (TICK_INTERVAL_SEC - SECOND_COUNT) * 1000);
}

// -------------------- START --------------------
console.log("Starting Thomas Lee Harvey Quantum Clock with Ψ_f calculation...");
runTick();
