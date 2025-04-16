class Bot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 90;
    this.attackRange = this.width + 10;
    this.hitboxOffsetY = this.height / 3;


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

    this.isDead = false;

    this.element = document.getElementById('bot');
    this.element.classList.add('bot-color');

    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";

    this.sword = document.createElement('div');
    this.sword.classList.add('sword');
    this.element.appendChild(this.sword);


  }

  setSprite(state) {
    switch (state) {
      case 'idle':
        this.element.style.backgroundImage = "url('assets/Idle.png')";
        break;
      case 'run':
        this.element.style.backgroundImage = "url('assets/Run.png')";
        break;
      case 'attack':
        this.element.style.backgroundImage = "url('assets/Punch.png')";
        break;
      case 'jump':
        this.element.style.backgroundImage = "url('assets/Jump.png')";
        break;
    }
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

      this.element.style.transform = this.facingRight ? 'scaleX(1)' : 'scaleX(-1)';

      if (this.facingRight) {
        this.sword.style.left = '30px';
      } else {
        this.sword.style.left = '30px'; // or however wide your sword is
      }

      this.sword.style.transform = this.facingRight
      ? 'scaleX(1) rotate(30deg)'
      : 'scaleX(-1) rotate(-30deg)';

      this.setSprite('run');
      this.hasAttacked = false;
    } else {
      this.setSprite('idle'); // too close to move
    }


    if (
      verticalDistance < -60 &&
      verticalDistance > -150 &&
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
    
      // 🔻 This is where we animate the sword:
      this.sword.style.transform = this.facingRight
        ? 'scaleX(1) rotate(90deg)'
        : 'scaleX(-1) rotate(-90deg)';
    
      setTimeout(() => {
        this.sword.style.transform = this.facingRight
          ? 'scaleX(1) rotate(30deg)'
          : 'scaleX(-1) rotate(-30deg)';
    
        this.attacking = false;
        this.attackCooldown = true;
    
        setTimeout(() => {
          this.attackCooldown = false;
        }, 150); // ← cooldown
      }, 300); // ← sword stab duration
    }
    
  }

  handleCollisions() {
    this.onGround = false;

    const platforms = Array.from(document.querySelectorAll('.platform'));
    platforms.forEach(platform => {
      const platTop = parseInt(platform.style.top);
      const platLeft = parseInt(platform.style.left);
      const platRight = platLeft + platform.offsetWidth;
      const padding = 25;

      const standingOnPlatform =
        this.y + this.height >= platTop &&
        this.y + this.height <= platTop + Math.max(this.vy, 0) + 5 &&
        (this.x + this.width - padding) >= platLeft &&
        (this.x + padding) <= platRight &&
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
