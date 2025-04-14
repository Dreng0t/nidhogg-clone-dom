class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;

        this.vx = 0; // Horizontal velocity
        this.vy = 0; // Vertical velocity

        this.speed = 3;
        this.jumpStrength = -10;
        this.gravity = 0.5;
        this.onGround = false;

        this.attacking = false;
        this.attackCooldown = false;
        this.facingRight = true;
        this.health = 3;

        this.isKnockedBack = false; // Controls knockback state

        this.element = document.getElementById('player');
    }

    update() {
        // Handle Movement Input only if not knocked back
        if (!this.isKnockedBack) {
            if (keys['a']) {
                this.vx = -this.speed;
                this.facingRight = false;
            } else if (keys['d']) {
                this.vx = this.speed;
                this.facingRight = true;
            } else {
                this.vx = 0;
            }
        }

        // Handle Jumping
        if (keys['w'] && this.onGround) {
            this.vy = this.jumpStrength;
            this.onGround = false;
        }

        // Handle Attacking
        if (keys['j'] && !this.attacking && !this.attackCooldown) {
            this.attacking = true;

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

        // Apply Friction to Knockback (slow down vx over time)
        this.vx *= 0.9;

        // Turn off knockback once vx is small enough
        if (this.isKnockedBack && Math.abs(this.vx) < 0.5) {
            this.isKnockedBack = false;
        }

        // Ground Collision
        if (this.y + this.height >= 400) {
            this.y = 400 - this.height;
            this.vy = 0;
            this.onGround = true;
        }

        // Update Player Element Position in the DOM
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
