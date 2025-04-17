class Bot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 90;
    this.attackRange = this.width + 10;
    this.hitboxOffsetY = this.height / 3;


    this.speed = 1.5;
    this.attackRange = 50;
    this.attacking = false;
    this.attackCooldown = false;
    this.facingRight = true;
    this.hasAttacked = false;
    this.health = 100;

    this.gravity = 0.6;
    this.jumpStrength = -12;

    this.vx = 0;
    this.vy = 0;

    this.element = document.getElementById('bot');

    this.isDead = false;

    this.element = document.getElementById('bot');
    this.element.classList.add('bot-color');

    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";

    this.sword = document.createElement('div');
    this.sword.classList.add('sword');
    this.element.appendChild(this.sword);
    //constructor very similar to player.js, all the same attributes

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
    }//switch statement for the state of the bot and the corresponding sprite asset
  }


  update(player) {//update function for the bot, takes in the player as argument as so much of what the bot does is determined by what the player does
    const distance = player.x - this.x;
    const verticalDistance = player.y - this.y;
    const horizontalDistance = Math.abs(distance);//determines the distance between the bot and player, to be used in managing the behaviour of the bot

    if (horizontalDistance > this.attackRange) {
      if (distance > 0) {//block detemining whether the bot should move
        this.x += this.speed;//if the player is outside of the bots attack range then move toward it
        this.facingRight = true;
      } else {
        this.x -= this.speed;//negative velocity if the player is to the left (ditance<0) of the bot
        this.facingRight = false;
      }

      this.element.style.transform = this.facingRight ? 'scaleX(1)' : 'scaleX(-1)';

      if (this.facingRight) {
        this.sword.style.left = '30px';
      } else {
        this.sword.style.left = '30px'; 
      }

      this.sword.style.transform = this.facingRight
        ? 'scaleX(1) rotate(30deg)'
        : 'scaleX(-1) rotate(-30deg)';//code that handles flipping the bot in the direction it is moving in, similar to the player

      this.setSprite('run');
      this.hasAttacked = false;
    } else {
      this.setSprite('idle'); //handles what mode the sprite should be set to
    }


    if (
      verticalDistance < -60 &&
      verticalDistance > -250 &&
      horizontalDistance < 150 &&
      this.onGround//sets out the conditions under which the bot should jump to reach the player
    ) {
      this.vy = this.jumpStrength;
      this.onGround = false;//if the above conditions are met, jump
    }

    this.handleAttack(player);

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;//movement for the bot

    this.vx *= 0.9;//knockback friction

    this.handleCollisions();

    // keeps the bot within the bounds of the playable area
    const game = document.getElementById('game');
    const maxX = game.offsetWidth - this.width;

    if (this.x < 0) this.x = 0;
    if (this.x > maxX) this.x = maxX;


    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';//applies bot postion to the bot DOM
  }

  handleAttack(player) {//function colled upon to handle how and when the bot should attack the player
    const distance = player.x - this.x;

    if (
      Math.abs(distance) <= this.attackRange &&
      !this.attacking &&
      !this.attackCooldown &&
      !this.hasAttacked//lays out the condition under which the bot should make an attack, if the player is in range
    ) {
      this.attacking = true;
      this.hasAttacked = true;
      this.setSprite('attack');//sets the attack booleans to attack aswell as the sprite mode

      
      this.sword.style.transform = this.facingRight
        ? 'scaleX(1) rotate(90deg)'
        : 'scaleX(-1) rotate(-90deg)';//sets the sword flat upon an attack, same as the player

      setTimeout(() => {
        this.sword.style.transform = this.facingRight
          ? 'scaleX(1) rotate(30deg)'
          : 'scaleX(-1) rotate(-30deg)';

        this.attacking = false;
        this.attackCooldown = true;//after a set time, the attack ends and the sword returns to idle

        setTimeout(() => {
          this.attackCooldown = false;
        }, 300);//duration of attack
      }, 150); //attack cooldown
    }

  }

  handleCollisions() {//function called upon to handle the bots collisions with the ground and platforms
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

    const groundLevel = document.getElementById('game').offsetHeight;


    if (this.y + this.height >= groundLevel && !this.onGround) {
      this.y = groundLevel - this.height;
      this.vy = 0;
      this.onGround = true;
    }//collision with platforms and ground determined in the same manner as the player
  }

  respawn(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.health = 100;
    this.vx = 0;
    this.vy = 0;
    this.isKnockedBack = false;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';//respawn function for the bot, same as player
  }
}
