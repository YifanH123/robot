import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Object } from "./object.js";
import { Pulse } from "./pulse.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById('gamecanvas');
    const sideCanvas = this.document.getElementById('sidecanvas');
    const ctx = canvas.getContext('2d');
    const sideCtx = sideCanvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    sideCanvas.width = 200;
    sideCanvas.height = 500;
    const button = document.getElementById('resetbutton');

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
            this.obstacles.push(new Object(this,100,300,50,50));
            this.obstacles.push(new Object(this,100,100,50,50));
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
        reset() {
            console.log("1");
            this.player.reset();
            console.log("2");
            this.pulse.reset();
            console.log("3");
            this.obstacles.forEach(object => {
                object.reset();
            });
            console.log("4");
        }
        // update
        update(){
            this.player.update(this.input, this.obstacles, this.pulse);
            this.obstacles.forEach(object => {
                object.update();
            });
            this.pulse.update();
        }
        drawSide() {
            var maxSideNum = this.obstacles.length,
                filledSides = 0,
                radius = 60;
            this.obstacles.forEach(object => {
                if (object.isBroken) { filledSides += 1; }
            });
            if (maxSideNum == 2) {
                maxSideNum *= 2;
                filledSides *= 2;
            }
            if (maxSideNum == 1) {
                maxSideNum *= 12;
                filledSides *= 12; 
            }
            sideCtx.beginPath();
            sideCtx.moveTo(100+radius,250);
            for (let i = 1; i <= maxSideNum; i++) {
                var temp = this.polarToRect(radius,(i)/maxSideNum * 2 * Math.PI);
                sideCtx.lineTo(temp.x+100, temp.y+250);
            }
            sideCtx.fillStyle = "black";
            sideCtx.fill();
            sideCtx.beginPath();
            sideCtx.moveTo(100,250);
            for (let j = 0; j <= filledSides; j++) {
                var temp = this.polarToRect(radius,(j)/maxSideNum * 2 * Math.PI);
                sideCtx.lineTo(temp.x+100, temp.y+250);
            }
            sideCtx.fillStyle = "red";
            sideCtx.fill();
        }
        draw(){
            this.player.draw(ctx);
            this.obstacles.forEach(object => {
                object.draw(ctx);
            });
            this.pulse.draw(ctx);
            this.drawSide();
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);
    button.onclick = function(){game.reset();}

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(document.getElementById("background"),0,0);
        game.update();
        game.draw();
        requestAnimationFrame(animate);
        // frame rate 60 fps https://www.codecademy.com/learn/learn-p5js/modules/p5js-animation/cheatsheet
    }
    animate();
});