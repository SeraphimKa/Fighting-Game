const canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");

//Canvas
canvas.width = 1000;
canvas.height = 600;

//Arena
const grav = 0.4;
const floorHeight = canvas.height * 0.95;
const wallWidth = canvas.width * 0.05;

//Sprites
class Sprite {
  constructor({
    position,
    velocity,
    isPlayer = false,
    color,
    movespeed = 2,
    offset = { x: 0, y: 0 },
    controls,
    name,
  }) {
    //Passing object {a, b...} to the constructor so that we can pass any argument in any order
    this.position = position;
    this.velocity = velocity;
    this.isPlayer = isPlayer;
    this.color = color;
    this.movespeed = movespeed;
    this.width = 50;
    this.height = 150;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 100,
      height: 50,
      offset,
    };
    this.isAttacking = false;
    this.attackTime = false;
    this.damage = 5;
    this.cooldown = true;
    this.controls = controls;
    this.action = {
      moveLeft: { pressed: false },
      moveRight: { pressed: false },
      jump: { pressed: false },
      fall: { pressed: false },
      attack1: { pressed: false },
      attack2: { pressed: false },
      attack3: { pressed: false },
    };
    this.name = name;
    this.health = 100;
  }
  draw() {
    //character
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack
    if (this.attackTime) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        this.attackBox.position.x + this.attackBox.offset.x,
        this.attackBox.position.y + this.attackBox.offset.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    if (this.position.y + this.height < floorHeight) this.velocity.y += grav;

    this.control();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height >= floorHeight) {
      this.velocity.y = 0;
      this.position.y = floorHeight - this.height;
    }
  }
  control() {
    this.velocity.x = 0;
    if (this.action.moveLeft.pressed && this.position.x > wallWidth) {
      this.velocity.x -= this.movespeed;
    } else this.velocity.x += this.movespeed;

    if (
      this.action.moveRight.pressed &&
      this.position.x + this.width < canvas.width - wallWidth
    )
      this.velocity.x += this.movespeed;
    else this.velocity.x -= this.movespeed;

    if (this.action.jump.pressed && this.velocity.y == 0) this.velocity.y -= 13;
    if (
      this.action.fall.pressed &&
      this.position.y + this.height < floorHeight
    ) {
      this.velocity.y += 4;
    }
    if (this.action.attack1.pressed && this.cooldown) {
      this.attack();
      this.attackBox.position = {
        x: this.position.x + this.attackBox.offset.x,
        y:
          findSpriteMid(this, "y") +
          this.attackBox.offset.y -
          this.attackBox.height / 2,
      };
    }
  }
  attack() {
    this.isAttacking = true;
    this.attackTime = true;
    this.cooldown = false;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
    setTimeout(() => {
      this.attackTime = false;
    }, 100);
    setTimeout(() => {
      this.cooldown = true;
    }, 1000);
  }

  setKeys() {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case this.controls.moveLeft:
          this.action.moveLeft.pressed = true;
          break;
        case this.controls.moveRight:
          this.action.moveRight.pressed = true;
          break;
        case this.controls.jump:
          this.action.jump.pressed = true;
          break;
        case this.controls.fall:
          this.action.fall.pressed = true;
          break;
        case this.controls.attack1:
          this.action.attack1.pressed = true;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case this.controls.moveLeft:
          this.action.moveLeft.pressed = false;
          break;
        case this.controls.moveRight:
          this.action.moveRight.pressed = false;
          break;
        case this.controls.jump:
          this.action.jump.pressed = false;
          break;
        case this.controls.fall:
          this.action.fall.pressed = false;
          break;
        case this.controls.attack1:
          this.action.attack1.pressed = false;
      }
    });
  }
}
//Initiate Player and Enemy objects
const player = new Sprite({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 0 },
  isPlayer: true,
  color: "red",
  offset: { x: 25, y: 0 },
  controls: p1Controls,
  name: "player",
});

const enemy = new Sprite({
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
    attacker.attackBox.position.x + attacker.attackBox.width >=
      target.position.x &&
    attacker.attackBox.position.x <= target.position.x + target.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      target.position.y &&
    attacker.attackBox.position.y <= target.position.y + target.height
  );
}
function damage(attacker, target) {
  target.health -= attacker.damage;

  document.querySelector(
    `#${target.name}Health`
  ).style.width = `${target.health}%`;
}

player.setKeys();
enemy.setKeys();
//Animate Game Loop
function animate() {
  window.requestAnimationFrame(animate);
  //background
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "brown";
  ctx.fillRect(0, floorHeight - 50, canvas.width, canvas.height);
  //input
  player.update();
  enemy.update();

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

animate();
