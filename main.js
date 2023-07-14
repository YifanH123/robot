import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Object } from "./object.js";
import { Pulse } from "./pulse.js";
import { Bullet } from "./shoot.js";


window.addEventListener('load', function(){
    const canvas = document.getElementById('gamecanvas');
    const sideCanvas = this.document.getElementById('sidecanvas');
    const ctx = canvas.getContext('2d');
    const sideCtx = sideCanvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    sideCanvas.width = 200;
    sideCanvas.height = 500;
    const button1 = document.getElementById('resetbutton');
    const button2 = document.getElementById('pauseM');
    const startG = document.getElementById('start');
    // music
    var victoryM = document.getElementById("victory");

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.pulse = new Pulse(this);
            this.bullets = [];
            this.obstacles = [];
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min) + min);
            }
            var gridWidth = 3,
                gridHeight = 3,
                griddedX = this.width/gridWidth,
                griddedY = this.width/gridHeight;
            for (let i = 0; i < gridWidth; i++) {
                for (let j = 0; j < gridHeight; j++) {
                    var tempx = getRandomInt(i*griddedX,(i+1)*griddedX),
                        tempy = getRandomInt(j*griddedY,(j+1)*griddedY),
                        obby = [tempx,tempy,50,50];
                    if (this.checkInCanvas(canvas,obby) && !this.checkCollision(250,250,20,obby)) {
                        this.obstacles.push(new Object(this,obby[0],obby[1],obby[2],obby[3]));
                    }
                }
            }
        }
        // functions
        checkInCanvas(canvas, object) {
            if (object instanceof Object) {
                return (
                    object.x >= 0 &&
                    object.x + object.width <= canvas.width &&
                    object.y >= 0 &&
                    object.y + object.height <= canvas.height
                );
            }
            if (object instanceof Array) {
                return (
                    object[0] >= 0 &&
                    object[0] + object[2] <= canvas.width &&
                    object[1] >= 0 &&
                    object[1] + object[3] <= canvas.height
                );
            }
        }
        checkCollision(x, y, radius, object) {
            if (object instanceof Object) {
                return (
                    x < object.x + object.width + radius &&
                    x + radius > object.x &&
                    y < object.y + object.height + radius &&
                    y + radius > object.y
                );
            }
            if (object instanceof Array) {
                return (
                    x < object[0] + object[2] + radius &&
                    x + radius > object[0] &&
                    y < object[1] + object[3] + radius &&
                    y + radius > object[1]
                );
            }
        }
        resistance(x, y, vx, vy, res = 1.04) { // default for block breaking
            vx = vx / res;
            vy = vy / res;
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
            }
            return { m: Math.sqrt(x * x + y * y), c: direction }
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
            sideCtx.moveTo(100,250 - radius);
            for (let i = 1; i <= maxSideNum; i++) {
                var temp = this.polarToRect(radius,(i)/maxSideNum * 2 * Math.PI - Math.PI / 2);
                sideCtx.lineTo(temp.x+100, temp.y+250);
            }
            sideCtx.fillStyle = "black";
            sideCtx.fill();
            sideCtx.beginPath();
            sideCtx.moveTo(100,250);
            for (let j = 0; j <= filledSides; j++) {
                var temp = this.polarToRect(radius,(1-j/maxSideNum) * 2 * Math.PI - Math.PI / 2);
                sideCtx.lineTo(temp.x+100, temp.y+250);
            }
            sideCtx.fillStyle = "red";
            sideCtx.fill();
        }
        // update
        reset() {
            this.player.reset();
            this.pulse.reset();
            this.obstacles.forEach(object => {
                object.reset();
            });
        }
        update() {
            this.player.update(this.input, this.obstacles, this.pulse);
            this.obstacles.forEach(object => {
                object.update();
            });
            this.pulse.update();
            this.bullets = this.bullets.filter(object => {
                return !object.terminate;
            });
            this.bullets.forEach(object => {
                object.update();
            });
        }
        draw() {
            this.player.draw(ctx);
            this.obstacles.forEach(object => {
                object.draw(ctx);
            });
            this.pulse.draw(ctx);
            this.bullets.forEach(object => {
                object.draw(ctx);
            });
            this.drawSide();
        }
    }
    const game = new Game(canvas.width, canvas.height);
    console.log(game);
    victoryM.volume = 0.08;
    function startGame() {
        animate();
        victoryM.play();
        canvas.removeAttribute("hidden");
        sideCanvas.removeAttribute("hidden");
        startG.style.visibility = "hidden";
    }
    startG.onclick = startGame;
    button1.onclick = function(){ game.reset(); }
    button2.onclick = function(){
        if (victoryM.paused) {
            victoryM.play();
        } else {
            victoryM.pause();
        }
    }

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(document.getElementById("background"),0,0);
        game.update();
        game.draw();
        requestAnimationFrame(animate);
        // frame rate 60 fps
        // https://www.codecademy.com/learn/learn-p5js/modules/p5js-animation/cheatsheet
    }
});