const winModal = document.querySelector('#winModal');
const modalText = document.querySelector('.modal-title');
const close = document.querySelector('.close');
const play = document.querySelector('.play-button');
const lives = document.querySelectorAll('.fa-heart');
const restart = document.querySelector('.fa-repeat');


// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = cellWidth;
    this.height = cellHeight;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > 800) {
      this.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, sprite) {
    this.x = 202; // To start on 3rd column, (cellWidth * 2)
    this.y = 404; // To start on 4th row, if canvas height=606 and row=6, (606 / 6 * 4)
    this.numberOflives = 3;
    this.width = cellWidth;
    this.height = cellHeight;
    this.sprite = 'images/char-horn-girl.png';
};

Player.prototype.resetPosition = function(dt) {
    this.x = 202;
    this.y = 404;
};

Player.prototype.update = function(dt) {
    if(this.y < 0) {
        winModal.classList.remove('hidden');
        modalText.innerHTML = `Congratulations!<span class="modal-span">You made it!</span>`;
    } else if (player.numberOflives < 3) {
        lives[2].classList.remove('fa-heart');
        lives[2].classList.add('fa-heart-o');
        if (player.numberOflives < 2) {
            lives[1].classList.remove('fa-heart');
            lives[1].classList.add('fa-heart-o');
            if (player.numberOflives < 1) {
                lives[0].classList.remove('fa-heart');
                lives[0].classList.add('fa-heart-o');
                winModal.classList.remove('hidden');
                modalText.innerHTML = `Game Over  :(<span class="modal-span">Sorry, you don't have more lives</span>`;
            }
        }
    }
};

//Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
      case 'left':
        if(this.x > 0) { // The player cannot move off screen when he's on the 1st column
          this.x -= cellWidth;
        }
        break;
      case 'up':
        if(this.y > 0) { // The player cannot move off screen when he's on the 1st row
          this.y -= cellHeight;
        }
        break;
      case 'right':
        if(this.x < cellWidth * 4) { // The player cannot move off screen when he's on the last column
          this.x += cellWidth;
        }
        break;
      case 'down':
        if(this.y < 404) {// The player cannot move off screen from the bottom when he's on the last row
          this.y += cellHeight;
        }
        break;
    }
}

// Define variables base on the measures of the board's cells per the engine.js files
// This will be used to update the player's position
let cellWidth = 101;
let cellHeight = 83;
let enemyPositionY = [72, 155, 238] // The enemies can only go through rock cells.

// To return a random integer between the specified values
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// To return a random item from an array
function getRandomIndex(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];

for (let i = 0; i < 6; i++) {
  allEnemies.push(new Enemy(getRandomInt(-900,-100), getRandomIndex(enemyPositionY), getRandomInt(70,300)));
}

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// if restart is clicked, reset the game
restart.addEventListener('click', resetGame);

// When the user clicks on <span> (x), close the modal
close.addEventListener('click', resetGame);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
    if (event.target == winModal) {
        resetGame();
    }
});

// When the user click on play again, restart the game
play.addEventListener('click', resetGame);

// To hide the modal
function resetGame() {
    winModal.classList.add('hidden');
    player.resetPosition();
    player.numberOflives = 3;
    lives.forEach(function(life) {
        life.classList.remove('fa-heart-o');
        life.classList.add('fa-heart');
    });
}
