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

    constructor(fieldWidth) {
        this.shape = this.randomShape()
        console.log(this.shape)
        this.rotation = 0

        this.currentShape = this.shape.shapes[this.rotation]
        this.centerPos = {x: Math.floor(fieldWidth/2), y: Math.floor(this.currentShape.length/2)}
    }

    randomShape = () => SHAPES[Math.floor(Math.random() * SHAPES.length)]

    getPos = (x, y) => {
        let shapeCenter = {x: Math.floor(this.currentShape[0].length/2), y: Math.floor(this.currentShape.length/2)}
        return {x: this.centerPos.x + (x - shapeCenter.x), y: this.centerPos.y + (y - shapeCenter.y)}
    }

    rotate = () => {
        if(this.rotation+1 == this.shape.shapes.length) this.rotation = 0
        else this.rotation++

        this.currentShape = this.shape.shapes[this.rotation]
    }

    checkCollision = (field) => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                let absPos = this.getPos(j, i)
                // collides with anoteher shape
                if(this.currentShape[i][j] == 1 && field[absPos.y][absPos.x].collision()) return true
                // collides with the bottom
                if(this.currentShape[i][j] == 1 && absPos.y > field.length-1) return true
            }
        }
    }

    hideShape = (field) => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                let absPos = this.getPos(j, i)
                if(this.currentShape[i][j] == 1) field[absPos.y][absPos.x].setColor('black')
            }
        }
    }

    renderShape = (field) => {
        for (let i = 0; i < this.currentShape.length; i++) {
            for (let j = 0; j < this.currentShape[i].length; j++) {
                let absPos = this.getPos(j, i)
                if(this.currentShape[i][j] == 1) field[absPos.y][absPos.x].setColor(this.shape.color)
            }
        }
    }
}

// ================================================================================================

const Cell = class {
    constructor(span) {
        this.span = span
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
    // 2D array of spans
    // TODO: remove this 🤷🏿
    // playField = []
    // 2D array of `Cell` objects
    gameState = []

    width = 0
    height = 0

    constructor(rows, cols) {
        this.width = cols
        this.height = rows

        // span
        const span = document.createElement('span')
        span.classList.add('black')

        // table
        const table = document.createElement('table')
        table.classList.add('field')
        
        // create the field
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr')
            this.gameState[i] = []
            for (let j = 0; j < cols; j++) {
                this.gameState[i][j] = new Cell(span.cloneNode())
                row.appendChild(this.gameState[i][j].span)
            }
            table.appendChild(row)
        }
        document.getElementById('field-wrapper').appendChild(table)
    }
}


// ================================================================================================

const Game = class {
    // initialize field
    field = new Field(20, 10)
    score = 0

    // play game
    constructor() {
        this.shape = new Shape(this.field.width)
    }

    play() {
        return false
    }
}

// ================================================================================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}











var game = new Game()
game.shape.renderShape(game.field.gameState)


//field.playField[0][0].classList.add('yellow')
//field.playField[0][0].className = 'black'

// field.gameState[0][0].setColor('yellow')
// console.log(field.gameState[0][0].isFree())
// console.log(field.gameState[0][1].isFree())