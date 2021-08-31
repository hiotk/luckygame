export default class Application {
    constructor({ dom, history, store }) {
        this.dom = dom;
        this.store = store;
        this.history = history;
        this.loaded = false;
        this.storeDeltaTime = 1000;
        this.lastStoreTime = 0;
    }

    update() {
        requestAnimationFrame((timeRange) => {
            this.update();
        });
        this.history.current.scene.Update();
        if (Date.now() - this.lastStoreTime > this.storeDeltaTime) {
            this.lastStoreTime = Date.now();
            this.store.setState('updatedAt', this.lastStoreTime);
            this.store.persist();
        }
    }

    start() {
        this.store.load();
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.dom.appendChild(canvas);
        this.history.current.store = this.store;
        this.history.current.scene.Init(canvas);
        this.loaded = true;
        this.update();
    }
}
