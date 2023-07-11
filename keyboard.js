window.onload = function (){
    eventHandler = function (e){
        // left
        if (e.keyCode == 37){
            left = true;
            console.log("left");
        }
        // right
        else if (e.keyCode == 39){
            right = true;
            console.log("right");
        }
        // down
        else if (e.keyCode == 40){
            down = true;
            console.log("down");
        }
    }
    window.addEventListener('keydown', eventHandler, false);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}