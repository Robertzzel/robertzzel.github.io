let colors = ["dodgerblue", "red", "green", "yellow"]
let offsets = [[-2.5,0],[0,-4],[0,3],[2.5,0]]
const PAWN_WIDTH = 3
const PAWN_HEIGHT = 9

let getPositionByNearestCoords = (x, y) => {
    let nearestPosition = null;
    let minDistance = Infinity;

    const MIN_POS = -1;
    const MAX_POS = 50;

    for (let pos = MIN_POS; pos <= MAX_POS; pos++) {
        let [px, py] = getCoordsByPosition(pos);

        px = (px / 100) * window.innerWidth;
        py = (py / 100) * window.innerHeight;

        let dx = px - x;
        let dy = py - y;
        let dist = dx * dx + dy * dy;

        if (dist < minDistance) {
            minDistance = dist;
            nearestPosition = pos;
        }
    }

    return nearestPosition;
};

var positions = {
    0: [5.75 , 9],
    1: [5.75, 40],
    2: [5.75, 57],
    3: [5.75, 75],
    4: [5.75, 92],
    8: [14, 40],
    7: [14, 57],
    6: [14, 75],
    5: [14, 92],
    9: [22, 40],
    10: [22, 57],
    11: [22, 75],
    12: [22, 92],
    16: [30, 40],
    15: [30, 57],
    14: [30, 75],
    13: [30, 92],
    17: [38, 40],
    18: [38, 57],
    19: [38, 75],
    20: [38, 92],
    24: [46, 40],
    23: [46, 57],
    22: [46, 75],
    21: [46, 92],
    25: [54, 40],
    26: [54, 57],
    27: [54, 75],
    28: [54, 92],
    32: [62, 40],
    31: [62, 57],
    30: [62, 75],
    29: [62, 92],
    33: [70, 40],
    34: [70, 57],
    35: [70, 75],
    36: [70, 92],
    40: [78, 40],
    39: [78, 57],
    38: [78, 75],
    37: [78, 92],
    41: [86, 40],
    42: [86, 57],
    43: [86, 75],
    44: [86, 92],
    48: [94, 40],
    47: [94, 57],
    46: [94, 75],
    45: [94, 92],
    49: [94, 23],
    50: [94, 8]
}
let getCoordsByPosition = (positionNumber) => {
    return positions[positionNumber] || positions[0]
}

let getNumberOfTeams = () => {
    while(true) {
        let numberOfTeams = prompt("Number of teams:")
        if(["1", "2", "3", "4"].includes(numberOfTeams)) {
            return numberOfTeams
        }
    }
}

let saveStateInLocalStorage = (pawns) => { // pawns: nr de pioni, pawn-{i} pionul cu nr i
    localStorage.setItem("pawns", pawns.length)
    for(let i = 0; i < pawns.length; ++i){
        localStorage.setItem(`pawn-${i}`, pawns[i].position)
    }
}

let initFromLocalStorage = () => { // pawns: nr de pioni, pawn-{i} pionul cu nr i
    let avalabilePawns = localStorage.getItem("pawns")
    if(avalabilePawns === null){
        return false;
    }
    avalabilePawns = parseInt(avalabilePawns)
    let pawns = []

    for(let i = 0; i < avalabilePawns; ++i) {
        let pawnDetails = localStorage.getItem(`pawn-${i}`)
        let pawnPosition = parseInt(pawnDetails)

        let pawn = new Pawn(colors[i], offsets[i], pawnPosition)
        pawns.push(pawn)
    }

    return pawns
}

let initPawns = (numberOfTeams) => {
    let pawns = []
    for(let i = 0; i < numberOfTeams; i++) {
        let pawn = new Pawn(colors[i], offsets[i])
        pawns.push(pawn)
    }
    return pawns
}

const Pawn = class {
  constructor(color, offsets, position = 0) {
    this.color = color;
    this.position = position;
    this.image = "Pawns/" + color + ".png";
    this.offsets = offsets;
    this.id = `pawn-${color}`;
    this.setPosition(this.position);
  }

  setPosition(newPosition) {
    this.position = newPosition;
    let coords = getCoordsByPosition(this.position);
    this.x = coords[0]-PAWN_WIDTH/2+this.offsets[0];
    this.y = coords[1]-PAWN_HEIGHT/2+this.offsets[1];
  }

  getImageTag() {
    const img = document.createElement("img");

    img.src = this.image;
    img.id = this.id;

    img.style.position = "absolute";
    img.style.left = `${this.x}vw`;
    img.style.top = `${this.y}vh`;
    img.style.width = `${PAWN_WIDTH}vw`;
    img.style.height = `${PAWN_HEIGHT}vh`;
    img.draggable = true;

    img.style.cursor = "grab";
    img.style.userSelect = "none";
    img.style.touchAction = "none";
    
    img.onclick = (e) => {
        if(pawnToBeMoved !== null){
            document.getElementById(pawnToBeMoved.id).classList.remove("selected");
        }
        if(pawnToBeMoved === this){
            pawnToBeMoved = null;
            return;
        }
        pawnToBeMoved = this;
        let pawnTag = document.getElementById(pawnToBeMoved.id)
        pawnTag.classList.add("selected");
    };

    return img;
    }
}

var pawnToBeMoved = null;
document.getElementById("reset-image").addEventListener("click", () => {
    let res = confirm("You want to reset the game?")
    if(res){
        localStorage.clear()
        location.reload()
    }
})

document.getElementById("board").addEventListener("click", (e) => {
    if(pawnToBeMoved === null){
        return;
    }
    const newPos = getPositionByNearestCoords(e.clientX,e.clientY);
    pawnToBeMoved.setPosition(newPos);
    var tag = document.getElementById(pawnToBeMoved.id);
    console.log(pawnToBeMoved.x, pawnToBeMoved.y)
    tag.style.left = `${pawnToBeMoved.x}vw`;
    tag.style.top = `${pawnToBeMoved.y}vh`;
    console.log(tag.classList)
    tag.classList.remove("selected");
    pawnToBeMoved = null;
    saveStateInLocalStorage(pawns);
})

var pawns = [];
var numberOfTeams = 0;

function main(){
    pawns = initFromLocalStorage()
    if(pawns === false) {
        numberOfTeams = getNumberOfTeams()
        pawns = initPawns(numberOfTeams)
    }

    let board = document.getElementById("board")
    board.src = "HorizontalBoard.png"
    board.style.width = "100vw"
    board.style.height = "100vh"

    pawns.forEach(pawn => {
        document.body.appendChild(pawn.getImageTag());
    });
}

window.addEventListener('load', function () {
  main()
})

//TESTEAZA POZITIILE
// const TEST_OFFSET = 0; // you can adjust if you use pawn offsets
// const TEST_SIZE = 20; // size of the marker

// for (let pos = -1; pos <= 50; pos++) { // include all your special positions
//   const [x, y] = getCoordsByPosition(pos, TEST_OFFSET);

//   // create a red marker
//   const marker = document.createElement("div");
//   marker.style.position = "absolute";
//   marker.style.left = `${x}vw`;
//   marker.style.top = `${y}vh`;
//   marker.style.width = `${TEST_SIZE}px`;
//   marker.style.height = `${TEST_SIZE}px`;
//   marker.style.backgroundColor = "black";
//   marker.style.borderRadius = "50%"; // make it a circle
//   marker.style.transform = "translate(-50%, -50%)"; // center on coordinates
//   marker.title = pos; // hover shows the position number
//   marker.style.zIndex = "1000"; // ensure it's on top

//   document.body.appendChild(marker);
// }
