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

    constructor(field) {
        this.field = field
        this.shape = this.randomShape()
        console.log(this.shape)
        this.rotation = 0

        this.currentShape = this.shape.shapes[this.rotation]
        this.centerPos = {x: Math.floor(field[0].length/2), y: Math.floor(this.currentShape.length/2)}

        gameOver = this.checkCollision()
    }

    randomShape = () => SHAPES[Math.floor(Math.random() * SHAPES.length)]

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
        if(color == 'black') this.span.className = 'black'
        else this.span.classList.add(color)
        this.color = color
    }
}

// used for rendering the game field
const Field = class {
    // 2D array of `Cell` objects
    gameState = []

    width = 0
    height = 0

    constructor(rows, cols) {
        this.width = cols
        this.height = rows
        this.score = 0
        this.scoreCounter = document.getElementById('score')

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
        document.getElementById('field-wrapper').appendChild(table)
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
                this.score++
                this.scoreCounter.innerHTML = this.score
            }
        }
    }

    removeRow = (row) => {
        for(let i = row; i > 0; i--) {
            for(let j = 0; j < this.width; j++) {
                this.gameState[i][j].setColor(this.gameState[i-1][j].color)
            }
        }
    }
}


// ================================================================================================
var gameOver = false
var down = false

const Game = class {
    // initialize field
    field = new Field(20, 10)
    speed = 400

    // play game
    constructor() {
        this.speed = 400
    }

    async play() {
        while(!gameOver) {
            this.shape = new Shape(this.field.gameState)
            if(gameOver) break
            this.shape.renderShape()
            sleep(500)
            while(this.shape.fall()) await tick(this.speed/50)
            this.field.checkRows()
            this.speed = 400 - this.field.score*10
        }
        
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

var game = new Game()

game.play()

//field.playField[0][0].classList.add('yellow')
//field.playField[0][0].className = 'black'

// field.gameState[0][0].setColor('yellow')
// console.log(field.gameState[0][0].isFree())
// console.log(field.gameState[0][1].isFree())