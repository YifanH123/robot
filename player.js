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
        // horizontal movement
        this.x += this.vx;
        this.y += this.vy;
        if (input.includes('ArrowRight') && !(input.includes('ArrowLeft'))) this.vx = this.speed;
        else if (input.includes('ArrowLeft') && !(input.includes('ArrowRight'))) this.vx = -this.speed;
        else this.vx = 0;
        if (input.includes('ArrowUp') && !(input.includes('ArrowDown'))) this.vy = -this.speed;
        else if (input.includes('ArrowDown') && !(input.includes('ArrowUp'))) this.vy = this.speed;
        else this.vy = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
    }
    draw(context){
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}