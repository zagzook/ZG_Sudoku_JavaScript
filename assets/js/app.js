const startScreen = document.querySelector('#start-screen')
const gameScreen = document.querySelector('#game-screen')
const pauseScreen = document.querySelector('#pause-screen')
const resultScreen = document.querySelector('#result-screen')
const darkModeToggle = document.querySelector('#dark-mode-toggle')
const metaNameThemeColor = document.querySelector('meta[name="theme-color"]')
const mainSudokuGrid = document.querySelector('#main-sudoku-grid')
const nameInput = document.querySelector('#input-name')
const btnContinue = document.querySelector('#btn-continue')
const btnPlay = document.querySelector('#btn-play')
const btnLevel = document.querySelector('#btn-level')
const btnPause = document.querySelector('#btn-pause')
const btnResume = document.querySelector('#btn-resume')
const btnNewGame = document.querySelector('#btn-new-game')
const btnNewGameResults = document.querySelector('#btn-new-game-2')
const btnDelete = document.querySelector('#btn-delete')
const playerName = document.querySelector('#player-name')
const gameLevel = document.querySelector('#game-level')
const gameTimer = document.querySelector('#game-time')
const resultTime = document.querySelector('#result-time')
const gameError = document.querySelector('#game-err')
const cells = document.querySelectorAll('.main-grid-cell')
const numberInputs = document.querySelectorAll('.number')
const tilePath = 'assets/images/tiles/'

//add dark/light theme toggle
let themeMode = 'dark'
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

let gameType = ''
let level_index = 0
let level = CONSTANT.LEVEL[level_index]
let timer = null
let pause = false
let seconds = 0
let su = undefined
let suAnswer = undefined
let selectedCell = -1
let errorCount = 0
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
    clearKeyboard()
    removeGameInfo()
    returnStartScreen()
})

btnNewGameResults.addEventListener('click', () => {
    clearSudoku()
    clearKeyboard()
    removeGameInfo()
    returnStartScreen()
})

btnContinue.addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        loadSudoku()
        startGame()
    } else {
        nameInput.classList.add('input-err')
        setTimeout(() => {
            nameInput.classList.remove('input-err')
            nameInput.focus()
        }, 500)
    }
})

btnDelete.addEventListener('click', () => {
    cells[selectedCell].innerHTML = ''
    cells[selectedCell].setAttribute('data-value', 0)

    let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE)
    let col = selectedCell % CONSTANT.GRID_SIZE

    suAnswer[row][col] = 0

    removeErr()
})

document.addEventListener('click', (e) => {
    if (!mainSudokuGrid.contains(e.target)) {
        clearCells()
    }
})


//------------------

// Functions
function init() {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'))
    document.body.classList.add(darkmode ? 'dark' : 'light')
    themeMode = darkmode ? 'dark' : 'light'
    metaNameThemeColor.setAttribute('content', darkmode ? '#1a1a2e' : '#fff')

    const game = getGameInfo()
    btnContinue.style.display = game ? 'grid' : 'none'
    console.log(nineDigits)
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
    gameError.innerHTML = `Errors: ${errorCount}/${CONSTANT.ERRORMAXCOUNT[CONSTANT.LEVEL[level_index] - 2]}`
    seconds = 0
    showTime(seconds)
    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1
            gameTimer.innerHTML = showTime(seconds)
        }
    }, 1000)
}

function initSudoku() {
    const levelName = CONSTANT.LEVEL_NAME[level_index]
    // clear old sudoku
    clearSudoku()
    clearKeyboard()
    resetBg()
    // generate sudoku puzzle
    su = sudokuGen(level)
    suAnswer = [...su.question]
    setSudokuToDiv()
    setKeyboardToDiv()

}

function setSudokuToDiv() {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE
        const divValue = suAnswer[row][col]
        const imageHTML = `<img src='${tilePath}${gameType}${divValue}-${themeMode}.png' class="cell-image" alt="New Image">`

        cells[i].setAttribute('data-value', divValue)

        if (divValue !== 0) {
            cells[i].classList.add('filled')
            cells[i].innerHTML += imageHTML
        }
    }
}

function setKeyboardToDiv() {
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++) {
        const imageHTML = `<img src='${tilePath}${gameType}${i + 1}-${themeMode}.png' class="cell-image" alt="New Image">`
        numberInputs[i].innerHTML += imageHTML
    }
}

function clearSudoku() {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = ''
        cells[i].classList.remove('filled')
        cells[i].classList.remove('fill-ans')
        cells[i].classList.remove('selected')
        cells[i].classList.remove('hover')
    }
}

function clearKeyboard() {
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++) {
        numberInputs[i].innerHTML = ''
    }
}

function returnStartScreen() {
    clearInterval(timer)
    pause = false
    seconds = 0
    startScreen.classList.add('active')
    gameScreen.classList.remove('active')
    pauseScreen.classList.remove('active')
    resultScreen.classList.remove('active')
    gameTimer.innerHTML = '00:00:00'
}

//to create the big border gaps
function initGameGrid() {
    //to create the big border gaps

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
    let step = 9
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
            } else {
                //console.log('cell value', cells[index].getAttribute('data-value'))
                for (let i = 0; i < CONSTANT.GRID_SIZE * CONSTANT.GRID_SIZE; i++) {
                    let selectedCellGrid = cells[index].getAttribute('data-value')
                    let selectedNewCellGrid = cells[i].getAttribute('data-value')
                    if (selectedCellGrid === selectedNewCellGrid) {
                        cells[i].classList.add('hover')
                    }
                }
            }
        })
    })

}

function checkErr(value) {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err')
            cell.classList.add('cell-err')
            cells[selectedCell].classList.add('err')

            gameError.innerHTML = `Errors: ${errorCount}/${CONSTANT.ERRORMAXCOUNT[CONSTANT.LEVEL[level_index] - 2]}`
            setTimeout(() => {
                cell.classList.remove('cell-err')
            }, 1000)
            setTimeout(() => {
                cell.classList.remove('err')
            }, 1500)
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

function isErrCell(value) {
    return cells[selectedCell].classList.contains(value)
}

function removeErr() {
    cells.forEach(e => e.classList.remove('err'))
}

function initNumberInputEvent() {
    numberInputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            const imageHTML = `<img src='${tilePath}${gameType}${index + 1}-${themeMode}.png' class="cell-image" alt="New Image">`

            if (!cells[selectedCell].classList.contains('filled')) {
                cells[selectedCell].classList.add('fill-ans')
                cells[selectedCell].innerHTML += imageHTML
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
                if (isErrCell('err') || isInSolution()) {
                    errorCount += 1
                    gameError.innerHTML = `Errors: ${errorCount}/${CONSTANT.ERRORMAXCOUNT[CONSTANT.LEVEL[level_index] - 2]}`

                    setTimeout(() => {
                        console.log(selectedCell)
                        cells[selectedCell].classList.remove('zoom-in')
                        cells[selectedCell].classList.remove('err')
                        cells[selectedCell].classList.remove('fill-ans')
                        cells[selectedCell].setAttribute('data-value', 0)
                        cells[selectedCell].innerHTML = ''
                        console.log('before selectedCell', selectedCell)
                        selectedCell = -1
                        console.log('after selectedCell', selectedCell)
                    }, 1000)
                } else {
                    cells[selectedCell].classList.remove('zoom-in')
                    // check game win
                    if (isGameWin()) {
                        removeGameInfo()
                        showResult()
                    }
                    // ----
                }


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
    btnContinue.style.display = 'none'
}

function isGameWin() {
    return sudokuCheck(suAnswer)
}

function showResult() {
    clearInterval(timer)
    resultScreen.classList.add('active')
    resultTime.innerHTML = showTime(seconds)
}

function loadSudoku() {
    let game = getGameInfo()

    gameLevel.innerHTML = CONSTANT.LEVEL_NAME[game.level]

    su = game.su

    suAnswer = su.answer

    seconds = game.seconds
    gameTimer.innerHTML = showTime(seconds)

    level_index = game.level

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE

        cells[i].setAttribute('data-value', su_answer[row][col])
        cells[i].innerHTML = suAnswer[row][col] !== 0 ? suAnswer[row][col] : ''
        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled')
        }
    }
}

function clearCells() {
    for (let i = 0; i < CONSTANT.GRID_SIZE * CONSTANT.GRID_SIZE; i++) {
        cells[i].classList.remove('hover')
        cells[i].classList.remove('selected')
        cells[i].classList.remove('num-selected')
    }
    // setTimeout(() => {
    //     selectedCell = -1
    // }, 2000)
    //

}

//check to see if the number is correct in the solution
function isInSolution() {
    let isSolution = false
    let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE)
    let col = selectedCell % CONSTANT.GRID_SIZE

    let selectedCellGrid = parseInt(cells[selectedCell].getAttribute('data-value'))
    let selectedSolutionCellGrid = parseInt(su.original[row][col])
    console.log('selectedCellGrid', selectedCellGrid)
    console.log('selectedSolutionCellGrid', selectedSolutionCellGrid)
    if (selectedCellGrid !== selectedSolutionCellGrid) {
        isSolution = true
        cells[selectedCell].classList.add('err')
        cells[selectedCell].classList.add('cell-err')
        gameError.innerHTML = `Errors: ${errorCount}/${CONSTANT.ERRORMAXCOUNT[CONSTANT.LEVEL[level_index] - 2]}`
        setTimeout(() => {
            cells[selectedCell].classList.remove('cell-err')
            cells[selectedCell].classList.remove('err')
        }, 1000)
        
    }
    return isSolution
}

//---------------------------

init()





