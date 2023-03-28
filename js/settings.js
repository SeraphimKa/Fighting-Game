const canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");

//Canvas
canvas.width = 1000;
canvas.height = 600;

//Arena
const grav = 0.4;
const floorHeight = canvas.height * 0.95;
const wallWidth = canvas.width * 0.05;

// Controls

const p1Controls = {
  moveLeft: "a",
  moveRight: "d",
  jump: "w",
  fall: "s",
  attack1: "h",
  attack2: "j",
  attack3: "k",
};

const p2Controls = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  jump: "ArrowUp",
  fall: "ArrowDown",
  attack1: "1",
  attack2: "2",
  attack3: "3",
};

function changeControls(playerControls, controlToChange, newKey) {
  if (playerControls.hasOwnProperty(controlToChange)) {
    playerControls[controlToChange] = newKey;
  }
}
