import Component from '@/components/Component';

export default class Node extends Component {
    constructor() {
        super();
        this.visible = true;
        this.color = 'blue';
        this.clickable = true;
        this.componentType = 'node';
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
            if (this.state.killed) {
                this.context.fillStyle = 'yellow';
            } else if (this.state.touched) {
                this.context.fillStyle = 'green';
            } else {
                this.context.fillStyle = this.color;
            }
            this.context.fillRect(this.state.x, this.state.y, this.state.width, this.state.height);
        }
        if (this.state.target) {
            this.targetState = this.store.state[this.componentType][this.state.target];
            if (Math.abs(this.state.x - this.targetState.x) < this.state.width || Math.abs(this.state.y - this.targetState.y) < this.state.height) {
                this.store.state[this.componentType][this.state.target].killed = true;
            } else {
                // eslint-disable-next-line no-restricted-properties
                const distance = Math.sqrt(Math.pow(this.targetState.x - this.state.x, 2) + Math.pow(this.targetState.y - this.state.y, 2));
                this.state.x += (2 * (this.targetState.x - this.state.x)) / distance;
                this.state.y += (2 * (this.targetState.y - this.state.y)) / distance;
            }
        }
    }

    onMouseDown(evt, touchedObject) {
        if (touchedObject) {
            this.store.state[this.componentType][touchedObject.id].target = this.id;
        } else {
            this.state.touched = true;
            this.touched = true;
        }
    }

    Destroy() {}
}
