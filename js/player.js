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

        if (keys['w'] && this.onGround) {
            this.vy = this.jumpStrength;
            this.onGround = false;
        }

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
