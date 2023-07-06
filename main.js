import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Object } from "./object.js";
import { Pulse } from "./pulse.js";

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
            this.pulse = new Pulse(this);
            this.obstacles = [];
            this.obstacles.push(new Object(this,225,100,50,50));
            this.obstacles.push(new Object(this,225,300,50,50));
        }
        // functions
        checkCollision(x, y, radius, block) {
            // Check for collision between player and block using bounding box collision detection
            if (
                x < block.x + block.width + radius &&
                x + radius > block.x &&
                y < block.y + block.height + radius &&
                y + radius > block.y
            ) {
                return true;
            }
            return false;
        }
        resistance(x, y, vx, vy) {
            vx = vx / 1.04;
            vy = vy / 1.04;
            return { xpos: x + vx, ypos: y + vy, vx: vx, vy: vy };
        }
        polarToRect(m, c) {
            return { x: m * Math.cos(c), y: m * Math.sin(c) };
        }
        rectToPolar(x, y) {
            if (x >= 0) {
                if (y >= 0) {
                    var direction = Math.atan(y/x);
                } else {
                    var direction = Math.atan(y/x) + 2 * Math.PI;
                }
            } else {
                var direction = Math.atan(y/x) + Math.PI;
                console.log(direction);
            }
            return { m: Math.sqrt(x * x + y * y), c: direction }
        }
        // update
        update(){
            this.player.update(this.input, this.obstacles, this.pulse);
            this.obstacles.forEach(object => {
                object.update();
            });
            this.pulse.update();
        }
        draw(context){
            this.player.draw(context);
            this.obstacles.forEach(object => {
                object.draw(context);
            });
            this.pulse.draw(context);
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
        // frame rate 60 fps https://www.codecademy.com/learn/learn-p5js/modules/p5js-animation/cheatsheet
    }
    animate();
});