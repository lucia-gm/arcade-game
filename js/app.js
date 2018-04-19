/*
 * Variables
 */

// Resources
const audioMove = new Audio('sounds/move.wav');
const audioMoveUp = new Audio('sounds/moveup.wav');
const audioMoveDown = new Audio('sounds/movedown.wav');
const audioDie = new Audio('sounds/die.mp3');
const audioWin = new Audio('sounds/win.mp3');
const audioLose = new Audio('sounds/lose.mp3');
const audioReset = new Audio('sounds/reset.wav');

// DOM selectors
const winModal = document.querySelector('#winModal');
const modalText = document.querySelector('.modal-message');
const close = document.querySelector('.close');
const play = document.querySelectorAll('.play-button');
const lives = document.querySelectorAll('.fa-heart');
const restart = document.querySelector('.fa-repeat');
const startModal = document.querySelector('#startModal');
let playerSprite = document.querySelector('input[name=player-name]:checked').value;

// Logical variables
// Based on the measures of the board's cells per the engine.js files
// This will be used to update the player's position
const cellWidth = 101;
const cellHeight = 83;
const playerInitialX = 202; // To start on 3rd column, (cellWidth * 2)
const playerInitialY = 404; // To start on 4th row, if canvas height=606 and row=6, (606 / 6 * 4)
let enemyPositionY = [72, 155, 238] // The enemies can only go through rock cells.



/*
 * Functions
 */

// Return a random integer between the specified values
// This will be used to get random speed and start X position for the enemies
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// To return a random item from an array
// This will be used to get a random start Y position for the enemies
function getRandomIndex(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Hide the modal and reset the player
function resetGame() {
    audioReset.play();
    winModal.classList.add('hidden');
    player.resetPosition();
    player.numberOflives = 3;
    lives.forEach(function(life) {
        life.classList.remove('fa-heart-o');
        life.classList.add('fa-heart');
    });
}



/*
 * Classes
 */

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = cellWidth;
        this.height = cellHeight;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // To ensure the game runs at the same speed for all computers
        this.x += this.speed * dt;
        // If enemeies go off the screen, start again
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
        this.x = playerInitialX;
        this.y = playerInitialY;
        this.numberOflives = 3;
        this.width = cellWidth;
        this.height = cellHeight;
        this.sprite = 'images/' + sprite;
    }

    resetPosition() {
        this.x = playerInitialX;
        this.y = playerInitialY;
    }

    // Check if the player wins or loses
    update() {
        if(this.y < 0) {
            winModal.classList.remove('hidden');
            modalText.innerHTML = `Congratulations!<span class="modal-span">You made it!</span>`;
            audioWin.play();
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
                    audioLose.play();
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
                    this.x -= cellWidth;
                    audioMove.play();
                }
                break;
            case 'up':
                if(this.y > 0) { // The player cannot move off screen when he's on the 1st row
                    this.y -= cellHeight;
                    audioMoveUp.play();
                }
                break;
            case 'right':
                if(this.x < cellWidth * 4) { // The player cannot move off screen when he's on the last column
                    this.x += cellWidth;
                    audioMove.play();
                }
                break;
            case 'down':
                if(this.y < playerInitialY) {// The player cannot move off screen from the bottom when he's on the last row
                    this.y += cellHeight;
                    audioMoveDown.play();
                }
                break;
          }
    }
}



/*
 * Instantiate the objects
 */

const player = new Player(playerSprite);

const allEnemies = [];

// Generate 6 enemies
for (let i = 0; i < 6; i++) {
  allEnemies.push(new Enemy(getRandomInt(-900,-100), getRandomIndex(enemyPositionY), getRandomInt(70,300)));
}



/*
 * Event listeners
 */

 startModal.addEventListener('submit', function(e) {
  playerSprite = document.querySelector('input[name=player-name]:checked').value;
  startModal.classList.add('hidden');
  player.sprite = 'images/' + playerSprite;

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
restart.addEventListener('click', resetGame);

// This listens if the user clicks <span> (x) and close the modal
close.addEventListener('click', resetGame);

// This listens if the user clicks anywhere outside of the modal and close it
window.addEventListener('click', function(event) {
    if (event.target == winModal) {
        resetGame();
    }
});

// This listens if the user clicks on play again and restart the game
play[1].addEventListener('click', resetGame);
