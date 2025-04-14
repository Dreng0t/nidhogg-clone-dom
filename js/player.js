class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;

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
    }

    update() {
        const game = document.getElementById('game');
        const gameTop = game.offsetTop;
        const gameLeft = game.offsetLeft;

        // Handle Movement Input
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

        // Apply Friction to Knockback
        this.vx *= 0.9;
        if (this.isKnockedBack && Math.abs(this.vx) < 0.5) {
            this.isKnockedBack = false;
        }

        // Reset onGround before collision checks
        this.onGround = false;

        // Check Platform Collisions
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

        // Check Ground Collision Last
        if (this.y + this.height >= 400 && !this.onGround) {
            this.y = 400 - this.height;
            this.vy = 0;
            this.onGround = true;
        }

        // Update Position in the DOM
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    // Respawn Player Method
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
