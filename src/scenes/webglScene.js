import Scene from '@/scenes/Scene';
import * as THREE from 'three';

export default class WebGLScene extends Scene {
    constructor() {
        super();
        this.models = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 0.1, 1000);
    }

    Init(canvas) {
        if (!canvas) return;
        this.canvas = canvas;
        this.canvas = canvas;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.canvasRangeEndPos = { x: this.canvasWidth, y: this.canvasHeight };
        this.context = canvas.getContext('2d', {
            antialias: true
        });
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.Create();
    }

    Create() {
    }

    Update() {}

    updateModels() {
        const visibleModels = this.models.filter(model => model.visible);
        visibleModels.forEach(model => {
            if (!model.context) {
                model.parent = this;
                model.context = this.context;
                model.scene = this.scene;
                model.store = this.store;
                model.camera = this.camera;
                model.state = this.store.state[model.modelType][model.id];
                model.Create();
            } else {
                model.Update();
            }
        });
    }

    Destroy() {}
}
