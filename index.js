const words = [
    "react", "jsx", "components", "props", "state", "hooks", "usestate", "useeffect", "usecontext",
    "usereducer", "useref", "usememo", "usecallback", "customhooks", "functionalcomponents",
    "classcomponents", "lifecyclemethods", "contextapi", "redux", "reducer", "action", "store",
    "middleware", "reduxthunk", "reduxsaga", "reactrouter", "route", "link", "switch", "history",
    "reactdom", "virtualdom", "diffingalgorithm", "fiber", "concurrentmode", "suspense",
    "errorboundary", "higherordercomponent", "hoc", "renderprops", "portals", "ref", "forwardref",
    "fragments", "strictmode", "contextprovider", "contextconsumer", "reselect", "immutability",
    "memoization", "propdrilling", "composition", "reacttransitiongroup", "reactspring", "reactmotion",
    "styledcomponents", "emotion", "cssmodules", "jss", "babel", "webpack", "create-react-app", "nextjs",
    "gatsby", "ssr", "hydration", "lazyloading", "code-splitting", "tree-shaking", "hot-reloading",
    "eslint", "prettier", "jest", "enzyme", "react-testing-library", "react-hooks-testing-library",
    "storybook", "styleguidist", "react-native", "expo", "react-navigation", "react-redux",
    "react-query", "apollo-client", "graphql", "formik", "react-final-form", "yup", "reactstrap",
    "material-ui", "ant-design", "blueprintjs", "semantic-ui-react", "evergreen-ui", "chakra-ui",
    "rebass", "reach-ui", "headless-ui", "react-icons", "react-hot-toast", "react-player",
    "react-dropzone"
];

let currentWord = "";
let currentWordCharacters = [];
let typedCharacters = 0;
let wordInProgress = false;
let availableWords = [...words];
let currentWordDiv = null;
let wordMoveInterval = null;
let starTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
    spawnWord();
    document.addEventListener("keydown", handleKeyPress);
});

function spawnWord() {
    if (wordInProgress) return;
    if (availableWords.length === 0) {
        availableWords = [...words];
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    currentWord = availableWords.splice(randomIndex, 1)[0];
    renderWord(currentWord);
    wordInProgress = true;
}

function renderWord(word) {
    currentWordDiv = document.createElement("div");
    currentWordDiv.classList.add("word");
    currentWordCharacters = [];
    typedCharacters = 0;

    for (let i = 0; i < word.length; i++) {
        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character");
        characterDiv.textContent = word[i];
        currentWordDiv.appendChild(characterDiv);
        currentWordCharacters.push(characterDiv);
    }
    currentWordDiv.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    document.getElementById("wordContainer").appendChild(currentWordDiv);
    moveWord(currentWordDiv);
}

function moveWord(wordDiv) {
    let top = 0;
    wordMoveInterval = setInterval(() => {
        top += 1;
        wordDiv.style.top = `${top}px`;
        if (top > window.innerHeight) {
            clearInterval(wordMoveInterval);
            wordDiv.remove();
            wordInProgress = false;
            spawnWord();
        }
    }, 50);
}

function handleKeyPress(event) {
    const key = event.key;
    if (!wordInProgress || currentWordCharacters.length === 0) return;

    const currentCharacter = currentWordCharacters[0].textContent;
    if (key === currentCharacter) {
        shootStar(currentWordCharacters[0]);
        currentWordCharacters[0].classList.add("correct");
        currentWordCharacters.shift();
        typedCharacters++;
        if (typedCharacters === 1) {
            currentWordDiv.classList.add("glow");
        }
        if (currentWordCharacters.length === 0) {
            removeWord();
        }
    } else {
        currentWordDiv.classList.remove("glow");
    }
}

function shootStar(characterDiv) {
    const star = document.createElement("div");
    star.classList.add("star");
    const spaceship = document.getElementById("spaceship");
    const spaceshipRect = spaceship.getBoundingClientRect();
    star.style.left = `${spaceshipRect.left + spaceshipRect.width / 2 - 5}px`;
    star.style.bottom = `${spaceshipRect.height + 20}px`;
    document.getElementById("gameArea").appendChild(star);

    const starX = spaceshipRect.left + spaceshipRect.width / 2;
    const starY = window.innerHeight - (spaceshipRect.height + 20);
    const targetRect = characterDiv.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top;

    const deltaX = targetX - starX;
    const deltaY = targetY - starY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = 250;
    const stepX = (deltaX / distance) * speed;
    const stepY = (deltaY / distance) * speed;

    let currentX = starX;
    let currentY = starY;

    const starMoveInterval = setInterval(() => {
        currentX += stepX;
        currentY += stepY;
        star.style.left = `${currentX}px`;
        star.style.bottom = `${window.innerHeight - currentY}px`;

        const characterRect = characterDiv.getBoundingClientRect();
        if (
            currentX >= characterRect.left &&
            currentX <= characterRect.right &&
            currentY >= characterRect.top &&
            currentY <= characterRect.bottom
        ) {
            clearInterval(starMoveInterval);
            star.remove();
            characterDiv.remove();
            if (currentWordCharacters.length === 0) {
                removeWord();
            }
        }
    }, 30);

    // Remove star if it goes out of bounds
    starTimeout = setTimeout(() => {
        clearInterval(starMoveInterval);
        star.remove();
    }, 5000);
}

function removeWord() {
    clearInterval(wordMoveInterval);
    currentWordDiv.remove();
    wordInProgress = false;
    spawnWord();
}
