/*----- constants -----*/
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext()

const keyboard = {
    q: { label: 'Q', color: 'darksalmon', tone: 100, active: false},
    w: { label: 'W', color: 'bisque', tone: 110, active: false },
    e: { label: 'E', color: 'skyblue', tone: 120, active: false }, 
    r: { label: 'R', color: 'violet', tone: 130, active: false },
    t: { label: 'T', color: 'hotpink', tone: 140, active: false },
    y: { label: 'Y', color: 'darkorange', tone: 150, active: false },
    u: { label: 'U', color: 'gold', tone: 160, active: false },
    i: { label: 'I', color: 'turquoise', tone: 170, active: false },
    o: { label: 'O', color: 'cornflowerblue', tone: 180, active: false },
    p: { label: 'P', color: 'palevioletred', tone: 190, active: false },
    a: { label: 'A', color: 'limegreen', tone: 200, active: false },
    s: { label: 'S', color: 'deepskyblue', tone: 210, active: false },
    d: { label: 'D', color: 'dodgerblue', tone: 220, active: false },
    f: { label: 'F', color: 'deeppink', tone: 230, active: false },
    g: { label: 'G', color: 'red', tone: 240, active: false },
    h: { label: 'H', color: 'seagreen', tone: 250, active: false },
    j: { label: 'J', color: 'blue', tone: 260, active: false },
    k: { label: 'K', color: 'darkviolet', tone: 270, active: false },
    l: { label: 'L', color: 'crimson', tone: 280, active: false },
    z: { label: 'Z', color: 'purple', tone: 290, active: false },
    x: { label: 'X', color: 'navy', tone: 300, active: false },
    c: { label: 'C', color: 'green', tone: 310, active: false },
    v: { label: 'V', color: 'chocolate', tone: 320, active: false },
    b: { label: 'B', color: 'steelblue', tone: 330, active: false },
    n: { label: 'N', color: 'tomato', tone: 340, active: false },
    m: { label: 'M', color: 'rebeccapurple', tone: 350, active: false },
}

const computerMessages = [
    'Watch the sequence . . .',
    'Just a little harder this time . . .',
    'Pay attention . . .',
    "Wow, you're still here? Good job!!!",
    'Keep it up!',
    "You're doing great!",
    'This is a tricky one . . .',
    "I'm nervous about this one . . .",
    'Okay, this one is going to be tricky',
    'I think I got you on this one . . .',
    'Concentrate!!!',
    'Stop reading this and look at the board!',
    'My turn . . .',
    'Try this one out!',
]

/*----- state variables -----*/
let level = 1
let keyPatternArray = []
let playerKeyPressArray = []
let userInteractionEnabled = true
// let highScore = localStorage.getItem('highScore') || 0
let highScores = JSON.parse(localStorage.getItem('highScores')) || []
let isSoundOn = true

/*----- cached elements  -----*/
const keyEls = document.querySelectorAll('.key')
const keyboardEl = document.getElementById('keyboardContainer')
const messageEl = document.getElementById('message')
const buttonEl = document.getElementById('buttonContainer')
const startButton = document.getElementById('startButton')
const levelButton = document.getElementById('levelButton')
const resetButton = document.getElementById('resetButton')
const levelNumber = document.getElementById('levelNumber')
const primaryNavigation = document.querySelector('.primary-navigation')
const navigationToggle = document.querySelector('.mobile-nav-toggle')
const closePopupButton = document.getElementById('closePopup')
const popupContainerEl = document.getElementById('popupContainer')
const howToPlayLink = document.getElementById('howToPlayLink')
const howToPlayDivEl = document.getElementById('howToPlayDiv')
const sfxControlsLink = document.getElementById('sfxControlsLink')
const sfxControlsDivEl = document.getElementById('sfxControlsDiv')
const highScoreLink = document.getElementById('highScoreLink')
const highScoreDivEl = document.getElementById('highScoreDiv')
const resetGameLink = document.getElementById('resetGameLink')
const highScoreDisplay = document.getElementById('highScoreDisplay')
// const highScoreValue = document.getElementById('highScoreValue')
const highScoreList = document.getElementById('highScoreList')
const resetHighScoreButton = document.getElementById('resetHighScoreButton')
const soundToggle = document.getElementById('check')

/*----- event listeners -----*/
startButton.addEventListener('click', () => {
    handleStartButton()
    setTimeout(leveler, 500)
    render()
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !startButton.classList.contains('hidden')) {
        handleStartButton()
        setTimeout(leveler, 500)
        render()
    }
})

levelButton.addEventListener('click', () => {
    handleLevelButton()
    leveler()

})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !levelButton.classList.contains('hidden')) {
        handleLevelButton()
        leveler()

    }
})

resetButton.addEventListener('click', () => {
    handleResetButton()
    resetGame()
})

document.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && !resetButton.classList.contains('hidden')) {
        handleResetButton()
        resetGame()
    }
})

keyEls.forEach((keyEl) => {
    keyEl.addEventListener('click', () => {
        handleKeyPress({ key: keyEl.id })
    })
})

document.addEventListener('keydown', handleKeyPress)

navigationToggle.addEventListener('click', () => {
    const visibility = primaryNavigation.getAttribute('data-visible')
    if (visibility === 'false') {
        primaryNavigation.setAttribute('data-visible', true)
        navigationToggle.setAttribute('aria-expanded', true)
    } else {
        primaryNavigation.setAttribute('data-visible', false)
        navigationToggle.setAttribute('aria-expanded', false)
    }
})

howToPlayLink.addEventListener('click', () => {
    handlePopup(howToPlayDivEl)
})

sfxControlsLink.addEventListener('click', () => {
    handlePopup(sfxControlsDivEl)
})

highScoreLink.addEventListener('click', () => {
    handlePopup(highScoreDivEl)
})

resetGameLink.addEventListener('click', () => {
    countdownReset()
    setTimeout(() => { 
        if (!startButton.classList.contains('hidden')) {
            handleStartButton()
            render()
            setTimeout(leveler, 500)
        } else if (!levelButton.classList.contains('hidden')) {
            resetGame()
            handleLevelButton()
        } else if (!resetButton.classList.contains('hidden')) {
            handleResetButton()
            resetGame()
        } else {
            resetGame()
        }
    },4000)
})

closePopupButton.addEventListener('click', () => {
    handlePopup(null)
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !popupContainerEl.classList.contains('hidden')) {
        handlePopup(null)
    }
})

resetHighScoreButton.addEventListener('click', resetHighScore)

soundToggle.addEventListener('click', toggleSound)

/*----- functions -----*/

updateHighScoreDisplay()

function handleKeyPress(event) {
    const key = event.key || event.target.id
    if (keyboard.hasOwnProperty(key) && userInteractionEnabled) {
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        handleKeyTone(keyInfo)
        setTimeout(() => {
            checkWinProgress()
            keyInfo.active = false
        }, 200)
    }
}

function countdownReset() {
    let count = 3;

    const countdownInterval = setInterval(() => {
        if (count > 0) {
            messageEl.innerText = count
            count--
        } else {
            clearInterval(countdownInterval)
            messageEl.innerText = "Here we go!!!"
        }
    }, 800);
}

function pickRandomKey() {
    const keys = Object.keys(keyboard)
    const randomIndex = Math.floor(Math.random() * keys.length)
    const randomKey = keys[randomIndex]
    keyPatternArray.push(randomKey)
    return randomKey
}

function checkWinProgress() {
    const partialPattern = keyPatternArray.slice(0, playerKeyPressArray.length)
    
    for (let i = 0; i < playerKeyPressArray.length; i++) {
        if (playerKeyPressArray[i] !== partialPattern[i]) {
            userInteractionEnabled = false
            losingMessage()
            playAgain()
            updateHighScore() // CHECKING IF THIS WORKS!!!
            return
        }
    }
    if (playerKeyPressArray.length === keyPatternArray.length) {
        userInteractionEnabled = false
        nextLevel()
    }
}

function leveler() {
    level++
    playerKeyPressArray = []
    pickRandomKey(keyboard)
    setTimeout(() => {playKeyPattern()}, 500)
    getRandomMessage()
    userInteractionEnabled = false
}

function playKeyPattern() {
    computerTurn()
    let i = 0
    function playNextKey() {
        const key = keyPatternArray[i]
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        handleKeyTone(keyInfo)
        setTimeout(() => {
            keyInfo.active = false
            i++
            if (i < keyPatternArray.length) {
                setTimeout(playNextKey, 350)
            } else {
                setTimeout(() => {
                    userInteractionEnabled = true
                }, 200)
                playerTurn()
            }
        }, 350)
    }
    playNextKey()
}

function resetGame() {
    resetScores()
    render()
    setTimeout(leveler, 500)
}

function resetScores() {
    level = 1
    keyPatternArray = []
    updateHighScoreDisplay()
}

function getRandomMessage() {
    const randomMessage = computerMessages[Math.floor(Math.random() * computerMessages.length)]
    handleMessage(randomMessage)
}

function handleKeyColor(keyInfo) {
    if (keyInfo.active === true) {
        const keyEl = document.getElementById(keyInfo.label.toLowerCase())
        keyEl.style.backgroundColor = keyInfo.color
        keyEl.classList.add('active')
        setTimeout(() => {
            keyEl.style.backgroundColor = ''
            keyEl.classList.remove('active')
        }, 200)
    }
}

function handleKeyTone(keyInfo) {
    // const keyEl = document.getElementById(keyInfo.label.toLowerCase())
    playTone(keyInfo.tone,0.2)
}

function handleLevelButton() {
    levelButton.classList.add('hidden')
    levelNumber.innerText = level + 1
}

function handleResetButton() {
    resetButton.classList.add('hidden')
}

function handleStartButton() {
    buttonEl.style.marginBottom = '10vmin'
}

function handlePopup(selectedDiv) {
    const isSameDiv = selectedDiv === popupContainerEl.querySelector('.popup-content:not(.hidden)')

    if (!isSameDiv) {
        howToPlayDivEl.classList.add('hidden')
        sfxControlsDivEl.classList.add('hidden')
        highScoreDivEl.classList.add('hidden')
    }

    if (selectedDiv) {
        selectedDiv.classList.toggle('hidden')
    }
    popupContainerEl.classList.toggle('hidden', isSameDiv)
}

function nextLevel() {
    levelButton.classList.remove('hidden')
    messageEl.innerText = 'Would you like to proceed?'
    // updateHighScore()
}

function playerTurn() {
    messageEl.innerText = "Now it's your turn . . ."
}

function computerTurn() {
    userInteractionEnabled = false
    levelButton.classList.add('hidden')
}

function playTone(frequency, duration) {
    if(isSoundOn) {
        const oscillator = audioContext.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.connect(audioContext.destination)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + duration)
    }
}

function playAgain() {
    resetButton.classList.remove('hidden')
}

function losingMessage() {
    messageEl.innerText = 'YOU LOST! \nWanna try again?'
}

function render() {
    startButton.classList.add('hidden')
    keyboardEl.classList.remove('hidden')
    levelNumber.innerText = level + 1
}

function handleMessage(message) {
    messageEl.innerText = message
}

// function updateHighScore() {
//     if (level > highScore) {
//         if (level === 1) {
//             highScore = level
//         } else {
//             highScore = level - 1
//         }     
//         localStorage.setItem('highScore', highScore)
//         updateHighScoreDisplay()
//     }
// }

// function updateHighScoreDisplay() {
//     highScoreValue.textContent = highScore
// }

// function resetHighScore() {
//     localStorage.removeItem('highScore')
//     highScore = 0
//     updateHighScoreDisplay()
// }

function updateHighScore(playerName) {
    const newScore = { level, playerName };
    highScores.push(newScore);
    highScores.sort((a, b) => b.level - a.level); // Sort high scores in descending order
    highScores = highScores.slice(0, 5); // Keep only the top 5 scores

    localStorage.setItem('highScores', JSON.stringify(highScores));
    updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
    // highScoreList.innerHTML = ''; // Clear the previous entries

    highScores.forEach((score, index) => {
        const entry = document.createElement('div');
        entry.classList.add('high-score-entry');
        entry.innerHTML = `<span class="rank">#${index + 1}</span> ${score.playerName}: Level ${score.level}`;
        highScoreList.appendChild(entry);
    });
}

/*----- updateHighScore() will now prompt for player name before updating the high score -----*/
function updateHighScore() {
    const playerName = prompt('Congratulations! You achieved a high score. Enter your name:');
    if (playerName) {
        updateHighScore(playerName);
    }
}

/*----- resetHighScore() will also reset highScores in addition to removing from localStorage -----*/
function resetHighScore() {
    localStorage.removeItem('highScores');
    highScores = [];
    updateHighScoreDisplay();
}

function toggleSound() {
    isSoundOn = !isSoundOn
}