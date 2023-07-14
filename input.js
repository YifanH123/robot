export class InputHandler {
    constructor(game) {
        this.canvas = document.getElementById('gamecanvas');
        this.game = game;
        this.keys = [];
        this.mousedown = false;
        this.position;
        window.addEventListener('keydown', (e) => {
            if ((   e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter')
                    && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
        /*
        window.addEventListener('click', (e) => {
            if (!this.mousedown) {
                this.mousedown = true;
            } else {
                this.mousedown = false;
            }
            var pos = getMousePos(document.getElementById("gamecanvas"), e);
            this.position = pos;
        });
        */
        window.addEventListener('mousedown', (e) => {
            if (this?.canvas && !this.canvas.hasAttribute("hidden")) {
            this.mousedown = true;
            this.game.player.teleport(this);
            }
        });
        window.addEventListener('mouseup', (e) => {
            this.mousedown = false;
        });
        window.addEventListener('mousemove', (e) => {
            var pos = getMousePos(document.getElementById("gamecanvas"), e);
            this.position = pos;
        });
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: (evt.clientX - rect.left),
                y: (evt.clientY - rect.top)
            }
        }
    }
}