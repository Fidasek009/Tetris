window.onload = function (){
    eventHandler = async function (e){
        // left
        if(e.keyCode == 37){
            console.log("left")
            left()
        }
        // up
        else if(e.keyCode == 38){
            console.log("up")
            rotate()
        }
        // right
        else if(e.keyCode == 39){
            console.log("right")
            right()
        }
        // down
        else if (e.keyCode == 40){
            console.log("down")
            drop()
        }
    }
    window.addEventListener('keydown', eventHandler, false)
}


const rotate = () => {
    if(!gameOver && !wait && !paused) game.shape.rotate()
}

const drop = () => {
    if(!gameOver  && !paused) {
        game.speed = (game.speed > 50) ? 50 : 400
        sleepInterrupt = true
    }
}

const left = () => {
    if(!gameOver  && !wait && !paused) game.shape.moveSideways(true)
}

const right = () => {
    if(!gameOver  && !wait && !paused) game.shape.moveSideways(false)
}