import Scene from '@/scenes/Scene';
import Preload from '@/utils/Preload';

export default class LoadScene extends Scene {
    Create() {
        this.percent = 0;
        this.context.fillStyle = 'yellow';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        const sources = [
            'assets/8728.png'
        ];
        this.preload = new Preload();
        console.log(this.preload);
        this.preload.sources.push(...sources);
        this.preload.preload();
    }

    Update() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'yellow';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'black';
        this.context.font = '30px Times New Roman';
        const text = `${this.percent.toFixed(2)}%`;
        const size = this.context.measureText(text);
        this.context.fillText(text, this.canvasWidth / 2 - size.width / 2, this.canvasHeight / 2);
        this.percent = this.preload.percent;
        if (this.percent === 100) {
            this.history.push('/main', {});
        }
    }

    Destroy() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}
