export class Object {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    update() {
        return { x: this.x, y: this.y };
    }
    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
    }
}