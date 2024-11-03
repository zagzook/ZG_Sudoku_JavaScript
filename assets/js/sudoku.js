import {CONSTANT} from './constant.js'
import {nineDigits, boardIndex, solutionIndex} from './boards/nineDigit.js'
import {
    easyBoardTemplate,
    easySolution,
    normalBoardTemplate,
    normalSolution,
    hardBoardTemplate,
    hardSolution
} from './boards/nineRegularBoards.js'

function newGrid(size) {
    let arr = new Array(size)

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size)
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED
    }

    return arr
}

//=============================

//check duplicate number in col
const isColSafe = (grid, col, value) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false
    }
    return true
}
//=============================

//check duplicate number in row
const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false
    }
    return true
}
//=============================

//check duplicate number in box-grid
// check duplicate number in 3x3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + box_row][col + box_col] === value) return false
        }
    }
    return true
}

// check in row, col and 3x3 box
const isSafe = (grid, row, col, value) => {
    return isColSafe(grid, col, value) &&
        isRowSafe(grid, row, value) &&
        isBoxSafe(grid, row - row % 3, col - col % 3, value) &&
        value !== CONSTANT.UNASSIGNED
}
//=============================

// find unassigned cell
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row
                pos.col = col
                return true
            }
        }
    }
    return false
}
//=============================

// shuffle arr
const shuffleArray = (arr) => {
    let curr_index = arr.length

    while (curr_index !== 0) {
        let rand_index = Math.floor(Math.random() * curr_index)
        curr_index -= 1

        let temp = arr[curr_index]
        arr[curr_index] = arr[rand_index]
        arr[rand_index] = temp
    }

    return arr
}
//=============================

// check puzzle is complete
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED
        })
    })
}
//=============================

const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true

    let number_list = shuffleArray([...CONSTANT.NUMBERS])

    let row = unassigned_pos.row
    let col = unassigned_pos.col

    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num

            if (isFullGrid(grid)) {
                return true
            } else {
                if (sudokuCreate(grid)) {
                    return true
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED
        }
    })

    return isFullGrid(grid)
}
//=============================

export const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)) {
                if (isFullGrid(grid)) {
                    return true
                } else {
                    if (sudokuCreate(grid)) {
                        return true
                    }
                }
            }
        })
    })

    return isFullGrid(grid)
}
//=============================

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE)
//=============================

const removeCells = (grid, level) => {
    let res = [...grid]
    let attemps = level
    while (attemps > 0) {
        let row = rand()
        let col = rand()
        while (res[row][col] === 0) {
            row = rand()
            col = rand()
        }
        res[row][col] = CONSTANT.UNASSIGNED
        attemps--
    }
    return res
}
//=============================

// generate sudoku base on level
export const sudokuGen = (level) => {

    let puzzleBoard = undefined
    let puzzleSolution = undefined

    switch (level) {
        case 4:

            puzzleBoard = hardBoardTemplate[boardIndex]
            puzzleSolution = hardSolution[solutionIndex]
            break
        case 3:

            puzzleBoard = normalBoardTemplate[boardIndex]
            puzzleSolution = normalSolution[solutionIndex]
            break
        default:

            puzzleBoard = easyBoardTemplate[boardIndex]
            puzzleSolution = easySolution[solutionIndex]
    }

    shuffleNumbers()

    let puzzleSolutionArray = replaceSolution(puzzleSolution.split('').map(Number))
    puzzleSolution = puzzleSolutionArray.join('')
    let puzzleBoardArray = replaceBoard(puzzleBoard.split('').map(Number), puzzleSolution.split('').map(Number))
    puzzleBoard = puzzleBoardArray.join('')
    let sudoku = breakDown(puzzleSolution)
    let check = sudokuCreate(sudoku)
    console.log('puzzleBoard', puzzleBoard)
    console.log('puzzleSolution', puzzleSolution)
    if (check) {
        let question = breakDown(puzzleBoard)
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined
}

const breakDown = (board, type = 'number') => {
    if (type === 'Alpha') {
        const charMapping = {
            1: 'A',
            2: 'B',
            3: 'C',
            4: 'D',
            5: 'E',
            6: 'F',
            7: 'G',
            8: 'H',
            9: 'I',
            10: 'J',
            11: 'K',
            12: 'L'
        }
        let resultString = ''
        for (let i = 0; i < board.length; i++) {
            const currentChar = board[i]
            const mappedChar = charMapping[currentChar] || currentChar // Use the mapped value or keep the original character
            resultString += mappedChar
        }
        board = resultString
    }
    const newBoard = []
    let temprow = []
    for (let i = 0; i < board.length + 1; i++) {
        if ((i + 1) % 9 === 0) {
            if (i !== 0) {
                temprow.push(parseInt(board[i]))
                newBoard.push(temprow)
                temprow = []
            } else {
                temprow.push(parseInt(board[i]))
            }
        } else {
            temprow.push(parseInt(board[i]))
        }
    }
    return newBoard
}
// this will determine if the board is letters or word or numbers
const getBoardType = (board, type) => {
}

// function shuffleString(str) {
//     // Convert the string to an array of characters
//     const arr = str.split('')
//
//     // Implement the Fisher-Yates shuffle algorithm
//     for (let i = arr.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         // Swap the characters at indices i and j
//         [arr[i], arr[j]] = [arr[j], arr[i]]
//     }
//
//     // Join the shuffled array back into a string
//     return arr.join('')
// }

function shuffleNumbers() {
    return shuffleArray(nineDigits)
}


function replaceSolution(solution) {
    const newShuffledArray = shuffleNumbers()
    for (let i = 0; i < CONSTANT.GRID_SIZE * CONSTANT.GRID_SIZE; i++) {
        //console.log('Before: ', solution[i])
        solution[i] = newShuffledArray[solution[i] - 1]
        //console.log('After: ', solution[i])
    }

    return solution
}

function replaceBoard(board, solution) {
    for (let i = 0; i < CONSTANT.GRID_SIZE * CONSTANT.GRID_SIZE; i++) {

        if (board[i] === 1) {
            board[i] = solution[i]
        } else {
            board[i] = 0
        }
    }
    return board
}


// Example usage:
function testArray() {
    const numString = '123456789'
    const shuffledString = shuffleString(numString)
    console.log(shuffledString)

}