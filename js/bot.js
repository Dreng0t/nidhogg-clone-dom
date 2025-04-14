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

      this.element = document.getElementById('bot');

      this.health = 3;
  }

  update(player) {
      const distance = player.x - this.x;

      // Move toward player if not in attack range
      if (Math.abs(distance) > this.attackRange) {
          if (distance > 0) {
              this.x += this.speed;
              this.facingRight = true;
          } else {
              this.x -= this.speed;
              this.facingRight = false;
          }

          this.hasAttacked = false; // Reset attack state when moving
      }

      // Handle Attacking
      if (Math.abs(distance) <= this.attackRange && !this.attacking && !this.attackCooldown && !this.hasAttacked) {
          this.attacking = true;
          this.hasAttacked = true;

          // Show attack hitbox (orange)
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
              }, 500); // Cooldown between attacks
          }, 100); // Attack duration
      }

      // Update Bot Element Position in DOM
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
  }
}
