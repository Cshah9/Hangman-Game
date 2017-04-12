
//controls console output to help with debugging
var debug = true;
//if (debug) console.log ();

// hangman words and images:
var hangmanWords = [{word:"Mario Bros", image:"assets/images/mario.jpeg"}, {word:"Ninja Turtles", image:"assets/images/tmnt.jpeg"}];

// current word will hold the word the user is trying to guess
var currentWord = "";
//current word image address
var currentWordImage ="";

// game phrase will hold phrase to guess, so comparing letters is easier
var gamePhrase = [];
// guessed phrase will contain the blank and guessed chars as the game progress
var guessedPhrase = [];
// guessed letters will contain all the users past guessed
var guessedLetters = [];
// max number of guesses
var maxGuesses = 13;
//number of guesses left
var guessesLeft = maxGuesses;

//stats:
var wins = 0;
var losses = 0;

//function for selecting a new word:
function selectWord() {
	//select a random index
	var i = Math.floor(Math.random() * hangmanWords.length);
	
	//set current word and image variables
	currentWord = hangmanWords[i].word.toUpperCase(); 
	currentWordImage = hangmanWords[i].image;

	if (debug) {
		//debug variables
		console.log ("currentWord : "+ currentWord);
		console.log ("currentWordImage : "+ currentWordImage);
	}


	

}
//function for converting the current word into a blank gamephrase

function initializeGamePhrases(newWord) {
	guessedPhrase = [];
	gamePhrase = [];

	//to initalize game phrase, push an  into the array 
	for(var n=0; n<newWord.length; n++) {

		//make sure its not a space
		if (newWord.charAt(n)!= " ") {
			gamePhrase.push(newWord.charAt(n));
			guessedPhrase.push("_");
		}
		else {
			gamePhrase.push(" ");
			guessedPhrase.push(" ");
		}		
	}

	if (debug) {
		console.log ("initialized game phrase to: " + gamePhrase.toString());
		console.log ("initialized guessed phrase to: " + guessedPhrase.toString());
	}

}

// start new game
function newGame(){
	//select new word;
	selectWord();

	//initalize helper arrays for words
	initializeGamePhrases(currentWord);

	//reset # of guesses
	guessesLeft = maxGuesses;

	//update html elements:

	document.getElementById("guessed-phrase").textContent = displayArray(guessedPhrase);
	guessedLetters = [];
	document.getElementById("guessed-letters").textContent = guessesLeft;
	document.getElementById("guesses-left").textContent = guessesLeft;
}

//converts array as string with spaces for displaying in html

function displayArray(myArray) {

	var str="";

	for(var d = 0; d<myArray.length; d++) {

		str+= myArray[d] + " ";
	}

	return str;

}
function updateGuessedPhrase(userGuess){

	var letter = userGuess.toUpperCase();

		//letter matches, so iterate through game phrase to find the location
		for(var i = 0; i<gamePhrase.length; i++){

			//check if letters match
			if(gamePhrase[i]== letter) {
				// replace _ with letter in guessedPhrase
				guessedPhrase[i] = letter;
			}
		}

		if (debug) console.log ("guessed phrase updated to: " + guessedPhrase.toString());
		document.getElementById("guessed-phrase").textContent = displayArray(guessedPhrase);

}

// this function updates guessed letters in the html
function updateGuessedLetters() {


	document.getElementById("guessed-letters").textContent = displayArray(guessedLetters);


}

//this function checks if the user has already guess the letter; and if not, updates the history of guesses
function hasUserGuessedAlready(userGuess) {
	
	var letter = userGuess.toUpperCase();
	if (debug) console.log ("checking if  user guessed: " + letter);
	if (debug) console.log ("guessedLetters: " + guessedLetters);

	var g = guessedLetters.indexOf(letter);
	if (debug) console.log ("g index Of: " + g);

	if(g>0){
		//user has already guessed this letter
		if (debug) console.log ("User has guessed " + letter);
		return true;
	}
	else {
		//this is a new guess, so add to the array of guessed letters
		if (debug) console.log ("User has not guessed guessed " + letter);
		guessedLetters.push(letter);
		updateGuessedLetters();

		if (debug) console.log ("guessedLetters: " + guessedLetters);
		return false;
		  
	}


}

function checkGuess(userGuess) {

	var letter = userGuess.toUpperCase();

	// check if user already guessed this letter

	if (hasUserGuessedAlready(letter)){
			console.log("You have already guessed :" + letter + "! Please guess again!");

	}

	//check if the current word contains the guess letter

	else if(currentWord.includes(letter)){

		if (debug) console.log (currentWord + " contains " + letter);
		//update Guessed Phrase
		updateGuessedPhrase(letter);

	}

	else {

		if (debug) console.log (currentWord + " DOES NOT contain " + letter);
		//letter does not match, so update

	}

	

}


//update stats:
function updateStats(){

}



// Use key events to listen for the letters that your players will type.
function handleKeyUp (event) {
	//capture the key that the user pressed:
	var userKey = event.key;
	if (debug) {

		console.log ("User selected the following letter: " + userKey);
		console.log ("Number of guesses left: " + guessesLeft);
	}


	//make sure user has guesses left
	if(guessesLeft>0) {
		//check the users guess
		checkGuess(userKey);

		//decrement guess left
		guessesLeft--
	}

	document.getElementById("guesses-left").textContent = guessesLeft;

	//check if game is over or continue playing
	if(guessesLeft == 0) {
		//then game is over, so do the following:
		losses++;
		updateStats();
		newGame();


	}

	// check if there are any empty letters to guess
	if(guessedPhrase.indexOf("_")== -1) {
		//user has won
		wins++;
		updateStats();
		newGame();

	}



}






newGame();	

document.onkeyup = handleKeyUp;

// If the word is madonna, display it like this when the game starts: _ _ _ _ _ _ _.

// As the user guesses the correct letters, reveal them: m a d o _ _ a.

// Number of Guesses Remaining: (# of guesses remaining for the user).

// Letters Already Guessed: (Letters the user has guessed, displayed like L Z Y H).

// Wins: (# of times user guessed the word correctly).

// After the user wins/loses the game should automatically choose another word and make the user play it.