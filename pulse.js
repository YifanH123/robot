export class Pulse {
    constructor(game) {
        this.game = game
        this.player = game.player
        this.stomp = document.getElementById('pulse');
        this.pulseInit = this.player.inner; // the starting point of the radius is set to diameter of player
        this.pulseR = 0;
        this.pulseV = 3;
        this.pulseMax = 40;
        this.pflag = false;
        this.pflag2 = false;
    }
    reset() {
        this.pulseR = 0;
        this.pulseV = Math.abs(this.pulseV);
        this.pflag = false;
        this.pflag2 = false;
    }
    update() {
        if (this.pflag) {
            if (this.pulseR >= this.pulseMax) {this.pulseV *= -1;}
            this.pulseR += this.pulseV;
            if (this.pulseR <= 0) {this.pflag = false; this.pulseR = this.pulseInit; this.pulseV = Math.abs(this.pulseV);}
        }
    }
    pulse(that) {
        this.stomp.currentTime = 0;
        this.stomp.play();
        this.game.obstacles.forEach(i => {
            if (this.game.checkCollision(that.x,that.y,this.pulseMax,i)) {
                i.break();
            }
        });
    }
    draw(context) {
        context.beginPath();
        context.arc(this.player.x, this.player.y, this.pulseR, 0, 2 * Math.PI);
        context.stroke();
    }
}