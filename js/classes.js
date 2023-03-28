class Sprite {
  constructor({
    position,
    imgOffset = { x: 0, y: 0 },
    imageSrc,
    scale,
    framesMax = { x: 1, y: 1 }, //Max frames in image - starts from 1
    framesCurrent = { x: 0, y: 0 }, //Iterate through frames
    framesEllapsed = 0, //Frames since start
    framesHold = 1, //How many loops per frame
    framesLimit = { start: 0, end: 0 }, //Which frames should be played
  }) {
    this.position = position;
    this.width;
    this.height;
    this.imgOffset = imgOffset;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = framesCurrent;
    this.framesEllapsed = framesEllapsed;
    this.framesHold = framesHold;
    this.framesLimit = framesLimit;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent.x * [this.image.width / this.framesMax.x], //crop size -->
      this.framesCurrent.y * [this.image.width / this.framesMax.x],
      this.image.width / this.framesMax.x,
      this.image.height / this.framesMax.y, // <--
      this.position.x - this.imgOffset.x, //image placement -->
      this.position.y - this.imgOffset.y,
      (this.image.width / this.framesMax.x) * this.scale,
      (this.image.height / this.framesMax.y) * this.scale // <--
    );
  }
  update() {
    this.draw();
    this.animateFrames();
  }

  animateFrames() {
    this.framesEllapsed++;
    if (this.framesEllapsed % this.framesHold == 0) {
      if (
        this.framesCurrent.x + 1 + this.framesCurrent.y * this.framesMax.x < // each +1 y = x row passed
        this.framesLimit.end + 1
      ) {
        if (this.framesCurrent.x + 1 < this.framesMax.x) {
          this.framesCurrent.x += 1;
        } else {
          this.framesCurrent.x = 0;
          this.framesCurrent.y += 1;
        }
      } else {
        this.framesCurrent.x = this.framesLimit.start % this.framesMax.x;
        this.framesCurrent.y = Math.floor(
          this.framesLimit.start / this.framesMax.x
        );
      }
    }
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    isPlayer = false,
    movespeed = 2,
    atkOffset = { x: 0, y: 0 },
    imageSrc,
    imgOffset = { x: 0, y: 0 },
    scale,
    controls,
    name,
    framesMax = { x: 1, y: 1 }, //Max frames in image - starts from 1
    framesCurrent = { x: 0, y: 0 }, //Iterate through frames
    framesEllapsed = 0, //Frames since start
    framesHold = 1, //How many loops per frame
    framesLimit = { start: 0, end: 0 },
  }) {
    //Passing object {a, b...} to the constructor so that we can pass any argument in any order
    super({
      position,
      imageSrc,
      imgOffset,
      scale,
      framesMax,
      framesCurrent,
      framesEllapsed,
      framesHold,
      framesLimit,
    });
    this.velocity = velocity;
    this.isPlayer = isPlayer;
    this.movespeed = movespeed;
    this.width = 50;
    this.height = 150;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 100,
      height: 50,
      atkOffset,
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
  // draw() {
  //   //character
  //   ctx.fillStyle = this.color;
  //   ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  // }
  //attack
  drawAttack() {
    if (this.attackTime) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        this.attackBox.position.x + this.attackBox.atkOffset.x,
        this.attackBox.position.y + this.attackBox.atkOffset.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.animateFrames();

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
        x: this.position.x + this.attackBox.atkOffset.x,
        y:
          findSpriteMid(this, "y") +
          this.attackBox.atkOffset.y -
          this.attackBox.height / 2,
      };
    }
  }
  attack() {
    this.isAttacking = true; //Gonna do damage
    this.attackTime = true; //How long the attack plays out
    this.cooldown = false; //Can't attack again until true
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
    setTimeout(() => {
      this.attackTime = false;
    }, 100);
    setTimeout(() => {
      this.cooldown = true;
    }, 400);
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
