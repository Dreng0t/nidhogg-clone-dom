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

    this.vx = 0; // For knockback movement
    this.vy = 0; // Not used yet, but ready for future jumping/gravity

    this.element = document.getElementById('bot');
  }

  update(player) {
    const distance = player.x - this.x;

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

    // Apply knockback velocity to position
    this.x += this.vx;
    this.y += this.vy;

    // Apply friction to knockback (slows down vx over time)
    this.vx *= 0.9;

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
