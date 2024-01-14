const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Inicializace herních proměnných
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Nastavení herních proměnných a prvků uživatelského rozhraní
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.png";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Výběr náhodného slova a nápovědy ze seznamu wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // Po dokončení hry.. zobrazí se modální okno s příslušnými údaji
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.png`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Kontrola, zda clickedLetter existuje v currentWord
    if(currentWord.includes(clickedLetter)) {
        // Zobrazení všech správných písmen na displeji slova
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Pokud kliknuté písmeno neexistuje, aktualizuje se hodnota wrongGuessCount a obrázek oběšence.
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.png`;
    }
    button.disabled = true; // Zakázání kliknutého tlačítka, aby uživatel nemohl kliknout znovu
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Volání funkce gameOver, pokud je splněna některá z těchto podmínek
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Vytvoření tlačítek klávesnice a přidání addEventListener
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);