class Bot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;

    this.speed = 2;
    this.attackRange = 50;
    this.attacking = false;
    this.attackCooldown = false;
    this.facingRight = true;
    this.hasAttacked = false;
    this.health = 3;

    this.gravity = 0.6;
    this.jumpStrength = -12;

    this.vx = 0;
    this.vy = 0;

    this.element = document.getElementById('bot');
  }

  update(player) {
    const distance = player.x - this.x;
    const verticalDistance = player.y - this.y;
    const horizontalDistance = Math.abs(distance);

    if (Math.abs(distance) > this.attackRange) {
      if (distance > 0) {
        this.x += this.speed;
        this.facingRight = true;
      } else {
        this.x -= this.speed;
        this.facingRight = false;
      }

      this.hasAttacked = false;
    }

    if (
      verticalDistance < -30 &&
      verticalDistance > -100 &&
      horizontalDistance < 150 &&
      this.onGround
    ) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }

    this.handleAttack(player);

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.9;

    this.handleCollisions();

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  handleAttack(player) {
    const distance = player.x - this.x;

    if (
      Math.abs(distance) <= this.attackRange &&
      !this.attacking &&
      !this.attackCooldown &&
      !this.hasAttacked
    ) {
      this.attacking = true;
      this.hasAttacked = true;

      const hitboxX = this.facingRight
        ? this.x + this.width
        : this.x - 10;

      const hitboxY = this.y + this.height / 3;

      const attackBox = document.createElement('div');
      attackBox.style.position = 'absolute';
      attackBox.style.left = hitboxX + 'px';
      attackBox.style.top = hitboxY + 'px';
      attackBox.style.width = '10px';
      attackBox.style.height = '10px';
      attackBox.style.backgroundColor = 'orange';
      attackBox.style.zIndex = '10';

      document.getElementById('game').appendChild(attackBox);

      setTimeout(() => {
        attackBox.remove();
        this.attacking = false;
        this.attackCooldown = true;

        setTimeout(() => {
          this.attackCooldown = false;
        }, 500);
      }, 100);
    }
  }

  handleCollisions() {
    this.onGround = false;

    const platforms = Array.from(document.querySelectorAll('.platform'));
    platforms.forEach(platform => {
      const platTop = parseInt(platform.style.top);
      const platLeft = parseInt(platform.style.left);
      const platRight = platLeft + platform.offsetWidth;

      const standingOnPlatform =
        this.y + this.height >= platTop &&
        this.y + this.height <= platTop + Math.max(this.vy, 0) + 5 &&
        this.x + this.width >= platLeft &&
        this.x <= platRight &&
        this.vy >= 0;

      if (standingOnPlatform) {
        this.y = platTop - this.height;
        this.vy = 0;
        this.onGround = true;
      }
    });

    const groundLevel = document.getElementById('game').offsetHeight;


    if (this.y + this.height >= groundLevel && !this.onGround) {
      this.y = groundLevel - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }

  respawn(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.health = 3;
    this.vx = 0;
    this.vy = 0;
    this.isKnockedBack = false;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}
