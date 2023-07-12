window.onload = function (){
    eventHandler = async function (e){
        // left
        if(e.keyCode == 37){
            console.log("left")
            if(!gameOver) game.shape.moveSideways(true)
        }
        // up
        else if(e.keyCode == 38){
            console.log("up")
            if(!gameOver) game.shape.rotate()
        }
        // right
        else if(e.keyCode == 39){
            console.log("right")
            if(!gameOver) game.shape.moveSideways(false)
        }
        // down
        else if (e.keyCode == 40){
            console.log("down")
            if(!gameOver) {
                game.speed = 50
                sleepInterrupt = true
            }
        }
    }
    window.addEventListener('keydown', eventHandler, false)
}