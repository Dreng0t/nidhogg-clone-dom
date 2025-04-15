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

    this.vx = 0; // For knockback movement
    this.vy = 0; // Not used yet, but ready for future jumping/gravity

    this.element = document.getElementById('bot');
  }

  update(player) {
    const distance = player.x - this.x;

    const game = document.getElementById('game');
    const gameTop = game.offsetTop;
    const gameLeft = game.offsetLeft;

    // Movement logic - only chase if not in attack range
    if (Math.abs(distance) > this.attackRange) {
      if (distance > 0) {
        this.x += this.speed;
        this.facingRight = true;
      } else {
        this.x -= this.speed;
        this.facingRight = false;
      }

      this.hasAttacked = false; // Reset attack if moving
    }

    const verticalDistance = player.y - this.y;
    const closeEnough = Math.abs(player.x - this.x) < 100;

    if (
      verticalDistance < -30 &&
      closeEnough &&
      this.onGround
    ) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }



    // Attack logic
    if (
      Math.abs(distance) <= this.attackRange &&
      !this.attacking &&
      !this.attackCooldown &&
      !this.hasAttacked
    ) {
      this.attacking = true;
      this.hasAttacked = true;

      // Create attack hitbox (orange)
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

    this.vy += this.gravity;

    // Apply knockback velocity to position
    this.x += this.vx;
    this.y += this.vy;

    // Apply friction to knockback (slows down vx over time)
    this.vx *= 0.9;

    this.onGround = false;

    const platforms = Array.from(document.querySelectorAll('.platform'));

    platforms.forEach(platform => {
      const platformTop = platform.offsetTop;
      const platformLeft = platform.offsetLeft;
      const platformRight = platformLeft + platform.offsetWidth;

      const standingOnPlatform =
        this.y + this.height >= platformTop - gameTop &&
        this.y + this.height <= platformTop - gameTop + Math.max(this.vy, 0) + 5 &&
        this.x + this.width >= platformLeft - gameLeft &&
        this.x <= platformRight - gameLeft &&
        this.vy >= 0;

      if (standingOnPlatform) {
        this.y = platformTop - gameTop - this.height;
        this.vy = 0;
        this.onGround = true;
      }
    });

    if (this.y + this.height >= 400 && !this.onGround) {
      this.y = 400 - this.height;
      this.vy = 0;
      this.onGround = true;
    }


    // Update Bot's position on screen
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  respawn(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.health = 3; // Reset health
    this.vx = 0;
    this.vy = 0;
    this.isKnockedBack = false;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}
