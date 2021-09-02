export default class Component {
    constructor() {
        this.id = '';
        this.scene = null;
        this.store = null;
        this.state = null;
        this.context = null;
        this.componentType = '';
        this.isComponent = true;
        this.index = Component.Index++;
        this.visible = false;
        this.clickable = false;
        this.load = false;
    }

    Create() {}

    isScope = ({ x, y }) => {
        this.state = this.store.state[this.componentType][this.id];
        return x >= this.state.x && x <= (this.state.x + this.state.width) && y >= this.state.y && y <= (this.state.y + this.state.height);
    }

    Update() {}

    Destroy() {}
}

Component.Index = 0;
