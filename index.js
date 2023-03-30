const background = new Sprite({
  position: { x: 0, y: -420 },
  imageSrc: "./images/background/Greek_style_background__16bit.png",
  scale: 1,
});

// const sprite = new Sprite({
//   position: { x: 500, y: 300 },
//   imageSrc: "./images/CharWalk.png",
//   framesMax: { x: 3, y: 3 },
//   scale: 3.5,
//   framesHold: 60,
//   framesLimit: { start: 2, end: 3 },
// });

//Initiate Player and Enemy objects
const player = new Fighter({
  position: { x: 200, y: 2000 },
  velocity: { x: 0, y: 0 },
  isPlayer: true,
  atkOffset: { x: 25, y: 0 },
  controls: p1Controls,
  name: "player",
  imageSrc: "./images/CharWalk.png",
  framesMax: { x: 3, y: 3 },
  scale: 3.5,
  framesHold: 60,
  framesLimit: { start: 0, end: 1 },
});

const enemy = new Fighter({
  position: { x: 800, y: 2000 },
  velocity: { x: 0, y: 0 },
  atkOffset: { x: -50, y: 0 },
  controls: p2Controls,
  name: "enemy",
  imageSrc: "./images/CharWalk.png",
  framesMax: { x: 3, y: 3 },
  scale: 3.5,
  framesHold: 60,
  framesLimit: { start: 0, end: 1 },
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
      attacker.attackBox.atkOffset.x >=
      target.position.x &&
    attacker.attackBox.position.x + attacker.attackBox.atkOffset.x <=
      target.position.x + target.width &&
    attacker.attackBox.position.y +
      attacker.attackBox.height +
      attacker.attackBox.atkOffset.y >=
      target.position.y &&
    attacker.attackBox.position.y + attacker.attackBox.atkOffset.y <=
      target.position.y + target.height
  );
}
function damage(attacker, target) {
  target.health -= attacker.damage;

  document.querySelector(
    `#${target.name}Health`
  ).style.width = `${target.health}%`;
}

let timerID;
function timer(time) {
  time -= 1;
  document.querySelector("#timer").innerHTML = `${time}`;
  if (time > 0) {
    timerID = setTimeout(() => timer(time), 1000);
  } else gameOver({ timerID, player, enemy });
}

function gameInit() {
  player.health = 100;
  enemy.health = 100;
  let time = 100;
  timer(time);
  gameLoop();
}

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//Animate Game Loop
function gameLoop() {
  if (player.health > 0 && enemy.health > 0) {
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

    if (player.health <= 0 || enemy.health <= 0) {
      gameOver({ timerID, player, enemy });
    }
  }
  console.log("end");
}
player.setKeys();
enemy.setKeys();
menuInit(gameInit);
