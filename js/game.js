const player = new Player(100, 300);
const bot = new Bot(600, 300);

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
    }
  }
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
