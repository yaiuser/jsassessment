const prompt = require('prompt-sync')({sigint: true});

// Constant Game Elements
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';

// Constants Game Scenarios (Messages)
const WIN = "Congratulations! You win!";                                    /* WIN */
const LOSE = "You lose!";                                                   /* LOSE */
const OUT_BOUND = "You are out of the field.";                              /* OUT OF BOUNDS */
const INTO_HOLE = "You fell into a hole";                                   /* FALLEN INTO HOLE */
const WELCOME = "Welcome to Find Your Hat game";                            /* START OF GAME WELCOME MESSAGE */
const DIRECTION = "Which direction, up(u), down(d), left(l) or right(r)?";  /* KEYBOARD DIRECTIONS */
const QUIT = "Press q or Q to quit the game.";                              /* KEYBOARD TO QUIT THE GAME */
const END_GAME = "Game Ended. Thank you.";                                  /* ENDED THE GAME */
const NOT_RECOGNISED = "Input not recognised.";                             /* INPUT NOT RECOGNISED */

class Field {
  
    // constructor
    constructor(rows, cols, perc){
        this.rows = rows;                           /* property to set up the number of rows for the field */
        this.cols = cols;                           /* property to set up the number of cols for the field */
        this.field = new Array([]);                 /* property that represents the field for game */
        this.gamePlay = false;                      /* property to setup the game play */
        this.perc = perc;                           /* property to set up probability of a hole on the field */
    }

    // methods

    // Welcome Message
    static welcomeMsg(msg){
        console.log(
            "\n**********************************************\n" +
            msg
            + "\n**********************************************\n"
        );
    }

    // !! FOR THE ASSESSMENT
    // TODO RANDOMISE THE FIELD WITH HAT, HOLE AND GRASS
    // TODO THE NUMBER OF HOLES CREATED SHOULD PROVIDE SUFFICIENT CHALLENGE FOR THE GAME (done by setting a suitable percentage > 30%)
    // TODO THE HOLES SHOULD NOT BLOCK THE PLAYER FROM MOVING AT THE START OF THE GAME
    // Generate the game's field
    generateField(){
        for (let i = 0; i < this.rows; i++) {
            /* Generate field rows */
            this.field[i] = new Array();                    
            
            for (let j = 0; j < this.cols; j++) {           
                /* Generate field cols */
                if((i < 2 && j <2) || this.perc < Math.random()){ /* Allow player to move at the start of the game or check if grass should be set up based on probability */
                    this.field[i][j] = GRASS;                   
                } else{
                    this.field[i][j] = HOLE;
                }
            }
        }

        /* Setting up the hat position */

        let x = 0;
        let y = 0;
        while(this.field[x][y] === HOLE || (x < 2 && y < 2)){ /* Ensuring that the position is currently available for the hat  but not too close to starting*/
            x = Math.round(Math.random()*(this.rows -1));
            y = Math.round(Math.random()*(this.cols -1));
        }

        this.field[x][y] = HAT;  /* Hat position set */

     } 

    // Print out the game field
    printField(){
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    }

    // Start game
    startGame(){                                                    /* Start the game */
        this.gamePlay = true;
        this.generateField(this.rows, this.cols, this.perc);                   /* Generate the field first */
        this.field[0][0] = PLAYER;                                  /* Set the start position of the character */        
        this.printField();                                          /* Print the field once */
        this.updateGame();                                          /* Update the game once */
    }

    // Update game
    updateGame(){                                                   /* Update the game */

        // Obtain user input
        let userInput = "";
        
        let userPosition = [0,0];                                   /* array that contains user position in real time */

        // Get the user's direction
        do {
            console.log(DIRECTION.concat(" ", QUIT));               /* Request for the user's input */
            userInput = prompt();                                   /* Get the user's input */
            
            switch (userInput.toLowerCase()) {                      /* Update the position of the player */
                case "u":
                case "d":
                case "l":
                case "r":
                    this.updatePlayer(userInput.toLowerCase(), userPosition);     /* user has pressed "u", "d", "l", "r" */
                    break;
                case 'q':
                    this.endGame();                                 /* user has quit the game */
                    break;
                default:
                    console.log(NOT_RECOGNISED);                    /* input not recognised */
                    break;
            }            
            
            this.printField();                                      /* Print field */
            
        } while (userInput.toLowerCase() !== "q");                  /* Continue to loop if the player hasn't quit */
    }

    // End game
    endGame(){
        console.log(END_GAME);                                      /* Inform the user the game has ended */
        this.gamePlay = false;                                      /* set gamePlay to false */
        process.exit();                                             /* Quit the program */
    }

    // Update the player's movement and game condition
    updatePlayer(position, currentPosition){
        
        // !! FOR THE ASSESSMENT
        // TODO FIRST update the player's position in the field

        switch (position) {                      /* Update the position of the player */
            case "u":
                currentPosition[0] -= 1;
                break;
            case "d":
                currentPosition[0] += 1;
                break;
            case "l":
                currentPosition[1] -=1;
                break
            case "r":
                currentPosition[1] += 1;
                break;
        }

        // TODO THEN check if the player has gotten out of bounds - if yes (LOSE) and endGame()
        if(currentPosition[0] < 0 || currentPosition[0] >= this.rows || currentPosition[1] < 0 || currentPosition[1] >= this.cols ){
            console.log(OUT_BOUND);
            console.log(LOSE);
            this.endGame();
        }

        // TODO THEN check if the player has fallen into hole - if yes (LOSE) and endGame()
        if(this.field[currentPosition[0]][currentPosition[1]] === HOLE){
            console.log(INTO_HOLE);
            console.log(LOSE);
            this.endGame();
        }

        // TODO THEN check if the player has found the hat - if yes (WIN) and endGame()
        if(this.field[currentPosition[0]][currentPosition[1]] === HAT){
            console.log(WIN);
            this.endGame();
        }

        // TODO put the player position on the field if he has stepped onto GRASS
        this.field[currentPosition[0]][currentPosition[1]] = PLAYER;
    }
}

// Static method to welcome the player
Field.welcomeMsg(WELCOME);

const ROWS = 10;                                                    /* number of row */
const COLS = 10;                                                    /* number of columns */
const PERC = 0.3;                                                   /* probability of a hole forming */
const field = new Field(ROWS, COLS, PERC);                          /* Declaring and creating an instance of Field class */
field.startGame();                                                  /* Start the game */