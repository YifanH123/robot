export class Player {
    constructor(game){
        this.game = game;
        this.image = document.getElementById('player');
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 10;
    }
    update(input){
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
        try {
            var xcoord = (input.position.x - this.width/2) * input.position.sx,
                ycoord = (input.position.y - this.width/2) * input.position.sy,
                change = 10000;
            if ((xcoord - this.x) ** 2 + (ycoord - this.y) ** 2 <= change) {
                this.x = xcoord;
                this.y = ycoord;
            }
        }
        catch(err) {}
    }
    draw(context){
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.beginPath();
        context.arc(this.x + 50, this.y + 50,100,0,2 * Math.PI);
        context.stroke();
    }
}