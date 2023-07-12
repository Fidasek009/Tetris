window.onload = function (){
    eventHandler = async function (e){
        // left
        if(e.keyCode == 37){
            console.log("left")
            if(!gameOver  && !wait && !paused) game.shape.moveSideways(true)
        }
        // up
        else if(e.keyCode == 38){
            console.log("up")
            if(!gameOver && !wait && !paused) game.shape.rotate()
        }
        // right
        else if(e.keyCode == 39){
            console.log("right")
            if(!gameOver  && !wait && !paused) game.shape.moveSideways(false)
        }
        // down
        else if (e.keyCode == 40){
            console.log("down")
            if(!gameOver  && !paused) {
                game.speed = (game.speed > 50) ? 50 : 400
                sleepInterrupt = true
            }
        }
    }
    window.addEventListener('keydown', eventHandler, false)
}