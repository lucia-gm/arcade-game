/*
 * Game object
 */
const game = {
    audio: {},
    ui: {}
}

// Audio resources
game.audio.move = new Audio('sounds/move.wav');
game.audio.moveUp = new Audio('sounds/moveup.wav');
game.audio.moveDown = new Audio('sounds/movedown.wav');
game.audio.die = new Audio('sounds/die.mp3');
game.audio.win = new Audio('sounds/win.mp3');
game.audio.lose = new Audio('sounds/lose.mp3');
game.audio.reset = new Audio('sounds/reset.wav');

// DOM selectors
game.ui.winModal = document.querySelector('#winModal');
game.ui.modalText = document.querySelector('.modal-message');
game.ui.close = document.querySelector('.close');
game.ui.play = document.querySelectorAll('.play-button');
game.ui.lives = document.querySelectorAll('.fa-heart');
game.ui.restart = document.querySelector('.fa-repeat');
game.ui.startModal = document.querySelector('#startModal');
game.ui.playerSprite = document.querySelector('input[name=player-name]:checked').value;

// Logical variables
// Based on the measures of the board's cells per the engine.js files
// This will be used to update the player's position
game.cellWidth = 101;
game.cellHeight = 83;
game.playerInitialX = game.cellWidth * 2; // To start on 3rd column
game.playerInitialY = (606 / 6) * 4; // To start on 4th row, 606 is canvas height and there are 6 rows
game.enemyPositionY = [72, 155, 238] // The enemies can only go through rock cells

// Hide the modal and reset the player
game.reset = function() {
    player.resetPosition();
    player.numberOfLives = 3;
    allEnemies = [];
    generateEnemies();
    game.audio.reset.play();
    game.ui.winModal.classList.add('hidden');
    game.ui.lives.forEach(function(life) {
        life.classList.remove('fa-heart-o');
        life.classList.add('fa-heart');
    });
}



/*
 * Generic functions
 */

const utils = {};

// Return a random integer between the specified values
// This will be used to get random speed and start X position for the enemies
utils.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// To return a random item from an array
// This will be used to get a random start Y position for the enemies
utils.getRandomIndex = function(array) {
    return array[Math.floor(Math.random() * array.length)];
}



/*
 * Classes
 */

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = game.cellWidth;
        this.height = game.cellHeight;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // To ensure the game runs at the same speed for all computers
        this.x += this.speed * dt;
        // If enemies go off the screen, start again
        if(this.x > 800) {
            this.x = -100;
        }
    }

    // Draw the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


class Player {
    constructor(sprite) {
        this.x = game.playerInitialX;
        this.y = game.playerInitialY;
        this.numberOfLives = 3;
        this.width = game.cellWidth;
        this.height = game.cellHeight;
        this.sprite = 'images/' + sprite;
    }

    resetPosition() {
        this.x = game.playerInitialX;
        this.y = game.playerInitialY;
    }

    // Check if the player wins or loses
    update() {
        if(this.y < 0 && game.ui.winModal.classList.contains('hidden')) {
            game.ui.winModal.classList.remove('hidden');
            game.ui.modalText.innerHTML = `Congratulations!<span class="modal-span">You made it!</span>`;
            game.audio.win.play();
            allEnemies = [];
        } else if (player.numberOfLives < 3) {
            game.ui.lives[2].classList.remove('fa-heart');
            game.ui.lives[2].classList.add('fa-heart-o');
            if (player.numberOfLives < 2) {
                game.ui.lives[1].classList.remove('fa-heart');
                game.ui.lives[1].classList.add('fa-heart-o');
                if (player.numberOfLives < 1 && game.ui.winModal.classList.contains('hidden')) {
                    game.ui.lives[0].classList.remove('fa-heart');
                    game.ui.lives[0].classList.add('fa-heart-o');
                    game.ui.winModal.classList.remove('hidden');
                    game.ui.modalText.innerHTML = `Game Over  :(<span class="modal-span">Sorry, you don't have more lives</span>`;
                    game.audio.lose.play();
                    allEnemies = [];
                }
            }
        }
    }

    //Draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update the player's position
    handleInput(keyCode) {
        switch (keyCode) {
            case 'left':
                if(this.x > 0) { // The player cannot move off screen when he's on the 1st column
                    this.x -= game.cellWidth;
                    game.audio.move.play();
                }
                break;
            case 'up':
                if(this.y > 0) { // The player cannot move off screen when he's on the 1st row
                    this.y -= game.cellHeight;
                    game.audio.moveUp.play();
                }
                break;
            case 'right':
                if(this.x < game.cellWidth * 4) { // The player cannot move off screen when he's on the last column
                    this.x += game.cellWidth;
                    game.audio.move.play();
                }
                break;
            case 'down':
                if(this.y < game.playerInitialY) {// The player cannot move off screen from the bottom when he's on the last row
                    this.y += game.cellHeight;
                    game.audio.moveDown.play();
                }
                break;
          }
    }
}



/*
 * Instantiate the objects
 */

const player = new Player(game.ui.playerSprite);

let allEnemies = [];

// Generate 6 enemies
function generateEnemies() {
    for (let i = 0; i < 6; i++) {
        allEnemies.push(new Enemy(utils.getRandomInt(-900,-100), utils.getRandomIndex(game.enemyPositionY), utils.getRandomInt(70,300)));
    }
}


/*
 * Event listeners
 */

game.ui.startModal.addEventListener('submit', function(e) {
    game.ui.playerSprite = document.querySelector('input[name=player-name]:checked').value;
    player.sprite = 'images/' + game.ui.playerSprite;
    game.ui.startModal.classList.add('hidden');
    generateEnemies();

    e.preventDefault();
 }, false);

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

// This listens if the user clicks the restart button and resets the game
game.ui.restart.addEventListener('click', game.reset);

// This listens if the user clicks <span> (x) and close the modal
game.ui.close.addEventListener('click', game.reset);

// This listens if the user clicks anywhere outside of the modal and close it
window.addEventListener('click', function(event) {
    if (event.target == game.ui.winModal) {
        game.reset();
    }
});

// This listens if the user clicks on play again and restart the game
game.ui.play[1].addEventListener('click', game.reset);
