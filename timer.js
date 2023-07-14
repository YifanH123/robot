export class Timer {
    constructor(game) {
        this.game = game;
        this.date = new Date();
        this.startTime = this.date.getTime();
        this.currentTime = this.date.getTime();
        this.time = 0;
        setInterval(function() {this.time += 1}, 1000);
    }
    Timer() {
        return this.time;
    }
}