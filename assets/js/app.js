const startScreen = document.querySelector('#start-screen')
const gameScreen = document.querySelector('#game-screen')
const pauseScreen = document.querySelector('#pause-screen')
const resultScreen = document.querySelector('#result-screen')
const darkModeToggle = document.querySelector('#dark-mode-toggle')
const metaNameThemeColor = document.querySelector('meta[name="theme-color"]')
const nameInput = document.querySelector('#input-name')
const btnContinue = document.querySelector('#btn-continue')
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
const resultTime = document.querySelector('#result-time')
const tilePath = 'assets/images/tiles/'

//add dark/light theme toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    const isDarkMode = document.body.classList.contains('dark')
    themeMode = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('darkmode', isDarkMode)
    // change mobile status bar color
    metaNameThemeColor.setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff')
})
//------------------------------

//initial value
let themeMode = 'dark'
let cells = undefined
let numberInputs = undefined
let level_index = 0
let level = CONSTANT.LEVEL[level_index]
let timer = null
let pause = false
let seconds = 0
let su = undefined
let suAnswer = undefined
let selectedCell = -1
//-----------
const getGameInfo = () => JSON.parse(localStorage.getItem('game'))

const setPlayerName = (name) => localStorage.setItem('playerName', name)

const getPlayerName = () => localStorage.getItem('playerName')

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)

// add button events
btnLevel.addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1
    level = CONSTANT.LEVEL[level_index]
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

btnPlay.addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        initSudoku()
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
    clearSudoku()
    returnStartScreen()
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
    cells = document.querySelectorAll('.main-grid-cell')
    createNumberBoard()
    initGameGrid()
    initCellsEvent()
    initNumberInputEvent()
    if (getPlayerName()) {
        nameInput.value = getPlayerName()
    } else {
        nameInput.focus()
    }

}

function startGame() {
    startScreen.classList.remove('active')
    gameScreen.classList.add('active')

    playerName.innerHTML = nameInput.value.trim()
    setPlayerName(nameInput.value.trim())

    gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index]

    seconds = 0
    showTime(seconds)
    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1
            gameTimer.innerHTML = showTime(seconds)
        }
    }, 1000)
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
        numberBoard.setAttribute('id', i + 1)
        numberBoard.innerHTML = i + 1
        numberKeys.appendChild(numberBoard)
    }
    const deleteKey = document.createElement('div')
    deleteKey.classList.add('delete')
    deleteKey.setAttribute('id', 'btn-delete')
    deleteKey.innerHTML = 'X'
    numberKeys.appendChild(deleteKey)
    numberInputs = document.querySelectorAll('.number')

}

function initSudoku() {
    const levelName = CONSTANT.LEVEL_NAME[level_index]
    // clear old sudoku
    clearSudoku()
    resetBg()
    // generate sudoku puzzle
    su = sudokuGen(level)
    suAnswer = [...su.question]

    console.log(suAnswer)
    setSudokuToDiv()

}

function setSudokuToDiv() {
    //const cells = document.querySelectorAll('.main-grid-cell')
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE
        const divValue = suAnswer[row][col]
        const imageHTML = `<img src='${tilePath}a${divValue}-${themeMode}.png' class="cell-image" alt="New Image">`

        cells[i].setAttribute('data-value', divValue)

        if (divValue !== 0) {
            cells[i].classList.add('filled')
            cells[i].innerHTML += imageHTML
        }
    }
}

function clearSudoku() {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = ''
        cells[i].classList.remove('filled')
        cells[i].classList.remove('selected')
    }
}

function returnStartScreen() {
    clearInterval(timer)
    pause = false
    seconds = 0
    startScreen.classList.add('active')
    gameScreen.classList.remove('active')
    pauseScreen.classList.remove('active')
    gameTimer.innerHTML = '00:00:00'
}

function initGameGrid() {
    //const cells = document.querySelectorAll('.main-grid-cell')

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE
        if (row === 2 || row === 5) cells[i].style.marginBottom = '10px'
        if (col === 2 || col === 5) cells[i].style.marginRight = '10px'

    }
}

function hoverBg(index) {
    let row = Math.floor(index / CONSTANT.GRID_SIZE)
    let col = index % CONSTANT.GRID_SIZE

    let boxStartRow = row - row % 3
    let boxStartCol = col - col % 3

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (boxStartRow + i) + (boxStartCol + j)]
            cell.classList.add('hover')
        }
    }
    let step = CONSTANT.GRID_SIZE
    while (index - step >= 0) {
        cells[index - step].classList.add('hover')
        step += 9
    }

    step = 9
    while (index + step < 81) {
        cells[index + step].classList.add('hover')
        step += 9
    }

    step = 1
    while (index - step >= 9 * row) {
        cells[index - step].classList.add('hover')
        step += 1
    }

    step = 1
    while (index + step < 9 * row + 9) {
        cells[index + step].classList.add('hover')
        step += 1
    }
}

function resetBg() {
    cells.forEach(e => e.classList.remove('hover'))
}

function initCellsEvent() {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'))

                selectedCell = index
                e.classList.remove('err')
                e.classList.add('selected')
                resetBg()
                hoverBg(index)
            }
        })
    })
}

function checkErr(value) {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err')
            cell.classList.add('cell-err')
            setTimeout(() => {
                cell.classList.remove('cell-err')
            }, 500)
        }
    }

    let index = selectedCell

    let row = Math.floor(index / CONSTANT.GRID_SIZE)
    let col = index % CONSTANT.GRID_SIZE

    let box_start_row = row - row % 3
    let box_start_col = col - col % 3

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)]
            if (!cell.classList.contains('selected')) addErr(cell)
        }
    }

    let step = 9
    while (index - step >= 0) {
        addErr(cells[index - step])
        step += 9
    }

    step = 9
    while (index + step < 81) {
        addErr(cells[index + step])
        step += 9
    }

    step = 1
    while (index - step >= 9 * row) {
        addErr(cells[index - step])
        step += 1
    }

    step = 1
    while (index + step < 9 * row + 9) {
        addErr(cells[index + step])
        step += 1
    }
}

function removeErr() {
    cells.forEach(e => e.classList.remove('err'))
}

function initNumberInputEvent() {
    numberInputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!cells[selectedCell].classList.contains('filled')) {
                cells[selectedCell].innerHTML = index + 1
                cells[selectedCell].setAttribute('data-value', index + 1)
                // add to answer
                let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE)
                let col = selectedCell % CONSTANT.GRID_SIZE
                suAnswer[row][col] = index + 1
                // save game
                saveGameInfo()
                // -----
                removeErr()
                checkErr(index + 1)
                cells[selectedCell].classList.add('zoom-in')
                setTimeout(() => {
                    cells[selectedCell].classList.remove('zoom-in')
                }, 500)

                // check game win
                if (isGameWin()) {
                    removeGameInfo()
                    showResult()
                }
                // ----
            }
        })
    })
}

function saveGameInfo() {
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: suAnswer
        }
    }
    localStorage.setItem('game', JSON.stringify(game))
}

function removeGameInfo() {
    localStorage.removeItem('game')
    document.querySelector('#btn-continue').style.display = 'none'
}

function isGameWin() {
    return sudokuCheck(suAnswer)
}

function showResult() {
    clearInterval(timer)
    resultScreen.classList.add('active')
    resultTime.innerHTML = showTime(seconds)
}

//---------------------------

init()





