const canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");

//Canvas
canvas.width = 1000;
canvas.height = 600;

//Arena
const grav = 0.4;
const floorHeight = canvas.height * 0.95;
const wallWidth = canvas.width * 0.05;
let time = 100;
let timerID;

const background = new Sprite({
  position: { x: 0, y: -420 },
  imageSrc: "./images/background/Greek_style_background__16bit.png",
  scale: 1,
});

//Initiate Player and Enemy objects
const player = new Fighter({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 0 },
  isPlayer: true,
  color: "red",
  offset: { x: 25, y: 0 },
  controls: p1Controls,
  name: "player",
});

const enemy = new Fighter({
  position: { x: 800, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
  controls: p2Controls,
  name: "enemy",
});

function findSpriteMid(obj, axis) {
  let xy;
  axis == "x" ? (xy = "width") : (xy = "height");
  return obj.position[axis] + obj[xy] / 2;
}

function checkCollision({ attacker, target }) {
  return (
    attacker.attackBox.position.x +
      attacker.attackBox.width +
      attacker.attackBox.offset.x >=
      target.position.x &&
    attacker.attackBox.position.x + attacker.attackBox.offset.x <=
      target.position.x + target.width &&
    attacker.attackBox.position.y +
      attacker.attackBox.height +
      attacker.attackBox.offset.y >=
      target.position.y &&
    attacker.attackBox.position.y + attacker.attackBox.offset.y <=
      target.position.y + target.height
  );
}
function damage(attacker, target) {
  target.health -= attacker.damage;

  document.querySelector(
    `#${target.name}Health`
  ).style.width = `${target.health}%`;
}

function timer(time) {
  time -= 1;
  document.querySelector("#timer").innerHTML = `${time}`;
  if (time > 0) {
    timerID = setTimeout(() => timer(time), 100);
  } else gameOver(timerID);
}

function gameOver(timerID) {
  clearTimeout(timerID);
  document.querySelector("#gameOver").innerHtml = "Game Over";
  document.querySelector("#gameOver").style.display = "flex";
}

player.setKeys();
enemy.setKeys();
timer(time);
//Animate Game Loop
function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  //background
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "brown";
  ctx.fillRect(0, floorHeight - 50, canvas.width, canvas.height);
  //input
  background.update();
  player.update();
  enemy.update();
  player.drawAttack();
  enemy.drawAttack();

  if (
    player.isAttacking &&
    checkCollision({ attacker: player, target: enemy })
  ) {
    damage(player, enemy);
    player.isAttacking = false;
  }
  if (
    enemy.isAttacking &&
    checkCollision({ attacker: enemy, target: player })
  ) {
    damage(enemy, player);
    enemy.isAttacking = false;
  }
}

gameLoop();
