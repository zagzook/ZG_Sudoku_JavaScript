const startScreen = document.querySelector('#start-screen')
const gameScreen = document.querySelector('#game-screen')
const pauseScreen = document.querySelector('#pause-screen')

const darkModeToggle = document.querySelector('#dark-mode-toggle')
const metaNameThemeColor = document.querySelector('meta[name="theme-color"]')
const btnContinue = document.querySelector('#btn-continue')
const nameInput = document.querySelector('#input-name')
const btnPlay = document.querySelector('#btn-play')
const btnLevel = document.querySelector('#btn-level')
const btnPause = document.querySelector('#btn-pause')
const btnResume = document.querySelector('#btn-resume')
const btnNewGame = document.querySelector('#btn-new-game')
const mainGrid = document.querySelector('.main-game')
const mainSudokuGrid = document.querySelector('.main-sudoku-grid')
const numberKeys = document.querySelector('.numbers')
const playerName = document.querySelector('#player-name')
const gameLevel = document.querySelector('#game-level')
const gameTimer = document.querySelector('#game-time')

//add dark/light theme toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    const isDarkMode = document.body.classList.contains('dark')
    localStorage.setItem('darkmode', isDarkMode)
    // change mobile status bar color
    metaNameThemeColor.setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff')
})
//------------------------------

//initial value
let level_index = 0
let level = CONSTANT.LEVEL[level_index]
let timer = null
let pause = false
let seconds = 0

const getGameInfo = () => JSON.parse(localStorage.getItem('game'))
//-----------

// add space for each 9 cells
function initGameGrid() {
    const cells = document.querySelectorAll('.main-grid-cell')

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE
        if (row === 2 || row === 5) cells[i].style.marginBottom = '10px'
        if (col === 2 || col === 5) cells[i].style.marginRight = '10px'

    }
}

//---------------------------

const setPlayerName = (name) => localStorage.setItem('playerName', name)
const getPlayerName = () => localStorage.getItem('playerName')
const showTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)


const startGame = () => {
    startScreen.classList.remove('active')
    gameScreen.classList.add('active')

    playerName.innerHTML = nameInput.value.trim()
    setPlayerName(nameInput.value.trim())

    gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index]

    showTime(seconds)

    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1
            gameTimer.innerHTML = showTime(seconds)
        }
    }, 1000)
}

const retunrStartScreen = () => {
    clearInterval(timer)
    pause = false
    seconds = 0
    startScreen.classList.add('active')
    gameScreen.classList.remove('active')
    pauseScreen.classList.remove('active')
    gameTimer.innerHTML = '00:00:00'
}

// add button events
btnLevel.addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1
    level = CONSTANT.LEVEL[level_index]
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

btnPlay.addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        startGame()

    } else {
        nameInput.classList.add('input-err')
        setTimeout(() => {
            nameInput.classList.remove('input-err')
            nameInput.focus()
        }, 500)
    }
})

btnPause.addEventListener('click', () => {
    pauseScreen.classList.add('active')
    pause = true
})

btnResume.addEventListener('click', () => {
    pauseScreen.classList.remove('active')
    pause = false
})

btnNewGame.addEventListener('click', () => {
    retunrStartScreen()
})


//------------------

// Functions
function init() {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'))
    document.body.classList.add(darkmode ? 'dark' : 'light')
    metaNameThemeColor.setAttribute('content', darkmode ? '#1a1a2e' : '#fff')

    const game = getGameInfo()

    btnContinue.style.display = game ? 'grid' : 'none'

    createGridBoard()
    createNumberBoard()
    initGameGrid()

    if (getPlayerName()) {
        nameInput.value = getPlayerName()
    } else {
        nameInput.focus()
    }

}

function createGridBoard() {
    for (let i = 0; i < CONSTANT.GRID_SIZE * CONSTANT.GRID_SIZE; i++) {
        const square = document.createElement('div')
        square.classList.add('main-grid-cell')
        square.setAttribute('id', i)
        mainSudokuGrid.appendChild(square)
    }


}

function createNumberBoard() {
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++) {
        const numberBoard = document.createElement('div')
        numberBoard.classList.add('number')
        numberBoard.setAttribute('id', i)
        numberBoard.innerHTML = i
        numberKeys.appendChild(numberBoard)
    }
    const deleteKey = document.createElement('div')
    deleteKey.classList.add('delete')
    deleteKey.setAttribute('id', 'btn-delete')
    deleteKey.innerHTML = 'X'
    numberKeys.appendChild(deleteKey)


}

//--------------------

init()

