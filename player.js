import { Bullet } from "./shoot.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('player');
        this.width = 100;
        this.height = 91.3;
        this.inner = 20;
        this.outer = 90;
        this.x = 250;
        this.y = 250;
        this.vx = 0;
        this.vy = 0;
        this.speed = 10;
        this.mouse = [this.x,this.y];
        this.end = [this.x,this.y];
        this.lastTimeFired = new Date().getTime();
        this.reloadTime = 100; // in milliseconds
    }
    reset() {
        this.x = 250;
        this.y = 250;
    }
    checkInbound(x1,y1,x2,y2,c) {
        return (x1 - x2) ** 2 + (y1 - y2) ** 2 <= c;
    }
    teleport(input) {
        var collisions = false;
        this.game.obstacles.forEach(o => {
            collisions = collisions || (this.game.checkCollision(xcoord, ycoord, this.inner, o) && !o.isBroken);
        });
        var xcoord = (input.position.x),
            ycoord = (input.position.y),
            change = this.outer * this.outer;
        if (this.checkInbound(xcoord,ycoord,this.x,this.y,change) && !collisions) {
            this.x = xcoord;
            this.y = ycoord;
            if (!pulse.pflag2) {
                this.game.pulse.pulse(this);
                this.game.pulse.pflag = true;
                this.game.pulse.pflag2 = true;
            }
        }
    }
    update(input, objects, pulse){
        /* movement
        this.x += this.vx;
        this.y += this.vy;
        // horizontal
        if (input.keys.includes('ArrowRight') && !(input.keys.includes('ArrowLeft'))) this.vx = this.speed;
        else if (input.keys.includes('ArrowLeft') && !(input.keys.includes('ArrowRight'))) this.vx = -this.speed;
        else this.vx = 0;
        // vertical
        if (input.keys.includes('ArrowUp') && !(input.keys.includes('ArrowDown'))) this.vy = -this.speed;
        else if (input.keys.includes('ArrowDown') && !(input.keys.includes('ArrowUp'))) this.vy = this.speed;
        else this.vy = 0;
        // boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        */
        // click
        function findIntersectionCircle(midx,midy,r,lendx,lendy){
            const a = lendx - midx;
            const b = lendy - midy;
            if (a >= 0) {
                if (b >= 0) {
                    var direction = Math.atan(b/a);
                } else {
                    var direction = Math.atan(b/a) + 2 * Math.PI;
                }
            } else {
                var direction = Math.atan((lendy - midy)/(lendx - midx)) + Math.PI;
            }
            return { intersection1X: Math.cos(direction) * r, intersection1Y: Math.sin(direction) * r };
        }
        /*
        if (this.pulseR >= this.pulseMax && this.pulseV >= 0) {this.pulseV *= -1;}
        if (this.pulseV >= 0) { this.pulseR += this.pulseV; }
        */
        try {
            var xcoord = (input.position.x),
                ycoord = (input.position.y),
                change = this.outer * this.outer;
            if (input.mousedown) {
                // check collisions
                var collisions = false;
                objects.forEach(o => {
                    collisions = collisions || (this.game.checkCollision(xcoord, ycoord, this.inner, o) && !o.isBroken);
                });
                // update if in range
                if (this.checkInbound(xcoord,ycoord,this.x,this.y,change) && !collisions) {
                    // moved into function
                } else {
                    if (new Date().getTime() - this.lastTimeFired > this.reloadTime) {
                        var newBullet = new Bullet(this.game);
                        newBullet.shoot();
                        this.game.bullets.push(newBullet);
                        this.lastTimeFired = new Date().getTime();
                    }
                }
            } else {
                pulse.pflag2 = false;
            }
            // line to cursor
            this.mouse = [input.position.x, input.position.y];
            if (this.checkInbound(xcoord,ycoord,this.x,this.y,change)) {
                this.end = this.mouse;
            } else {
                var a = findIntersectionCircle(this.x,this.y,this.outer,this.mouse[0],this.mouse[1]);
                this.end = [a.intersection1X + this.x, a.intersection1Y + this.y];
            }
        }
        catch(err) {
            console.log(err);
        }
    }
    draw(context){
        /*
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        */
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.x, this.y, this.inner, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.arc(this.mouse[0], this.mouse[1], this.inner, 0, 2 * Math.PI);
        context.stroke(); 
        context.beginPath();
        context.arc(this.x, this.y, this.outer, 0, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.end[0],this.end[1]);
        context.stroke();
    }
}