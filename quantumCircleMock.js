// quantumCircleMock.js
// Thomas Lee Harvey Quantum Clock - Mock 0–60 Second Animation
// Credit: Thomas Lee Harvey

const RADIUS = 12;
const SECOND_COUNT = 60;

const C = 186282;
const V = 18.61;
const PHI = 1000;

// ANSI Colors
const RESET = "\x1b[0m";
const DIM_GRAY = "\x1b[90m";
const DIM_BLUE = "\x1b[94m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_YELLOW = "\x1b[93m";
const BRIGHT_WHITE = "\x1b[97m";
const BLUE_ARC = "\x1b[34m";

// -------------------- Circle Functions --------------------
function generateCircle(radius) {
  const size = radius * 2 + 1;
  let grid = Array.from({ length: size }, () => Array(size).fill(' '));
  const cx = radius, cy = radius;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (Math.abs(dist - radius) < 0.5) grid[y][x] = 'o';
    }
  }
  return grid;
}

function placeHand(grid, radius, angle, symbol){
  const cx = radius, cy = radius;
  const x = Math.round(cx + radius * Math.cos(angle));
  const y = Math.round(cy + radius * Math.sin(angle));
  grid[y][x] = symbol;
  return grid;
}

function addNumbers(grid, radius){
  const cx = radius, cy = radius;
  for(let sec=0; sec<60; sec+=5){
    const angle = (sec/60)*2*Math.PI - Math.PI/2;
    const x = Math.round(cx + (radius+1)*Math.cos(angle));
    const y = Math.round(cy + (radius+1)*Math.sin(angle));
    const numStr = sec.toString().padStart(2,'0');
    for(let i=0;i<numStr.length;i++){
      if(grid[y] && grid[y][x+i]!==undefined) grid[y][x+i] = numStr[i];
    }
  }
  return grid;
}

function gridToString(grid, handAngle){
  const size = grid.length, cx = Math.floor(size/2), cy = cx;
  let result='';
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      let char = grid[y][x];
      const dx = x-cx, dy = y-cy;
      let angle = Math.atan2(dy, dx)+Math.PI/2;
      if(angle<0) angle+=2*Math.PI;

      if(char==='>') char=BRIGHT_CYAN+char+RESET;
      else if(char==='H') char=BRIGHT_YELLOW+char+RESET;
      else if(char.match(/\d/)) char=BRIGHT_WHITE+char+RESET;
      else if(char==='o'){
        const diff = (handAngle - angle + 2*Math.PI) % (2*Math.PI);
        if(diff>0 && diff<Math.PI) char = BLUE_ARC+char+RESET;
        else char = DIM_BLUE+char+RESET;
      } else char=DIM_GRAY+char+RESET;
      result+=char;
    }
    result+='\n';
  }
  return result;
}

// -------------------- Ψ_f Calculation --------------------
function calculatePsiF(c,t,v,phi){
  const ct=c*t, vt=v*t, psiF=ct+vt+phi;
  return {psiF, ct, vt, phi};
}

// -------------------- Observer State --------------------
function observerTime(sec){
  const portion = sec / SECOND_COUNT;
  if(portion < 0.33) return 'Past';
  else if(portion < 0.66) return 'Present';
  else return 'Future';
}

// -------------------- Mock 0–60 Second Animation --------------------
function runMockClock(){
  console.clear();
  for(let sec=0; sec<=SECOND_COUNT; sec++){
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const observer = observerTime(sec);

    let circle = generateCircle(RADIUS);
    const secAngle = (sec/SECOND_COUNT)*2*Math.PI - Math.PI/2;
    const hourAngle = (hour%12/12)*2*Math.PI - Math.PI/2;
    const minAngle = (minute/60)*2*Math.PI - Math.PI/2;

    circle = placeHand(circle, RADIUS, secAngle, '>');
    circle = placeHand(circle, RADIUS*0.6, hourAngle, 'H');
    circle = addNumbers(circle, RADIUS);

    console.clear();
    console.log(`=== Thomas Lee Harvey Quantum Clock Mock ===`);
    console.log(`Time: ${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`);
    console.log(`Observer is currently in: ${observer}\n`);
    console.log(gridToString(circle, secAngle));
    console.log(`Past ← Present → Future`);

    const {psiF, ct, vt, phi} = calculatePsiF(C, 500, V, PHI);
    console.log(`\nΨ_f Calculation:`);
    console.log(`c·t: ${ct.toLocaleString()} mi`);
    console.log(`v·t: ${vt.toLocaleString()} mi`);
    console.log(`Φ: ${phi.toLocaleString()} mi`);
    console.log(`Total Ψ_f: ${psiF.toLocaleString()} mi`);

  }
}

// -------------------- START --------------------
console.log("Starting Thomas Lee Harvey Quantum Clock Mock (0–60 seconds)...");
runMockClock();
