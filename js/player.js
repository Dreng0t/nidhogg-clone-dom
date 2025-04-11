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
    }
  
    update() {
      // Movement
      if (keys['a']) {
        this.vx = -this.speed;
        this.facingRight = false;
      } else if (keys['d']) {
        this.vx = this.speed;
        this.facingRight = true;
      } else {
        this.vx = 0;
      }
  
      // Jumping
      if (keys['w'] && this.onGround) {
        this.vy = this.jumpStrength;
        this.onGround = false;
      }
  
      // Gravity
      this.vy += this.gravity;
  
      this.x += this.vx;
      this.y += this.vy;
  
      // Ground collision
      if (this.y + this.height >= 400) {
        this.y = 400 - this.height;
        this.vy = 0;
        this.onGround = true;
      }
  
      // Attacking
      if (keys['j'] && !this.attacking && !this.attackCooldown) {
        this.attacking = true;
  
        setTimeout(() => {
          this.attacking = false;
          this.attackCooldown = true;
          setTimeout(() => {
            this.attackCooldown = false;
          }, 300);
        }, 100);
      }
  
      // Update element position
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    }
  }
  