const I = {
    shapes: [[[1, 1, 1, 1]],

            [[1],
             [1],
             [1],
             [1]]],

    color: 'cyan'
}

const J = {
    shapes: [[[1, 0, 0],
             [1, 1, 1]],

            [[1, 1],
             [1, 0],
             [1, 0]],

            [[1, 1, 1],
             [0, 0, 1]],

            [[0, 1],
             [0, 1],
             [1, 1]]],

    color: 'blue'
}

const L = {
    shapes: [[[0, 0, 1],
              [1, 1, 1]],
            
            [[1, 0],
             [1, 0],
             [1, 1]],

            [[1, 1, 1],
             [1, 0, 0]],

            [[1, 1],
             [0, 1],
             [0, 1]]],

    color: 'orange'
}

const O = {
    shapes: [[[1, 1],
              [1, 1]]],

    color: 'yellow'
}

const S = {
    shapes: [[[0, 1, 1],
              [1, 1, 0]],
            
            [[1, 0],
             [1, 1],
             [0, 1]]],

    color: 'green'
}

const T = {
    shapes: [[[0, 1, 0],
              [1, 1, 1]],

            [[1,0],
             [1,1],
             [1,0]],

            [[1, 1, 1],
             [0, 1, 0]],

            [[0, 1],
             [1, 1],
             [0, 1]]],

    color: 'purple'
}

const Z = {
    shapes: [[[1, 1, 0],
              [0, 1, 1]],
            
            [[0, 1],
             [1, 1],
             [1, 0]]],

    color: 'red'
}

const SHAPES = [I, J, L, O, S, T, Z]


const Shape = class {
    currentShape = []
    centerPos = {x: 0, y: 0}
    field = []

    constructor(field, shape) {
        this.field = field

        this.shape = shape
        console.log(this.shape)
        this.rotation = 0
        this.currentShape = this.shape.shapes[this.rotation]
        this.centerPos = {x: Math.floor(field[0].length/2), y: Math.floor(this.currentShape.length/2)}

        gameOver = this.checkCollision()
    }

    getPos = (x, y) => {
        let shapeCenter = {x: Math.floor(this.currentShape[0].length/2), y: Math.floor(this.currentShape.length/2)}
        return {x: this.centerPos.x + (x - shapeCenter.x), y: this.centerPos.y + (y - shapeCenter.y)}
    }


    checkCollision = () => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                // skip empty cells
                if(this.currentShape[i][j] == 0) continue

                let absPos = this.getPos(j, i)
                // collides with the bottom or top wall
                if(absPos.y > this.field.length-1 || absPos.y < 0) return true
                // collides with the left or right wall
                if(absPos.x < 0 || absPos.x > this.field[0].length-1) return true
                // collides with anoteher shape
                if(this.field[absPos.y][absPos.x].collision()) return true
            }
        }
        return false
    }

    hideShape = () => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                let absPos = this.getPos(j, i)
                if(this.currentShape[i][j] == 1) this.field[absPos.y][absPos.x].setColor('black')
            }
        }
    }

    renderShape = () => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                let absPos = this.getPos(j, i)
                if(this.currentShape[i][j] == 1) this.field[absPos.y][absPos.x].setColor(this.shape.color)
            }
        }
    }

    rotate = () => {
        if(this.rotation+1 == this.shape.shapes.length) this.rotation = 0
        else this.rotation++

        this.hideShape()

        this.currentShape = this.shape.shapes[this.rotation]

        if(this.checkCollision()) {
            if(this.rotation == 0) this.rotation = this.shape.shapes.length-1
            else this.rotation--
            this.currentShape = this.shape.shapes[this.rotation]
        }

        this.renderShape()
    }

    moveSideways = (left) => {
        const lastPos = Object.assign({}, this.centerPos)

        this.hideShape()

        if(left) this.centerPos.x--
        else this.centerPos.x++
        
        if(this.checkCollision()) {
            this.centerPos = lastPos
        }

        this.renderShape()
    }

    fall = () => {
        // in case of collision save last position and shape
        const lastPos = Object.assign({}, this.centerPos)
        const lastShape = Object.assign([], this.currentShape)

        this.hideShape()

        // update position
        this.centerPos.y++
        
        // check collision after updating position
        if(this.checkCollision()) {
            this.centerPos = lastPos
            this.currentShape = lastShape
            this.renderShape()
            return false
        }

        this.renderShape()
        return true
    }
}

// ================================================================================================

const Cell = class {
    constructor() {
        this.span = document.createElement('span')
        this.span.classList.add('black')
        this.color = 'black'
    }

    collision = () => this.color != 'black'

    setColor = (color) => {
        if(color == this.color) return

        this.span.className = 'black'
        if(color != 'black') this.span.classList.add(color)
        this.color = color
    }
}

// ------------------------------------------------------------------------------------------------

// used for rendering the game field
const Field = class {
    // 2D array of `Cell` objects
    gameState = []

    width = 0
    height = 0

    constructor(rows, cols, parent) {
        this.width = cols
        this.height = rows
        this.rows = 0
        this.rowCounter = document.getElementById('rows')
        this.rowCounter.innerHTML = this.rows
        
        // clear previous game
        parent.innerHTML = ''

        // table
        const table = document.createElement('table')
        table.classList.add('field')
        
        // create the field
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr')
            this.gameState[i] = []
            for (let j = 0; j < cols; j++) {
                this.gameState[i][j] = new Cell()
                row.appendChild(this.gameState[i][j].span)
            }
            table.appendChild(row)
        }
        parent.appendChild(table)
    }

    checkRows = () => {
        for(let i = 0; i < this.height; i++) {
            let full = true
            for(let j = 0; j < this.width; j++) {
                if(this.gameState[i][j].color == 'black') {
                    full = false
                    break
                }
            }
            if(full) {
                this.removeRow(i)
                this.rows++
                this.rowCounter.innerHTML = this.rows
            }
        }
    }

    removeRow = async (row) => {
        // show white row
        for(let j = 0; j < this.width; j++) {
            this.gameState[row][j].setColor('white')
        }
        
        document.getElementById('break').play()
        wait = true
        await sleep(250)
        
        // redraw rows
        for(let i = row; i > 0; i--) {
            for(let j = 0; j < this.width; j++) {
                this.gameState[i][j].setColor(this.gameState[i-1][j].color)
            }
        }
    }
}


// ================================================================================================
var gameOver = true
var paused = false
var wait = false

const Game = class {
    shape = undefined
    nextShape = undefined

    // play game
    constructor(height, width) {
        this.score = 0
        this.scoreCounter = document.getElementById('score')
        this.scoreCounter.innerHTML = this.score
        // initialize field
        this.field = new Field(height, width, document.getElementById('field-wrapper'))
        this.speed = 400

        // generate next shape
        this.newNextShape()
    }

    randomShape = () => SHAPES[Math.floor(Math.random() * SHAPES.length)]

    newNextShape = () => {
        this.nextShape = new Shape(nextShapeField.gameState, this.randomShape())
        this.nextShape.centerPos = {x: 2, y: 2}
        this.nextShape.renderShape()
    }

    getNextShape = () => {
        this.shape = new Shape(this.field.gameState, this.nextShape.shape)
        if(gameOver) {
            sleepInterrupt = true
            return
        }
        this.shape.renderShape()

        this.nextShape.hideShape()
        this.newNextShape()
    }

    async play() {
        while(!gameOver) {
            // get new shape
            if(this.shape == undefined) this.getNextShape()

            // fall shape
            while(this.shape.fall() && !paused) await tick(Math.floor(this.speed/50))
            
            // pause game
            if(paused) {
                return
            }

            // add score
            this.score++
            this.scoreCounter.innerHTML = this.score
            this.speed = 500 - this.score
            this.shape = undefined

            // destroy full rows
            this.field.checkRows()
            if(wait) {
                await sleep(500)
                wait = false
            }

            // create new shape
            this.getNextShape()
            await tick(10)
        }

        pauseBtn.hidden = true
        playBtn.hidden = false
        gameOverText.hidden = false
        song.pause()
        song.currentTime = 0;
        document.getElementById('gameOver').play()
    }
}

// ================================================================================================

var sleepInterrupt = false

// 1 tick = 50ms
async function tick(ticks) {
    while(ticks > 0 && !sleepInterrupt) {
        ticks--
        await sleep(50)
    }
    sleepInterrupt = false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const playBtn = document.getElementById('playBtn')
const pauseBtn = document.getElementById('pauseBtn')
const gameOverText = document.getElementById('game-over')
const song = document.getElementById('song')
song.volume = 0.1

function play() {
    playBtn.hidden = true
    pauseBtn.hidden = false
    paused = false
    song.play()

    if(gameOver) {
        gameOver = false
        gameOverText.hidden = true
        nextShapeField = new Field(4, 4, document.getElementById('next-wrapper'))
        game = new Game(20, 10)
        game.play()
    }
    else {
        game.play()
    }
}

function pause() {
    pauseBtn.hidden = true
    playBtn.hidden = false
    song.pause()

    if(!gameOver) {
        paused = true
        sleepInterrupt = true
    }
}

var nextShapeField = new Field(4, 4, document.getElementById('next-wrapper'))
var game = new Game(20, 10)