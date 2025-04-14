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
      // Later: Handle death/respawn
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
      // Later: Handle death/respawn
    }
  }
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
