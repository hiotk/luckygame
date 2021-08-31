import Scene from '@/scenes/Scene';

export default class MainScene extends Scene {
    Create() {
    }

    Update() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'white';
        this.context.font = '30px Times New Roman';
        const text = 'main';
        const size = this.context.measureText(text);
        this.context.fillText(text, this.canvasWidth / 2 - size.width / 2, this.canvasHeight / 2);
    }

    Destroy() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}
