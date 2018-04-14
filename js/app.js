// Enemies our player must avoid
var Enemy = function(x, y, speed, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
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
    this.sprite = 'images/char-horn-girl.png';
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {

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
let enemyPositionY = [63, 146, 229] // The enemies can only go through rock cells.

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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
