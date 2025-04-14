const player = new Player(100, 300);
const bot = new Bot(600, 300);

const knockbackForce = 5;


function update() {
  player.update();
  bot.update(player);

  checkPlayerAttack();
  checkBotAttack();
}

function checkPlayerAttack() {
  if (player.attacking) {
    const playerBox = player.element.getBoundingClientRect();
    const botBox = bot.element.getBoundingClientRect();

    if (
      playerBox.right >= botBox.left &&
      playerBox.left <= botBox.right &&
      playerBox.bottom >= botBox.top &&
      playerBox.top <= botBox.bottom
    ) {
      console.log('Bot hit!');
      bot.health -= 1;

      if (player.facingRight) {
        bot.vx = knockbackForce;
      } else {
        bot.vx = -knockbackForce;
      }

      document.getElementById('bot-health').innerText = 'Bot Health: ' + bot.health;
    }
    if (bot.health <= 0) {
      console.log('Bot defeated!');

      // Optional: Hide bot temporarily
      bot.element.style.display = 'none';

      setTimeout(() => {
        bot.element.style.display = 'block';
        bot.respawn(600, 300); // Respawn at starting position
        document.getElementById('bot-health').innerText = 'Bot Health: ' + bot.health;
      }, 2000); // 2 second respawn delay

      document.getElementById('message').innerText = 'Bot Defeated!';
      document.getElementById('message').style.display = 'block';

      setTimeout(() => {
        document.getElementById('message').style.display = 'none';
      }, 2000);

    }
  }
}

function checkBotAttack() {
  if (bot.attacking) {
    const playerBox = player.element.getBoundingClientRect();
    const botBox = bot.element.getBoundingClientRect();

    if (
      botBox.right >= playerBox.left &&
      botBox.left <= playerBox.right &&
      botBox.bottom >= playerBox.top &&
      botBox.top <= playerBox.bottom
    ) {
      console.log('Player hit!');
      player.health -= 1;

      // Apply knockback to player
      if (bot.facingRight) {
        player.vx = knockbackForce;
      } else {
        player.vx = -knockbackForce;
      }

      player.isKnockedBack = true;

      document.getElementById('player-health').innerText = 'Player Health: ' + player.health;
    }
    if (player.health <= 0) {
      console.log('Player defeated!');
      player.element.style.display = 'none';

      setTimeout(() => {
        player.element.style.display = 'block';
        player.respawn(100, 300); // Respawn player
        document.getElementById('player-health').innerText = 'Player Health: ' + player.health;
      }, 2000);

      document.getElementById('message').innerText = 'Player Defeated!';
      document.getElementById('message').style.display = 'block';

      setTimeout(() => {
        document.getElementById('message').style.display = 'none';
      }, 2000);
    }
  }
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
