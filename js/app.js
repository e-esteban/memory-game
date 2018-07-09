/*
 * Array that holds the 16 Cards of the Game.
 */
 const gameCards = ["fa-diamond","fa-diamond",
                 "fa-paper-plane-o","fa-paper-plane-o",
                 "fa-anchor","fa-anchor",
                 "fa-bolt","fa-bolt",
                 "fa-cube","fa-cube",
                 "fa-leaf","fa-leaf",
                 "fa-bicycle","fa-bicycle",
                 "fa-bomb","fa-bomb"];
/*
/* Global Variables
*/
let gameMoves = 0;    // Initialize game moves to 0. Increment to 1 when two open cards are compared for match/no match.
let openPairCards = 0; //Count the number of matched Pair of Cards; if openPairCards==8, then game is finished.
let starRating = 5;    //Start the game with 5 Stars then decrement by 1 star. See rateTheStars().
let timeCounter = 0;   //Initialize time = 0. This will be used for determining the User time (min and sec).
let gameTimer;         // Time variable used for setInterval and clearInterval functions.
let openCardList = []; // An Array to hold a maximum of 2 open cards. Used also to limit opening a 3rd card when 2 are already opened.
let openCardCtr=0;  //Variable used to start the timer when a user open the first card of the game.
let seconds = 0;  //Variable to count running seconds of the game. Used with timeCounter variable.
let minutes = 0;  //Variable to count running minutes of the game. Used with timeCounter variable.

/*
/* Call the functions to initialize, setup, and start the Memory Game.
*/
setUpGameCards();
initStars();
playGame();


/*
/* The Game Restart button ("fa fa-repeat" class).
*/
let gameReset = document.getElementsByClassName("restart");
gameReset[0].addEventListener("click", function(){
  restartGame();
});


/*
* setUpGameCards() creates an array from the Array gameCards, shuffle them,
*/
function setUpGameCards(){
  let setCards = Array.from(gameCards); /*make a copy of cards for shuffling*/
  let cardDeck = document.getElementsByClassName('deck')[0]; /*get card deck container*/

  setCards = shuffle(setCards);
  cardDeck.innerHTML=""; /* Clear HTML entries of the cards for entry of new ones.*/
  /* Set the randomize Cards on the Game Board by creating their HTML*/
  setCards.forEach(function(item){
    let li = document.createElement("li");
    let i = document.createElement("i");
    li.className="card";
    cardDeck.appendChild(li);
    i.className="fa "+ item;
    li.appendChild(i);
  });
}

/*
* Shuffle function from http://stackoverflow.com/a/2450976
*/
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 /*
 * initStars() function creates the HTML of star rating.
 */
function initStars(){
  let stars = document.getElementById("stars");
  for (let i=1; i<6; i++){
    let li = document.createElement("li");
    let i = document.createElement("i");
    stars.appendChild(li);
    i.className="fa fa-star on";
    li.appendChild(i);
  }
}

/*
* playGame() function starts the Memory Game:
*   -Uses event delegation to handle event listener when a Card is clicked. This has so much better response,
*     easy to troubleshoot and timer function respond better than adding an event listener for individual cards.
*   -When a Card is clicked:
*         - if this is the first click of the card in the deck, start the timer (use openCardCtr for checking).
*         - check if the array openCardList holds 2 cards. Keep adding a card on the list when openCardList is <2.
*           openCardList will also help not to open the card when it is already open.
*/
function playGame(){
  let cardDeck = document.getElementById("cardDeck");

  cardDeck.addEventListener("click", function(event){
  let activeCard = event.target;
  if (event.target && event.target.classList.contains("card")){
    console.log("Card was clicked!");
    openCardCtr++;

    if(openCardCtr==1){
      startTimer();
    };
    if (openCardList.length<2){
      if (activeCard.classList.contains("open")){
        console.log("card is already open!!");
      } else {
        activeCard.classList.add("open","show");
        openCardList.push(activeCard);
        if (openCardList.length==2) {
          console.log("2 cards are already open! Check if match...");
          checkMatch();
        };
      };
    };// if opencards.length<2*/
    }; //if evt.target && contains "class"
  });//cardDeck addEventListener
} //playGame

/*
*  processCard(item) function tests the opened 2 cards for match/no match.
*   -If the user clicks an already open card, it does nothing.
*   -A card is opened when clicked and added to the addCardToList array for comparison of two opened cards.
*   -When there are 2 cards entries on the addCardToList array (two cards are currently open), they are tested for a match.
*/
function processCard(item){
	let open =item.classList.contains("open");
	let matched =item.classList.contains("match");

		/* Test if card is already open and/or matched */
    if((open||matched)){
      console.log("card is already open and/or matched!!");
		} else {
			openTheCard(item);
			addCardToList(item);
		}


	if (openCardList.length==2){
      checkMatch();
    }

} //processCard


/*
* openTheCard(item) function will open a card when clicked as long as the currently opened cards are less than 2.
* This prevents 3 opened cards in the game. If a user tries to open another card while 2 cards are open and being processed
* for comparison, the 3rd card will not be opened and the user click will be ignored.
*/
function openTheCard(item){
  if (openCardList.length<2){
    item.classList.add("open","show");
    };
  };


/*
* addCardToList(item) function will add the card to the openCardList array of cards to be compared.
* The card will be entered on the list as long as the list contains < 2 cards.
*/
function addCardToList(item){
  if(openCardList.length<2){
    openCardList.push(item);
  };
}

/*
* checkMatch() function checks the two opened card on the openCardList array for match/no match.
*  - Closes the 2 cards if they don't match; empty the openCardList to prepare for next two cards
*    to be checked for match/no match.
*  - Increments the gameMoves counter after each check match. If openPairCards==8, call function to end game.
*/
function checkMatch(){
  let x = openCardList[0].firstChild.getAttribute("class");
  let y = openCardList[1].firstChild.getAttribute("class");
  let moves = document.querySelector(".moves");
  let movesTxt = document.getElementsByClassName("colorText");

  ++gameMoves;
  if (x==y) {
    console.log('cards match!!');
    ++openPairCards;
    openCardList[0].classList.remove("open", "show");
    openCardList[0].classList.add("match");
    openCardList[1].classList.remove("open", "show");
    openCardList[1].classList.add("match");

    openCardList = [];
    console.log("Open pair cards = " + openPairCards)
    if (openPairCards==8) {
      console.log("gameMoves=" + gameMoves);
      gameFinished();
    }
  } else {
    console.log('cards NOT match!!');
    setTimeout(function(){
      closeCard(openCardList[0], openCardList[1])}, 1000);
  };
  movesTxt[0].textContent =  gameMoves;
  rateTheStars(gameMoves);
}

/*
* closeCard(item1, item2) function closes the cards if they don't match; clear the list of open cards.
*/
function closeCard(item1, item2){
  console.log("array1 " + item1 + openCardList[0].firstChild.getAttribute("class"));
  console.log(openCardList.length);
  if (openCardList.length>1){
    item1.classList.remove("open","show");
    item2.classList.remove("open","show");
    openCardList = [];
  };
}

/*
* rateTheStars(moves) function rate the number of stars in the game based from the number of moves.
* From 5 stars rating, the star rating decreases by 1 as the game moves increments by 4.
*/
function rateTheStars(moves){
    if (moves > 24) {
      console.log("1 star");
      starRating = 1;
    } else if (moves > 20) {
      console.log("2 stars");
      starRating = 2;
    } else if (moves > 16){
        console.log("3 stars");
        starRating = 3;
    } else if (moves > 12){
        console.log("4 stars");
        starRating = 4;
    } else {
      starRating=5;
    }
    starColors(starRating);
  } //rateTheStars

/*
* starColors(numStars) function creates an array of the star rating and turn them off(gray color) based on the numStars.
*/
function starColors(numStars){
  let starsClasses = document.getElementsByClassName("fa fa-star");
  let sArray = Array.from(starsClasses);

  if (numStars>0){
    for (let i=5-numStars; i>0; i--){
      sArray[i-1].classList.replace("on","off");
    }
  }
}

/*
* startTimer() function starts the timer.
*/
function startTimer(){
  gameTimer= setInterval(countUpTimer, 1000);
}

/*
* countUpTimer() function translates the time counter to seconds and minutes.
*/
function countUpTimer(){
  let t = document.getElementById("timerText");

  seconds = timeCounter  % 60;
  if (seconds<10){
    seconds = "0" + seconds ;
  }
  minutes = parseInt(timeCounter / 60);
  if (minutes<10){
    minutes = "0" + minutes ;
  }

  t.textContent = minutes + ":" + seconds ;
  timeCounter++;
}

/*
* gameFinished() function creates a  modal window when the user finishes the game.
*/
function gameFinished(){
 let finished = document.getElementById("gameModal");
 let modalInfo = document.querySelectorAll(".modalTxt");
 let timeDone = document.getElementById("timerText");
 let finalStars = document.getElementById("stars");
 let btn = document.getElementById("rBtn");
 let cloneStars = finalStars.cloneNode(true);
 let modalStr = document.getElementsByClassName("modalDetails");
 let modalStrRating = document.querySelector(".modalStars");

 stopTimer();
 finished.style.display = "block";
 modalInfo[0].textContent="Congratulations!";
 modalInfo[1].textContent= "Number of Moves : " + gameMoves;
 modalInfo[3].textContent= timeDone.textContent;
 modalInfo[2].textContent= "Time : "+ minutes + ":" + seconds;
 modalInfo[3].textContent= "Stars : " + starRating;

 btn.onclick = function(){
   finished.style.display = "none";
   restartGame();
  }
}

/*
* stopTimer() function stops the timer.
*/
function stopTimer(){
  clearInterval(gameTimer);
}

/*
* restartGame() function restarts the game. It stops the timer and initializes parameters.
*/
function restartGame(){
  let moves = document.querySelector(".moves");
  let starsClasses = document.getElementById("stars");

  starsClasses.innerHTML="";
  gameMoves = 0;
  moves.textContent = gameMoves;

  openCardList = [];
  openPairCards = 0;

  stopTimer();

  starRating = 5;
  initStars();

  timeCounter = 0;
  countUpTimer();

  openCardCtr=0;
  setUpGameCards();
}
