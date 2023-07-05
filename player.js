export class Player {
    constructor(game){
        this.game = game;
        this.image = document.getElementById('player');
        this.width = 100;
        this.height = 91.3;
        this.inner = 20;
        this.outer = 90;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 10;
        this.mouse = [0,0];
        this.end = [0,0];
        this.objects = [];
        this.objects.push(new Object(this.game,225,100,50,50));
        this.objects.push(new Object(this.game,225,300,50,50));
    }
    update(input){
        // collisions
        function checkCollision(x, y, width, block) {
            // Check for collision between player and block using bounding box collision detection
            if (
                x < block.x + block.width + width &&
                x + width > block.x &&
                y < block.y + block.height + width &&
                y + width > block.y
            ) {
                return true;
            }
            return false;
        }
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
        function checkInbound(x1,y1,x2,y2,c) {
            return (x1 - x2) ** 2 + (y1 - y2) ** 2 <= c;
        }
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
        try {
            var xcoord = (input.position.x),
                ycoord = (input.position.y),
                change = this.outer * this.outer;
            if (input.mousedown) {
                var collisions = false;
                for (let i = 0; i < this.objects.length; i++) {
                    collisions = collisions || checkCollision(xcoord, ycoord, this.inner, this.objects[i]);
                }
                if (checkInbound(xcoord,ycoord,this.x,this.y,change) && !collisions) {
                    this.x = xcoord;
                    this.y = ycoord;
                }
            }
            this.mouse = [input.position.x, input.position.y];
            if (checkInbound(xcoord,ycoord,this.x,this.y,change)) {
                this.end = this.mouse;
            } else {
                var a = findIntersectionCircle(this.x,this.y,this.outer,this.mouse[0],this.mouse[1]);
                this.end = [a.intersection1X + this.x, a.intersection1Y + this.y];
            }
        }
        catch(err) {}
    }
    draw(context){
        /*
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        */
        context.beginPath();
        context.arc(this.x, this.y, this.inner, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.arc(this.mouse[0], this.mouse[1], this.inner, 0, 2 * Math.PI);
        context.stroke()
        context.beginPath();
        context.arc(this.x, this.y, this.outer, 0, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.end[0],this.end[1]);
        context.stroke();
        for (let a in this.objects) {
            this.objects[a].draw(context);
        }
    }
}