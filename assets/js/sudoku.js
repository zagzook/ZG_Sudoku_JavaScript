function newGrid(size) {
    let arr = new Array(size)

    for (let i = 0; i < size; i++) {
        arr[1] = new Array(size)
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED
    }

    return arr
}