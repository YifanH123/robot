export class Bullet {
    constructor(game) {
        this.game = game;
        this.player = this.game.player;
        this.x = this.player.x;
        this.y = this.player.y;
        this.speed = 5;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
        this.resistance = 1.001;
        this.isShot = false;
        this.shot = document.getElementById('pew');
        this.terminate = false;
    }
    shoot() {
        if (!this.isShot) {
            this.shot.currentTime = 0;
            this.shot.volume = 0.15;
            this.shot.play();
            this.isShot = true;
            var d = this.game.rectToPolar(this.player.mouse[0] - this.player.x, this.player.mouse[1] - this.player.y);
            var coord = this.game.polarToRect(this.speed, d.c);
            this.vx = coord.x;
            this.vy = coord.y;
        }
    }
    update() {
        if (this.isShot) {
            var pos = this.game.resistance(this.x,this.y,this.vx,this.vy,this.resistance);
            this.x = pos.xpos;
            this.y = pos.ypos;
            this.vx = pos.vx;
            this.vy = pos.vy;
            this.game.obstacles.forEach(i => {
                if (this.game.checkCollision(this.x,this.y,this.radius,i)) {
                    i.break();
                }
            });
        } else {
            this.x = this.player.x;
            this.y = this.player.y;
        }
        if (this.x + this.radius < 0 ||
            this.x > this.game.width + this.radius ||
            this.y + this.radius < 0 ||
            this.y > this.game.height + this.radius) {
                this.terminate = true;
        }
    }
    draw(context) {
        if (this.isShot) {
            context.beginPath();
            context.fillStyle = "green";
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.fill();
        }
    }
}