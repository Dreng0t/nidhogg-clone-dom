class Bot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.color = "tomato";

        this.speed = 2;
        this.attackRange= 50;

        this.attacking = false;
        this.attackCooldown = false;

        this.facingRight = true;

        this.hasAttacked = false;
    }

    update(player) {
        const distance = player.x - this.x;
        /*Measures distance to player. */

        if (Math.abs(distance) > this.attackRange) {
            // Move toward player
            if (distance > 0) {
              this.x += this.speed;
              this.facingRight = true;
            } else {
              this.x -= this.speed;
              this.facingRight = false;
            }
          
            // Reset attack availability if player moves away
            this.hasAttacked = false;
          }
        /*Move toward player unless already close enough. */

        if (Math.abs(distance) <= this.attackRange && !this.attacking && !this.attackCooldown && !this.hasAttacked) {
            this.attacking = true;
            this.hasAttacked = true;

            setTimeout(() => {
                this.attacking = false;
                this.attackCooldown = true;

                setTimeout(() => {
                    this.attackCooldown = false;
                }, 500)
            }, 100)
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.attacking) {
            const hitboxX = this.facingRight
              ? this.x + this.width
              : this.x - 10;
          
            ctx.fillStyle = 'orange';
            ctx.fillRect(hitboxX, this.y + this.height / 3, 10, 10);
          }
          
    }
}