export class Object {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pieces = [];
        this.piecesX = [];
        this.piecesY = [];
        this.isBroken = false;
        this.breaking = document.getElementById('breakblock');
    }
    reset() {
        this.isBroken = false;
        this.pieces.length = 0;
    }
    break() {
        if (!this.isBroken) {
            this.breaking.currentTime = 0;
            this.breaking.volume = 0.3;
            this.breaking.play();
            this.isBroken = true;
            // Generate smaller pieces or split the obstacle into individual pieces
            // Example: Split the obstacle into four smaller rectangles
            const pieceWidth = this.width / 2;
            const pieceHeight = this.height / 2;
            this.piecesX = [this.x, this.x + pieceWidth];
            this.piecesY = [this.y, this.y + pieceHeight];
            // TODO: use for each loop to place pieces
            for (let i = 0; i < 1; i++) {
                this.piecesX.forEach(i => {
                    this.piecesY.forEach(j => {
                        var d = this.game.rectToPolar(i - this.game.player.x, j - this.game.player.y);
                        this.pieces.push(new ObstaclePiece(this.game,i,j,pieceWidth,pieceHeight,d.c));
                    });
                });
            }
        }
    }
    update() {
        if (this.isBroken) {
            // Update the broken pieces
            this.pieces.forEach(piece => piece.update());
        }
    }
    draw(context) {
        if (this.isBroken) {
            // Draw the broken pieces TODO: change color, distinct blocks
            this.pieces.forEach(piece => piece.draw(context));
        } else {
            // Draw the original obstacle
            context.fillStyle = "blue";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class ObstaclePiece {
    constructor(game, x, y, width, height, direction) {
        this.game = game;
        this.x = x;
        this.xI = x;
        this.y = y;
        this.yI = y;
        this.width = width;
        this.height = height;
        this.opacity = 1.0;
        this.rotationSpeed = Math.random() * 0.1 - 0.05; // Randomize rotation speed
        // initial velocity based on hit
        this.c = direction + Math.random() * 0.5 - 0.25;
        this.m = Math.random() * 10;
        var rect = this.game.polarToRect(this.m, this.c);
        this.velocityX = rect.x;
        this.velocityY = rect.y;
    }
    update() {
        var pos = this.game.resistance(this.x, this.y, this.velocityX, this.velocityY);
        this.x = pos.xpos;
        this.y = pos.ypos;
        this.velocityX = pos.vx;
        this.velocityY = pos.vy;
        if (this.opacity > 0.02) { this.opacity -= 0.02; }
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = "purple";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}