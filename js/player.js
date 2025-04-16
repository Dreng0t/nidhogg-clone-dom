class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 90;

        this.attackRange = this.width + 10; // optional, tweakable

        // Optional: makes attack hitbox placement easier to adjust later
        this.hitboxOffsetY = this.height / 3;


        this.vx = 0;
        this.vy = 0;

        this.speed = 3;
        this.jumpStrength = -12;
        this.gravity = 0.6;

        this.onGround = false;
        this.attacking = false;
        this.attackCooldown = false;
        this.facingRight = true;
        this.health = 3;
        this.isKnockedBack = false;

        this.element = document.getElementById('player');

        this.isDead = false;

        this.element = document.getElementById('player');
        this.element.classList.add('player-color');

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
            /*case 'attack':
                this.element.style.backgroundImage = "url('assets/Punch.png')";
                break;*/
            case 'jump':
                this.element.style.backgroundImage = "url('assets/Jump.png')";
                break;
        }
    }


    update() {
        if (!this.isKnockedBack) {
            if (keys['a']) {
                this.vx = -this.speed;
                this.facingRight = false;
                if (!this.attacking) this.setSprite('run');
            } else if (keys['d']) {
                this.vx = this.speed;
                this.facingRight = true;
                if (!this.attacking) this.setSprite('run');
            } else {
                this.vx = 0;
                if (!this.attacking) this.setSprite('idle');
            }

            this.element.style.transform = this.facingRight ? 'scaleX(1)' : 'scaleX(-1)';

            if (!this.attacking) {
                if (this.facingRight) {
                  this.sword.style.left = '30px';
                } else {
                  this.sword.style.left = '30px'; // tweak this if needed
                }
              
                this.sword.style.transform = this.facingRight
                  ? 'scaleX(1) rotate(30deg)'
                  : 'scaleX(-1) rotate(-30deg)';
              }
              
              
              

        }

        if (keys['w'] && this.onGround) {
            this.vy = this.jumpStrength;
            this.onGround = false;
            if (!this.attacking) this.setSprite('jump');
        }

        if (keys['j'] && !this.attacking && !this.attackCooldown) {
            this.attacking = true;
            this.setSprite('attack');
          
            
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
              }, 300);
            }, 150);
          }
          
          

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.9;
        if (this.isKnockedBack && Math.abs(this.vx) < 0.5) {
            this.isKnockedBack = false;
        }

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

        // Ground fallback
        const groundLevel = document.getElementById('game').offsetHeight;


        if (this.y + this.height >= groundLevel && !this.onGround) {
            this.y = groundLevel - this.height;
            this.vy = 0;
            this.onGround = true;
        }


        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
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
