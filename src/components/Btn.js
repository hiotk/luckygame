import Component from '@/components/Component';

export default class Btn extends Component {
    constructor() {
        super();
        this.visible = true;
        this.color = 'orange';
        this.clickable = true;
        this.componentType = 'btn';
        this.touched = false;
        this.target = null;
        this.killed = false;
    }

    Create() {
        super.Create();
        this.load = true;
    }

    Update() {
        super.Update();
        this.state = this.store.state[this.componentType][this.id];
        if (this.visible && this.load) {
            this.context.beginPath();
            this.context.fillStyle = this.color;
            this.context.fillRect(this.state.x, this.state.y, this.state.width, this.state.height);
        }
    }

    onMouseDown(evt) {
        this.scene.history.push('/building', {});
    }

    Destroy() {}
}
