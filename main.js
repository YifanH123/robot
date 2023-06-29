import { Player } from "./player.js";
import { InputHandler } from "./input.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById('gamecanvas');
    const c = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
        }
        update(){
            this.player.update(this.input);
        }
        draw(context){
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    function animate(){
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.drawImage(document.getElementById("background"),0,0);
        game.update();
        game.draw(c);
        requestAnimationFrame(animate);
    }
    animate();
});