let gameOver = false;
let playerDeaths = 0;
let botDeaths = 0;

const player = new Player(100, 300);
const bot = new Bot(600, 300);

const knockbackForce = 5;

function update() {
  if (gameOver) return;

  player.update();
  bot.update(player);

  checkPlayerAttack();
  checkBotAttack();
}

function checkPlayerAttack() {
  if (player.attacking && !bot.isDead) {
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
      bot.isDead = true;
      console.log("Bot defeated! Incrementing deaths...");
      botDeaths++;
      console.log("Bot deaths is now", botDeaths);

      if (botDeaths >= 3) {
        gameOver = true;
        document.getElementById('message').innerText = 'Player Wins!';
        document.getElementById('message').style.display = 'block';
      } else {
        bot.element.style.display = 'none';

        setTimeout(() => {
          bot.element.style.display = 'block';
          bot.respawn(600, 300);
          document.getElementById('bot-health').innerText = 'Bot Health: ' + bot.health;
          bot.isDead = false;
        }, 2000);

        document.getElementById('message').innerText = 'Bot Defeated!';
        document.getElementById('message').style.display = 'block';

        setTimeout(() => {
          document.getElementById('message').style.display = 'none';
        }, 2000);
      }
      return;
    }
  }
}

function checkBotAttack() {
  if (bot.attacking && !player.isDead) {
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

      if (bot.facingRight) {
        player.vx = knockbackForce;
      } else {
        player.vx = -knockbackForce;
      }

      player.isKnockedBack = true;

      document.getElementById('player-health').innerText = 'Player Health: ' + player.health;
    }

    if (player.health <= 0) {
      player.isDead = true;
      console.log('Player defeated!');
      playerDeaths++;

      if (playerDeaths >= 3) {
        gameOver = true;
        document.getElementById('message').innerText = 'Bot Wins!';
        document.getElementById('message').style.display = 'block';
      } else {
        player.element.style.display = 'none';

        setTimeout(() => {
          player.element.style.display = 'block';
          player.respawn(100, 300);
          document.getElementById('player-health').innerText = 'Player Health: ' + player.health;
          player.isDead = false;
        }, 2000);

        document.getElementById('message').innerText = 'Player Defeated!';
        document.getElementById('message').style.display = 'block';

        setTimeout(() => {
          document.getElementById('message').style.display = 'none';
        }, 2000);
      }
      return;
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'r' && gameOver) {
    player.respawn(100, 300);
    bot.respawn(600, 300);
    playerDeaths = 0;
    botDeaths = 0;
    player.isDead = false;
    bot.isDead = false;
    document.getElementById('message').style.display = 'none';
    document.getElementById('player-health').innerText = 'Player Health: ' + player.health;
    document.getElementById('bot-health').innerText = 'Bot Health: ' + bot.health;
    gameOver = false;
  }
});

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
