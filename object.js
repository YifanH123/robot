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
    }
    break() {
        if (!this.isBroken) {
            this.isBroken = true;
            // Generate smaller pieces or split the obstacle into individual pieces
            // Example: Split the obstacle into four smaller rectangles
            const pieceWidth = this.width / 2;
            const pieceHeight = this.height / 2;
            this.piecesX = [this.x, this.x + pieceWidth];
            this.piecesY = [this.y, this.y + pieceHeight];
            // TODO: use for each loop to place pieces
            this.piecesX.forEach(i => {
                this.piecesY.forEach(j => {
                    this.pieces.push(new ObstaclePiece(i,j,pieceWidth,pieceHeight));
                });
            });
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
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class ObstaclePiece {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = Math.random() * 10 - 5; // Example: Randomize initial velocity
        this.velocityY = Math.random() * 10 - 5;
        this.rotationSpeed = Math.random() * 0.1 - 0.05; // Example: Randomize rotation speed
    }
  
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        // Apply any other desired transformations or physics updates to simulate the broken piece behavior
    }
  
    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height);
        // Apply any other desired drawing or visual effects to represent the broken piece
    }
}