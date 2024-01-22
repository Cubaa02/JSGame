//Tyto řádky pomocí document.querySelector vybírají HTML elementy na základě tříd
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Inicializace herních proměnných
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

// Nastavení herních proměnných a prvků uživatelského rozhraní
const resetGame = () => {
    correctLetters = [];  //Pole které slouží k uchovávání správně uhodnutých písmen v aktuálním slově
    wrongGuessCount = 0; //Nastavuje počet nesprávných pokusů
    hangmanImage.src = "images/hangman-0.png"; //Nastavuje obrázek oběšence na výchozí stav 
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; //Aktualizuje textový obsah elementu guessesText, který zobrazuje aktuální počet nesprávných pokusů a maximální povolený počet pokusů
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join(""); // Tento řádek nastavuje obsah elementu wordDisplay tak, aby odpovídal délce aktuálního slova. Každý znak v currentWord je mapován na HTML <li> element, který představuje jeden znak slova. Výsledné HTML je spojeno dohromady pomocí metody join("")
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false); //Aktivuje všechna tlačítka na klávesnici tak, že prochází všechny tlačítka (označená pomocí selektoru "button" v rámci keyboardDiv) a nastavuje atribut disabled na false
    gameModal.classList.remove("show"); //Odebírá třídu "show" z modálního okna (gameModal), což skrývá modální okno. Tím se připravuje prostředí pro další kolo hry
}

// Výběr náhodného slova a nápovědy ze seznamu wordList
const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)]; // Vytvoří náhodný index, který se použije k výběru náhodného objektu z pole
    currentWord = word; //Nastavuje hodnotu proměnné currentWord na vybrané náhodné slovo
    document.querySelector(".hint-text b").innerText = hint; //Nastavuje text nápovědy ve hře na hodnotu hint. Hledá element v HTML s třídou "hint-text" a nastavuje jeho obsah (text) na nápovědu z vybraného náhodného slova
    resetGame(); //Volá funkci resetGame(). Tato funkce inicializuje herní proměnné a nastavuje prvky uživatelského rozhraní na počáteční hodnoty, připravující tak prostředí pro novou hru
}

    // Po dokončení hry.. zobrazí se modální okno s příslušnými údaji
const gameOver = (isVictory) => {
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.png`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    clickedLetter = clickedLetter.toLowerCase();
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
for (let i = 97; i <= 122; i++) { // Toto je cyklus for, který projde písmena od 'a' (ASCII hodnota 97) do 'z' (ASCII hodnota 122)
    const button = document.createElement("button"); //Vytváří nový element <button> pro každé písmeno
    button.innerText = String.fromCharCode(i); //Nastavuje text tlačítka na aktuální písmeno v iteraci cyklu. Metoda String.fromCharCode(i) převede ASCII hodnotu i na odpovídající znak.
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, e.target.innerText));
}

// Přidání posluchače klávesnice
document.addEventListener("keydown", (e) => {
    const pressedKey = e.key.toLowerCase();
    const button = Array.from(keyboardDiv.querySelectorAll("button")).find(btn => btn.innerText.toLowerCase() === pressedKey);
    if (button && !button.disabled) {
        initGame(button, pressedKey);
    }
});

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
