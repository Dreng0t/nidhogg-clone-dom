document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  gameLoop(); // Start the game loop after hiding the screen
});

const playerVictoryImages = [
  'assets/blueManDisarmsRed.png',
  'assets/BlueManHitsRedMan.png'
];

const botVictoryImages = [
  'assets/redManDisarmsBlue.png',
  'assets/RedManHitsBlueMan.png'
];//arrays containing the various images to be displayed if either the bot or the player wins a round

let gameOver = false;
let playerDeaths = 0;
let botDeaths = 0;//sets the default values for the start of the game

const player = new Player(100, 300);
const bot = new Bot(600, 300);//spanws the player and bot at their start positions

const knockbackForce = 5;//sets out knockback force

function update() {
  if (gameOver) return;

  player.update();
  bot.update(player);

  checkPlayerAttack();
  checkBotAttack();//update loop for the game, calls up on the update functions for the bot and player
}                // aswell as the functions checking for hit registration

function checkPlayerAttack() {//function detemining if the player has landed an attack
  if (player.attacking && !bot.isDead) {//active if the player attacks and the bot is not already dead
    const swordBox = player.sword.getBoundingClientRect();
    const botBox = bot.element.getBoundingClientRect();//ascertains the bounds of bot and the players sword

    if (
      swordBox.right >= botBox.left &&
      swordBox.left <= botBox.right &&
      swordBox.bottom >= botBox.top &&
      swordBox.top <= botBox.bottom//lays out the conditions under which a hit is scored, if the player sword and the bot overlap
    ) {
      console.log('Bot hit!');
      bot.health = Math.max(bot.health - 1, 0);
      //if they do overlap then the effect of a landed hit kick in, startin with reducing the bots health
      document.getElementById('player-health-bar').style.width = player.health + '%';
      document.getElementById('bot-health-bar').style.width = bot.health + '%';//player and bot health displayed through bars which deplete as they lose health
      //these lines update the length of the health bars dependent on the health of the player and bot, invoked anytime either takes damage

      if (player.facingRight) {
        bot.vx = knockbackForce;
      } else {
        bot.vx = -knockbackForce;//applies knockback if a hit is landed, direction determined by where the player is facing
      }


    }

    if (bot.health <= 0) {//logic determing what happens when the bot is killed, health reduced below 0
      bot.isDead = true;//set death bool to true
      console.log("Bot defeated! Incrementing deaths...");
      botDeaths++;//increment bot deaths count
      console.log("Bot deaths is now", botDeaths);
      showDeathImage(playerVictoryImages); // calls the image to display victory images with the player's selection


      if (botDeaths >= 3) {
        gameOver = true;//if bot surpasses 3 deaths then round over and display player victory message
        document.getElementById('message').innerText = 'Player Wins!';
        document.getElementById('message').style.display = 'block';
      } else {
        bot.element.style.display = 'none';

        setTimeout(() => {//if not then dissapear the bot and respawn it after 2 seconds
          bot.element.style.display = 'block';
          player.element.style.display = 'block';
          bot.respawn(600, 300);
          player.respawn(100, 300);
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

function checkBotAttack() {//function handling the bots attacks, works just like the players
  if (bot.attacking && !player.isDead) {
    const swordBox = bot.sword.getBoundingClientRect();
    const playerBox = player.element.getBoundingClientRect();

    if (
      swordBox.right >= playerBox.left &&
      swordBox.left <= playerBox.right &&
      swordBox.bottom >= playerBox.top &&
      swordBox.top <= playerBox.bottom
    ) {
      console.log('Player hit!');
      player.health = Math.max(player.health - 1, 0);


      if (bot.facingRight) {
        player.vx = knockbackForce;
      } else {
        player.vx = -knockbackForce;
      }

      player.isKnockedBack = true;


    }

    if (player.health <= 0) {
      player.isDead = true;
      console.log('Player defeated!');
      playerDeaths++;
      showDeathImage(botVictoryImages);//calls show death image function with the bots win images 


      if (playerDeaths >= 3) {
        gameOver = true;
        document.getElementById('message').innerText = 'Bot Wins!';
        document.getElementById('message').style.display = 'block';
      } else {
        player.element.style.display = 'none';

        setTimeout(() => {
          player.element.style.display = 'block';
          bot.element.style.display = 'block';
          bot.respawn(600, 300);
          player.respawn(100, 300);

          document.getElementById('bot-health-bar').style.width = bot.health + '%';
          document.getElementById('player-health-bar').style.width = player.health + '%';

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

function showDeathImage(images) {
  const deathImage = document.getElementById('death-image');//fetches the element where the death image will be displayed
  const randomSrc = images[Math.floor(Math.random() * images.length)];//selects a random elelment from the array of death images
  deathImage.src = randomSrc;//sets the randomly selceted image as the src of detahImage img
  deathImage.style.opacity = 1;

  setTimeout(() => {//begins as fully opaque then fades away over the course of the 2 second respawn time
    deathImage.style.opacity = 0;
  }, 2000);
}//function to display a random one of the images within the array thats passed to it



window.addEventListener('keydown', (e) => {
  if (e.key === 'r' && gameOver) {
    player.respawn(100, 300);
    bot.respawn(600, 300);//event listener to restart the game after a finished round, bound to R
    document.getElementById('bot-health-bar').style.width = bot.health + '%';
    document.getElementById('player-health-bar').style.width = player.health + '%';
    playerDeaths = 0;
    botDeaths = 0;
    player.isDead = false;
    bot.isDead = false;
    document.getElementById('message').style.display = 'none';

    gameOver = false;
  }
});

function gameLoop() {
  update();//gameloop which calls upon the update function every frame, thanks to requestAnimationFrame
  requestAnimationFrame(gameLoop);
}

document.getElementById('start-button').addEventListener('click', () => {
  const screen = document.getElementById('start-screen');
  screen.classList.add('hidden');
  setTimeout(() => {//event listener to handle the start button, when clicked the start screen will fade away and the game loop begins
    screen.style.display = 'none';
    gameLoop();
  }, 500);
});

