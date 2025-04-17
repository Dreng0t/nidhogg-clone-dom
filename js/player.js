class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y; // Determines start postion of the player
        this.width = 60;
        this.height = 90;//Determines the size of the player

        this.attackRange = this.width + 10; //Determines attack range, the distance of the sword from the player

        this.hitboxOffsetY = this.height / 3;//Determines the vertical offset of sword hitbox


        this.vx = 0;
        this.vy = 0;//The initial horizontal and vertical velocity of the player, 0 for still

        this.speed = 2;//The player's speed 
        this.jumpStrength = -12;//the initial upward velocity when the player jumps
        this.gravity = 0.6;//Determines the force of gravity, pulls the player down if not on ground

        this.onGround = false;
        this.attacking = false;
        this.attackCooldown = false;
        this.facingRight = true;
        this.health = 100;
        this.isKnockedBack = false;//various booleans to determine the state of the player at a given time, also the player health


        this.isDead = false;//death boolean

        this.element = document.getElementById('player');
        this.element.classList.add('player-color');
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";//Reference to player DOM element and the syling applied to it

        this.sword = document.createElement('div');
        this.sword.classList.add('sword');
        this.element.appendChild(this.sword);//creation and of sowrd element 

    }

    setSprite(state) {
        switch (state) {
            case 'idle':
                this.element.style.backgroundImage = "url('assets/Idle.png')";
                break;
            case 'run':
                this.element.style.backgroundImage = "url('assets/Run.png')";
                break;
            case 'attack':
                this.element.style.backgroundImage = "url('assets/Punch.png')";
                break;
            case 'jump':
                this.element.style.backgroundImage = "url('assets/Jump.png')";
                break;
        }
    }//switch statement to determine what the player is dong and which sprite should be used


    update() {//update function which is called every frame with in game.js to update the player state to the changing stae of the game
        if (!this.isKnockedBack) {
            if (keys['a']) {
                this.vx = -this.speed;//moves left, negative velocity
                this.facingRight = false;
                if (!this.attacking) this.setSprite('run');//sets sprite to run mode
            } else if (keys['d']) {
                this.vx = this.speed;//rightward movement, positive velocity
                this.facingRight = true;
                if (!this.attacking) this.setSprite('run');
            } else {
                this.vx = 0;//0 velocity, standing still
                if (!this.attacking) this.setSprite('idle');
            }//handles the movement of the player based on keyboard inputs
            //flip the player sprite and sword based on last direction moved in
            this.element.style.transform = this.facingRight ? 'scaleX(1)' : 'scaleX(-1)';

            if (!this.attacking) {
                if (this.facingRight) {
                    this.sword.style.left = '30px';//sword visual placement when not attacking
                } else {
                    this.sword.style.left = '30px'; 
                }

                this.sword.style.transform = this.facingRight
                    ? 'scaleX(1) rotate(30deg)'
                    : 'scaleX(-1) rotate(-30deg)';//angle of the sword when at rest, negatives for when player is looking left
            }




        }

        if (keys['w'] && this.onGround) {//similar to the movement handling but for jumping
            this.vy = this.jumpStrength;//when w is pressed, motion in why axis is set to jump strength
            this.onGround = false;//not on ground now so flip the boolean
            if (!this.attacking) this.setSprite('jump');//sets sprite to jumo mode
        }
        //the fun stuff, attacking enacted by pressing 'J'
        if (keys['j'] && !this.attacking && !this.attackCooldown) {
            this.attacking = true;//flip attacking boolean
            this.setSprite('attack');//set sprite to attack mode


            this.sword.style.transform = this.facingRight
                ? 'scaleX(1) rotate(90deg)'
                : 'scaleX(-1) rotate(-90deg)';//angle of sword when attacking, 90 degrees for flat

            setTimeout(() => {

                this.sword.style.transform = this.facingRight
                    ? 'scaleX(1) rotate(30deg)'
                    : 'scaleX(-1) rotate(-30deg)';//placement of sword when attacking
                                                 // tried to fine tune to make it different from rest but it was messing around in a way i dont even understand
                this.attacking = false;
                this.attackCooldown = true;//attack done so isAttacking off and attack coooldown on

                setTimeout(() => {
                    this.attackCooldown = false;
                }, 300);//time out for when the player can attack again, max 1 attack every 300ms
            }, 150);//duration of the attack itself, 150ms
        }


        //application of gravity 
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.9;//application of friction to the knockback suffered when hit
        if (this.isKnockedBack && Math.abs(this.vx) < 0.5) {
            this.isKnockedBack = false;
        }

        //collision with platforms
        this.onGround = false;
        const platforms = Array.from(document.querySelectorAll('.platform'));//fetches all the platforms DOMs
        platforms.forEach(platform => {//iterates through the array of platforms and ascertains their boundaries, assigns them to variables
            const platTop = parseInt(platform.style.top);
            const platLeft = parseInt(platform.style.left);
            const platRight = platLeft + platform.offsetWidth;
            const padding = 25;

            const standingOnPlatform =
                this.y + this.height >= platTop &&
                this.y + this.height <= platTop + Math.max(this.vy, 0) + 5 &&
                (this.x + this.width - padding) >= platLeft &&
                (this.x + padding) <= platRight &&
                this.vy >= 0;//lays out the bounds at which the player will be stood on a platform, assigns it to a boolean

            if (standingOnPlatform) {
                this.y = platTop - this.height;
                this.vy = 0;
                this.onGround = true;
            }//if player is on a platform, y coord is top of platform, vertical velocity is zero so he wont fall through
        });//and onGround set to true

        //handles collision with the ground in a similar manner to the platforms
        const groundLevel = document.getElementById('game').offsetHeight;
        //ascertains bounds of the ground

        if (this.y + this.height >= groundLevel && !this.onGround) {
            this.y = groundLevel - this.height;
            this.vy = 0;
            this.onGround = true;
        }//if player lies up on the bounds of the ground then postion is the top of ground
        //vertical velocity is zero and onGround is true
        
        const game = document.getElementById('game');
        const maxX = game.offsetWidth - this.width;

        if (this.x < 0) this.x = 0;
        if (this.x > maxX) this.x = maxX;//handles collision with the side of arena, so you can't walk off



        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';//applies player position to the DOM element
    }

    respawn(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.health = 100;
        this.vx = 0;
        this.vy = 0;
        this.isKnockedBack = false;

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }//respawn, effectively just rests player to default values
}
