
/* =====================================================
   KNIGHT LOCK
   REBUILT SCRIPT - PART 1
   CORE ENGINE + BOARD SYSTEM
===================================================== */

/* =====================================================
   CONSTANTS
===================================================== */

const BOARD_SIZE = 6;

const KNIGHT_MOVES = [

    [2,1],
    [2,-1],

    [-2,1],
    [-2,-1],

    [1,2],
    [1,-2],

    [-1,2],
    [-1,-2]
];

/* =====================================================
   DOM REFERENCES
===================================================== */

const board =
document.getElementById("board");

const moveList =
document.getElementById("moveList") || null;

const turnIndicator =
document.getElementById("turnIndicator");

const turnText =
turnIndicator.querySelector("span");

const winnerText =
document.getElementById("winnerText");

const modeLabel =
document.getElementById("modeLabel");

const difficultyLabel =
document.getElementById("difficultyLabel");

const player2Label =
document.getElementById("player2Label");

const difficultyHomeBtn =
document.getElementById(
"difficultyHomeBtn"
);

/* =====================================================
   AUDIO
===================================================== */

const introMusic =
document.getElementById("introMusic");

const gameplayMusic =
document.getElementById("gameplayMusic");

const buttonSound =
document.getElementById("buttonSound");

const jumpSound =
document.getElementById("jumpSound");

const blockSound =
document.getElementById("blockSound");

const winSound =
document.getElementById("winSound");

/* =====================================================
   GAME STATE
===================================================== */

const gameState = {

    mode : "twoPlayer",

    difficulty : "easy",

    botEnabled : false,

    currentPlayer : "blue",

    gameOver : false,

    moveCount : 1,

    musicEnabled : true,

    blue : {

        row : 0,
        col : 0
    },

    red : {

        row : 5,
        col : 5
    },

    blocked : []
};

/* =====================================================
   AUDIO MANAGER
===================================================== */

function playSound(audio){

    if(!gameState.musicEnabled)
    return;

    if(!audio)
    return;

    audio.currentTime = 0;

    audio.play()
    .catch(()=>{});
}

function stopAllMusic(){

    introMusic.pause();
    gameplayMusic.pause();

    introMusic.currentTime = 0;
    gameplayMusic.currentTime = 0;
}

function startGameplayMusic(){

    if(!gameState.musicEnabled)
    return;

    gameplayMusic.volume = 0.25;

    gameplayMusic.loop = true;

    gameplayMusic.play()
    .catch(()=>{});
}

/* =====================================================
   BOARD CREATION
===================================================== */

function createBoard(){

    board.innerHTML = "";

    for(
        let row = 0;
        row < BOARD_SIZE;
        row++
    ){

        for(
            let col = 0;
            col < BOARD_SIZE;
            col++
        ){

            const cell =
            document.createElement(
            "div"
            );

            cell.classList.add(
            "cell"
            );

            cell.dataset.row =
            row;

            cell.dataset.col =
            col;

            cell.addEventListener(
            "click",
            onCellClick
            );

            board.appendChild(
            cell
            );
        }
    }
}

/* =====================================================
   HELPERS
===================================================== */

function getCell(row,col){

    return document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
    );
}

function currentPosition(){

    return gameState.currentPlayer
    === "blue"

    ?

    gameState.blue

    :

    gameState.red;
}

function opponentPosition(){

    return gameState.currentPlayer
    === "blue"

    ?

    gameState.red

    :

    gameState.blue;
}

function isBlocked(row,col){

    return gameState.blocked.some(

        block =>

        block.row === row &&
        block.col === col

    );
}

/* =====================================================
   VALID MOVES
===================================================== */

function getValidMoves(position){

    const moves = [];

    const opponent =
    opponentPosition();

    KNIGHT_MOVES.forEach(move=>{

        const nr =
        position.row + move[0];

        const nc =
        position.col + move[1];

        if(

            nr >= 0 &&
            nr < BOARD_SIZE &&

            nc >= 0 &&
            nc < BOARD_SIZE

        ){

            if(

                !isBlocked(
                nr,
                nc
                )

            ){

                if(

                    !(

                    opponent.row===nr &&
                    opponent.col===nc

                    )

                ){

                    moves.push({

                        row:nr,
                        col:nc
                    });
                }
            }
        }
    });

    return moves;
}

/* =====================================================
   MOVE HISTORY
===================================================== */

function addMoveHistory(text){

    return;

}
/* =====================================================
   BOARD RENDERER
===================================================== */

function renderBoard(){

    document
    .querySelectorAll(".cell")
    .forEach(cell=>{

        cell.className =
        "cell";

        cell.innerHTML =
        "";
    });

    gameState.blocked
    .forEach(block=>{

        const cell =
        getCell(
        block.row,
        block.col
        );

        if(!cell) return;

        if(
        block.owner ===
        "blue"
        ){

            cell.classList.add(
            "block-blue"
            );

        }else{

            cell.classList.add(
            "block-red"
            );
        }
    });

    const blueCell =
    getCell(
    gameState.blue.row,
    gameState.blue.col
    );

    const redCell =
    getCell(
    gameState.red.row,
    gameState.red.col
    );

    if(blueCell){

        blueCell.innerHTML =
        "♘";

        blueCell.classList.add(
        "blue-player"
        );
    }

    if(redCell){

        redCell.innerHTML =
        "♞";

        redCell.classList.add(
        "red-player"
        );
    }

    if(
    gameState.currentPlayer
    === "blue"
    ){

        blueCell?.classList.add(
        "active"
        );

        turnIndicator.style.background =
        "#DDEBFF";

        turnText.textContent =
        "Player 1";

    }else{

        redCell?.classList.add(
        "active"
        );

        turnIndicator.style.background =
        "#FFE3DD";

        turnText.textContent =

        gameState.botEnabled

        ?

        "BOT"

        :

        "Player 2";
    }
}

/* =====================================================
   REBUILT SCRIPT - PART 2
   GAMEPLAY ENGINE + BOT AI
===================================================== */

/* =====================================================
   PLAYER MOVE
===================================================== */

function executeMove(row,col){

    if(gameState.gameOver)
    return;

    const currentPos =
    currentPosition();

    playSound(
    jumpSound
    );

    gameState.blocked.push({

        row :
        currentPos.row,

        col :
        currentPos.col,

        owner :
        gameState.currentPlayer
    });

    setTimeout(()=>{

            playSound(
        jumpSound
        );



    },120);

    if(
    gameState.currentPlayer
    === "blue"
    ){

        gameState.blue = {

            row,
            col
        };

        addMoveHistory(

        `${gameState.moveCount}.
        Player 1 →
        (${row+1},
        ${col+1})`

        );

        gameState.currentPlayer =
        "red";

    }else{

        gameState.red = {

            row,
            col
        };

        addMoveHistory(

        `${gameState.moveCount}.
        ${
        gameState.botEnabled
        ? "BOT"
        : "Player 2"
        }
        →
        (${row+1},
        ${col+1})`

        );

        gameState.currentPlayer =
        "blue";
    }

    gameState.moveCount++;

    renderBoard();
}

/* =====================================================
   CELL CLICK
===================================================== */

function onCellClick(){

    if(
    gameState.gameOver
    )
    return;

    if(

    gameState.botEnabled &&

    gameState.currentPlayer
    === "red"

    )
    return;

    const row =
    parseInt(
    this.dataset.row
    );

    const col =
    parseInt(
    this.dataset.col
    );

    const validMoves =
    getValidMoves(
    currentPosition()
    );

    const legalMove =
    validMoves.some(move=>

        move.row===row &&
        move.col===col
    );

    if(!legalMove)
    return;

    executeMove(
    row,
    col
    );

    checkWinner();

    if(

    gameState.botEnabled &&

    !gameState.gameOver &&

    gameState.currentPlayer
    === "red"

    ){

        setTimeout(()=>{

            botTurn();

        },700);
    }
}

/* =====================================================
   WINNER CHECK
===================================================== */


function checkWinner(){

    const availableMoves =
    getValidMoves(
    currentPosition()
    );

    if(
    availableMoves.length === 0
    ){

        gameState.gameOver =
        true;

        playSound(
        blockSound
        );

        setTimeout(()=>{

            showWinner();

        },500);

        return true;
    }

    return false;
}



/* =====================================================
   EASY BOT
===================================================== */

function easyBot(moves){

    return moves[
    Math.floor(

    Math.random() *
    moves.length

    )];
}

/* =====================================================
   POSITION SCORE
===================================================== */

function scorePosition(move){

    let score = 0;

    KNIGHT_MOVES.forEach(offset=>{

        const nr =
        move.row +
        offset[0];

        const nc =
        move.col +
        offset[1];

        if(

            nr>=0 &&
            nr<BOARD_SIZE &&

            nc>=0 &&
            nc<BOARD_SIZE &&

            !isBlocked(
            nr,
            nc
            )

        ){

            score++;
        }
    });

    return score;
}

/* =====================================================
   BEST MOVE
===================================================== */

function bestMove(moves){

    let best =
    moves[0];

    let highest =
    -1;

    moves.forEach(move=>{

        const score =
        scorePosition(
        move
        );

        if(
        score >
        highest
        ){

            highest =
            score;

            best =
            move;
        }

    });

    return best;
}

/* =====================================================
   MEDIUM BOT
===================================================== */

function mediumBot(moves){

    const smartMove =
    Math.random() < 0.5;

    if(smartMove){

        return bestMove(
        moves
        );
    }

    return easyBot(
    moves
    );
}

/* =====================================================
   HARD BOT
===================================================== */

function hardBot(moves){

    return bestMove(
    moves
    );
}

/* =====================================================
   BOT DECISION
===================================================== */

function chooseBotMove(moves){

    switch(
    gameState.difficulty
    ){

        case "easy":

            return easyBot(
            moves
            );

        case "medium":

            return mediumBot(
            moves
            );

        case "hard":

            return hardBot(
            moves
            );

        default:

            return easyBot(
            moves
            );
    }
}

/* =====================================================
   BOT TURN
===================================================== */

function botTurn(){

    if(
    gameState.gameOver
    )
    return;

    const moves =
    getValidMoves(
    gameState.red
    );

    if(
    moves.length===0
    ){

        checkWinner();

        return;
    }

    const move =
    chooseBotMove(
    moves
    );

    executeMove(

        move.row,

        move.col

    );

    checkWinner();
}

/* =====================================================
   WINNER SCREEN
===================================================== */

function showWinner(){

    const winner =

    gameState.currentPlayer
    === "blue"

    ?

    (
    gameState.botEnabled

    ?

    "BOT"

    :

    "Player 2"
    )

    :

    "Player 1";

    winnerText.textContent =
    `${winner} Wins!`;

    winnerText.style.color =

    winner==="Player 1"

    ?

    "#2D7FF9"

    :

    "#E74C3C";

    if(
    gameState.musicEnabled
    ){

        winSound.loop =
        false;

        winSound.currentTime =
        0;

        winSound.play()
        .catch(()=>{});
    }

    document
    .getElementById(
    "winScreen"
    )
    .style.display =
    "flex";
}

/* =====================================================
   REBUILT SCRIPT - PART 3
   UI + AUDIO + INITIALIZATION
===================================================== */

/* =====================================================
   DOM REFERENCES
===================================================== */

const onePlayerBtn =
document.getElementById(
"onePlayerBtn"
);

const twoPlayerBtn =
document.getElementById(
"twoPlayerBtn"
);

const rulesBtn =
document.getElementById(
"rulesBtn"
);

const closeRules =
document.getElementById(
"closeRules"
);

const restartBtn =
document.getElementById(
"restartBtn"
);

const homeBtn =
document.getElementById(
"homeBtn"
);

const playAgain =
document.getElementById(
"playAgain"
);

const backHome =
document.getElementById(
"backHome"
);

const musicBtn =
document.getElementById(
"musicBtn"
);

const difficultyButtons =
document.querySelectorAll(
".difficultyBtn"
);

const homeScreen =
document.getElementById(
"homeScreen"
);

const difficultyScreen =
document.getElementById(
"difficultyScreen"
);

const rulesScreen =
document.getElementById(
"rulesScreen"
);

const winScreen =
document.getElementById(
"winScreen"
);

difficultyHomeBtn.addEventListener(
"click",
()=>{

    difficultyScreen.style.display =
    "none";

    homeScreen.style.display =
    "flex";
});

/* =====================================================
   START GAME
===================================================== */


function startGame(){

    homeScreen.style.display =
    "none";

    difficultyScreen.style.display =
    "none";

    rulesScreen.style.display =
    "none";

    winScreen.style.display =
    "none";

    document.getElementById(
    "gameScreen"
    ).style.display =
    "flex";

    stopAllMusic();

    startGameplayMusic();

    renderBoard();
}



/* =====================================================
   RESET GAME
===================================================== */


function resetGame(){

    gameState.gameOver = false;

    gameState.moveCount = 1;

    gameState.currentPlayer = "blue";

    gameState.blue = {
        row:0,
        col:0
    };

    gameState.red = {
        row:5,
        col:5
    };

    gameState.blocked = [];

    renderBoard();
}

// Return to home

function returnToHome(){

    resetGame();

    stopAllMusic();

    gameplayMusic.pause();
    gameplayMusic.currentTime = 0;

    winSound.pause();
    winSound.currentTime = 0;

    winScreen.style.display = "none";

    difficultyScreen.style.display = "none";

    document.getElementById(
        "gameScreen"
    ).style.display = "none";

    homeScreen.style.display = "flex";
}


backHome.addEventListener(
"click",
()=>{

    returnToHome();
});



/* =====================================================
   MUSIC TOGGLE
===================================================== */

function toggleMusic(){

    gameState.musicEnabled =
    !gameState.musicEnabled;

    if(
    gameState.musicEnabled
    ){

        musicBtn.textContent =
        "🔊 Music";

        if(
        homeScreen.style.display
        !== "none"
        ){

            introMusic.play()
            .catch(()=>{});

        }else{

            gameplayMusic.play()
            .catch(()=>{});
        }

    }else{

        musicBtn.textContent =
        "🔇 Muted";

        introMusic.pause();

        gameplayMusic.pause();

        winSound.pause();
    }
}

/* =====================================================
   SINGLE PLAYER
===================================================== */

onePlayerBtn.addEventListener(
"click",
()=>{

    playSound(
    buttonSound
    );

    gameState.mode =
    "single";

    gameState.botEnabled =
    true;

    modeLabel.textContent =
    "1 Player";

    player2Label.textContent =
    "BOT";

    difficultyScreen.style.display =
    "flex";
});

/* =====================================================
   TWO PLAYER
===================================================== */

twoPlayerBtn.addEventListener(
"click",
()=>{

    playSound(
    buttonSound
    );

    gameState.mode =
    "twoPlayer";

    gameState.botEnabled =
    false;

    modeLabel.textContent =
    "2 Player";

    difficultyLabel.textContent =
    "-";

    player2Label.textContent =
    "Player 2";
    

    startGame();
});

/* =====================================================
   DIFFICULTY
===================================================== */

difficultyButtons.forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        playSound(
        buttonSound
        );

        gameState.difficulty =
        button.dataset.level;

        difficultyLabel.textContent =

        button.dataset.level
        .charAt(0)
        .toUpperCase()

        +

        button.dataset.level
        .slice(1);

        startGame();
    });
});

/* =====================================================
   RULES
===================================================== */

rulesBtn.addEventListener(
"click",
()=>{

    playSound(
    buttonSound
    );

    rulesScreen.style.display =
    "flex";
});

closeRules.addEventListener(
"click",
()=>{

    playSound(
    buttonSound
    );

    rulesScreen.style.display =
    "none";
});

/* =====================================================
   RESTART
===================================================== */

restartBtn.addEventListener(
"click",
()=>{

    playSound(
    buttonSound
    );

    resetGame();
});


playAgain.addEventListener(
"click",
()=>{

    resetGame();

    winScreen.style.display = "none";

    document.getElementById(
        "gameScreen"
    ).style.display = "flex";

    startGameplayMusic();
});



/* =====================================================
   HOME
===================================================== */


homeBtn.addEventListener(
"click",
()=>{

    resetGame();

    stopAllMusic();

    gameplayMusic.pause();

    gameplayMusic.currentTime = 0;

    winSound.pause();

    winSound.currentTime = 0;

    document.getElementById(
    "gameScreen"
    ).style.display =
    "none";

    winScreen.style.display =
    "none";

    difficultyScreen.style.display =
    "none";

    homeScreen.style.display =
    "flex";
});



/* =====================================================
   MUSIC BUTTON
===================================================== */

musicBtn.addEventListener(
"click",
()=>{

    toggleMusic();
});

/* =====================================================
   INTRO MUSIC
===================================================== */

function startIntroMusic(){

    if(
    !gameState.musicEnabled
    )
    return;

    introMusic.volume =
    0.35;

    introMusic.loop =
    true;

    introMusic.play()
    .catch(()=>{});
}

/* =====================================================
   INITIALIZE
===================================================== */

function initializeGame(){

    createBoard();

    renderBoard();

    startIntroMusic();
}

/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
"DOMContentLoaded",
()=>{

    initializeGame();
});
