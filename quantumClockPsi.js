// quantumClockPsiFVisual.js
// Thomas Lee Harvey Quantum Clock with Ψ_f + visual bar

const TICK_INTERVAL_SEC = 500; // 8 min 20 sec
const SECOND_COUNT = 60;
const BAR_LENGTH = 50;

const C = 186282; // mi/s
const V = 18.61;  // mi/s
const PHI = 1000;

let tickCount = 0;

function calculatePsiF(c, t, v, phi) {
    const ct = c * t;
    const vt = v * t;
    const psiF = ct + vt + phi;
    return { psiF, ct, vt, phi };
}

function createTimeBar(currentSecond, totalSeconds) {
    const presentPos = Math.floor((currentSecond / totalSeconds) * BAR_LENGTH);
    let bar = "";
    for (let i = 0; i < BAR_LENGTH; i++) {
        if (i < presentPos) bar += "-";
        else if (i === presentPos) bar += ">";
        else bar += ".";
    }
    return `Past → Present → Future\n[${bar}]`;
}

async function runTick() {
    tickCount++;
    console.log(`\n=== Quantum Tick #${tickCount} ===`);
    let tickStart = new Date();

    for (let sec = 0; sec <= SECOND_COUNT; sec++) {
        process.stdout.write(createTimeBar(sec, SECOND_COUNT) + "\r");
        await new Promise(res => setTimeout(res, 1000));
    }

    const { psiF, ct, vt, phi } = calculatePsiF(C, TICK_INTERVAL_SEC, V, PHI);
    let tickEnd = new Date();

    console.log(`\nΨ_f Calculation:`);
    console.log(`c·t: ${ct.toLocaleString()} mi`);
    console.log(`v·t: ${vt.toLocaleString()} mi`);
    console.log(`Φ: ${phi.toLocaleString()} mi`);
    console.log(`Total Ψ_f: ${psiF.toLocaleString()} mi`);
    console.log(`Tick duration: ${(tickEnd - tickStart)/1000} sec`);

    setTimeout(runTick, (TICK_INTERVAL_SEC - SECOND_COUNT) * 1000);
}

console.log("Starting Thomas Lee Harvey Quantum Clock...");
runTick();
