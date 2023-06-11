const gameContainer = document.getElementById("game");
let startGame = document.querySelector("#start");
let restartGame = document.querySelector("#restart");
let scoreTracker = document.querySelector("#score");
let bestScore = document.querySelector("#best-score");
let score = 0;
let gameIsActive = false;
const gameScoreSaver = "BestScore";

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);
let divsObjects;
let divsArray;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
    divsObjects = [];
    divsArray = [];
    for (let color of colorArray) {
        // create a new div
        const newDiv = document.createElement("div");

        // give it a class attribute for the value we are looping over
        newDiv.classList.add(color);

        // call a function handleCardClick when a div is clicked on
        newDiv.addEventListener("click", handleCardClick);

        // append the div to the element with an id of game
        gameContainer.append(newDiv);
        let divInfo = {
            div: newDiv,
            index: divsObjects.length,
            color: color,
            isMatched: false
        }
        divsObjects.push(divInfo);
        divsArray.push(newDiv);
    }
}


let selectedCount = 0;
let firstSelection;
let secondSelection;
let timeOut = false;

// TODO: Implement this function!
function handleCardClick(event) {
    if (timeOut){
        return;
    }
    
    score++;
    scoreTracker.innerHTML = `Score: ${score}`;
    // you can use event.target to see which element was clicked
    //console.log("you just clicked", event.target);
    
    let index = divsArray.indexOf(this);
    
    if (firstSelection === undefined){
        this.style.backgroundColor = this.classList[0];
        firstSelection = divsObjects[index];

    }else if (secondSelection === undefined && firstSelection.index !== index){
        this.style.backgroundColor = this.classList[0];
        secondSelection = divsObjects[index];
        
        if (firstSelection.color === secondSelection.color && firstSelection.index !== secondSelection.index){
            firstSelection.isMatched = true;
            secondSelection.isMatched = true;
            
            firstSelection.div.classList.add("matched");
            secondSelection.div.classList.add("matched");
        }
        
        checkVictory();
        
        timeOut = true;    //sets a timeOut to prevent user from clicking more than twice in a given time
        setTimeout(clearDivs, 1000);
    }
    
    function clearDivs(){
        timeOut = false;
        for(let divInfo of divsObjects){
            //return;
            if (!divInfo.isMatched){
                divInfo.div.style.backgroundColor = "#FFF";
            }else{
                divInfo.div.classList.remove("matched");
            }
        }
        
        firstSelection = undefined;
        secondSelection = undefined;
    }
}

function checkVictory(){
    for(let victory of divsObjects){
        //console.log(victory.isMatched);
        if(victory.isMatched === false){
            return;
        }
    }
    
    let lastBestScore = localStorage.getItem(gameScoreSaver);
    
    if (score < Number(lastBestScore)){
        localStorage.setItem(gameScoreSaver, score.toString());
    }
    
    updateBestScore();
}

//starting the game
startGame.addEventListener("click", function(){
    if(gameIsActive){
        return;
    }
    
    gameIsActive = true;
    newGame();
});

restartGame.addEventListener("click", function(){
    if(!gameIsActive){
        return;
    }
    
    for(let gameOver of divsObjects){
        if(gameOver.isMatched === false){
            return;
        }
    }
    
    newGame();
});

function newGame(){
    //clear all cards
    
    let cards = document.querySelectorAll("#game div");
    for(let card of cards){
        card.remove();
    }
    createDivsForColors(shuffledColors);
}

function updateBestScore(){
    let bestScoreStorage = localStorage.getItem(gameScoreSaver) !== null ? localStorage.getItem(gameScoreSaver) : `Score: --`;
    shuffledColors = shuffle(COLORS);
    score = 0;
    //scoreTracker.innerHTML = `Score: --`;
    bestScore.innerHTML = `Best Score: ${bestScoreStorage}`;
}