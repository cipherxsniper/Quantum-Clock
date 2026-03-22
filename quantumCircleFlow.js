// quantumCircleFlow.js
// Thomas Lee Harvey Quantum Clock - Flowing Time Arc Version
// Credit: Thomas Lee Harvey

const SECOND_COUNT = 60;
const TICK_INTERVAL_SEC = 5000;
const RADIUS = 10;

const C = 186282;
const V = 18.61;
const PHI = 1000;

let tickCount = 0;

// ANSI Colors
const RESET = "\x1b[0m";
const DIM_GRAY = "\x1b[90m";     // past
const DIM_BLUE = "\x1b[94m";     // future
const BRIGHT_CYAN = "\x1b[96m";  // present hand
const BRIGHT_WHITE = "\x1b[97m"; // numbers
const YELLOW = "\x1b[93m";       // labels
const BLUE_ARC = "\x1b[34m";     // arc behind hand

// -------------------- Circle Helpers --------------------
function generateCircle(radius) {
    const size = radius * 2 + 1;
    let grid = Array.from({ length: size }, () => Array(size).fill(' '));
    const cx = radius;
    const cy = radius;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (Math.abs(dist - radius) < 0.5) {
                grid[y][x] = 'o';
            }
        }
    }
    return grid;
}

function placeHand(grid, radius, angle) {
    const cx = radius;
    const cy = radius;
    const x = Math.round(cx + radius * Math.cos(angle));
    const y = Math.round(cy + radius * Math.sin(angle));
    grid[y][x] = '>'; // present hand
    return grid;
}

function addNumbers(grid, radius) {
    const cx = radius;
    const cy = radius;
    for (let sec = 0; sec < 60; sec += 5) {
        const angle = (sec / 60) * 2 * Math.PI - Math.PI/2;
        const x = Math.round(cx + (radius + 1) * Math.cos(angle));
        const y = Math.round(cy + (radius + 1) * Math.sin(angle));
        const numStr = sec.toString().padStart(2,'0');
        for (let i = 0; i < numStr.length; i++) {
            if (grid[y] && grid[y][x+i] !== undefined) grid[y][x+i] = numStr[i];
        }
    }
    return grid;
}

// Convert grid to string with flowing arc coloring
function gridToString(grid, handAngle) {
    const size = grid.length;
    const cx = Math.floor(size/2);
    const cy = Math.floor(size/2);
    let result = '';

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let char = grid[y][x];
            const dx = x - cx;
            const dy = y - cy;
            let angle = Math.atan2(dy, dx) + Math.PI/2;
            if (angle < 0) angle += 2*Math.PI;

            if (char === '>') char = BRIGHT_CYAN + char + RESET;
            else if (char.match(/\d/)) char = BRIGHT_WHITE + char + RESET;
            else if (char === 'o') {
                // arc behind hand
                let diff = (handAngle - angle + 2*Math.PI) % (2*Math.PI);
                if (diff > 0 && diff < Math.PI) char = BLUE_ARC + char + RESET; // filled arc
                else char = DIM_BLUE + char + RESET; // future
            } else char = DIM_GRAY + char + RESET;
            result += char;
        }
        result += '\n';
    }
    return result;
}

// -------------------- Ψ_f Calculation --------------------
function calculatePsiF(c, t, v, phi) {
    const ct = c * t;
    const vt = v * t;
    const psiF = ct + vt + phi;
    return { psiF, ct, vt, phi };
}

// -------------------- Quantum Tick --------------------
async function runTick() {
    tickCount++;
    console.clear();
    console.log(`${YELLOW}=== Quantum Tick #${tickCount} ===${RESET}`);

    for (let sec = 0; sec <= SECOND_COUNT; sec++) {
        const { psiF, ct, vt, phi } = calculatePsiF(C, TICK_INTERVAL_SEC, V, PHI);

        let circle = generateCircle(RADIUS);
        const angle = (sec / SECOND_COUNT) * 2 * Math.PI - Math.PI/2;
        circle = placeHand(circle, RADIUS, angle);
        circle = addNumbers(circle, RADIUS);

        console.clear();
        console.log(`${YELLOW}=== Quantum Tick #${tickCount} ===${RESET}`);
        console.log(`Second: ${sec}`);
        console.log(gridToString(circle, angle));

        console.log(`${YELLOW}Past ← Present → Future${RESET}`);
        console.log(`\nΨ_f Calculation:`);
        console.log(`c·t: ${ct.toLocaleString()} mi`);
        console.log(`v·t: ${vt.toLocaleString()} mi`);
        console.log(`Φ: ${phi.toLocaleString()} mi`);
        console.log(`Total Ψ_f: ${psiF.toLocaleString()} mi`);

        await new Promise(res => setTimeout(res, 1000));
    }

    setTimeout(runTick, (TICK_INTERVAL_SEC - SECOND_COUNT) * 1000);
}

// -------------------- START --------------------
console.log("Starting Thomas Lee Harvey Flowing Quantum Circle Clock...");
runTick();
