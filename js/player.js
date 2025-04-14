class Player {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 60;

      this.vx = 0;
      this.vy = 0;
      this.speed = 3;
      this.jumpStrength = -10;
      this.gravity = 0.5;
      this.onGround = false;

      this.attacking = false;
      this.attackCooldown = false;
      this.facingRight = true;

      this.element = document.getElementById('player');

      this.health= 3;
  }

  update() {
      // Handle Movement Input
      if (keys['a']) {
          this.vx = -this.speed;
          this.facingRight = false;
      } else if (keys['d']) {
          this.vx = this.speed;
          this.facingRight = true;
      } else {
          this.vx = 0;
      }

      // Handle Jumping
      if (keys['w'] && this.onGround) {
          this.vy = this.jumpStrength;
          this.onGround = false;
      }

      // Handle Attacking Input
      if (keys['j'] && !this.attacking && !this.attackCooldown) {
          console.log('Attack triggered');
          this.attacking = true;

          // Optional: Show attack hitbox (temporary visual)
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
          attackBox.style.backgroundColor = 'yellow';
          attackBox.style.zIndex = '10';

          document.getElementById('game').appendChild(attackBox);

          // Remove attack box after attack duration
          setTimeout(() => {
              attackBox.remove();
              this.attacking = false;
              this.attackCooldown = true;
              setTimeout(() => {
                  this.attackCooldown = false;
              }, 300);
          }, 100);
      }

      // Apply Gravity
      this.vy += this.gravity;

      // Apply Movement
      this.x += this.vx;
      this.y += this.vy;

      // Ground Collision
      if (this.y + this.height >= 400) {
          this.y = 400 - this.height;
          this.vy = 0;
          this.onGround = true;
      }

      // Update Player Element Position in DOM
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
  }
}
