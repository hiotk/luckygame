import Scene from '@/scenes/Scene';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class WebGLScene extends Scene {
    constructor() {
        super();
        this.models = [];
        this.Scene = new THREE.Scene();
    }

    Init(canvas) {
        if (!canvas) return;
        this.canvas = canvas;
        console.log(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.gl = this.canvas.getContext('webgl');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.canvasRangeEndPos = { x: this.canvasWidth, y: this.canvasHeight };
        this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, context: this.gl, antialias: true });
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.Create();
    }

    Create() {
    }

    Update() {
        if (this.renderer) {
            this.renderer.render(this.Scene, this.camera);
        }
        // this.context.drawImage(this.renderer.domElement, 0, 0);
    }

    updateModels() {
        const visibleModels = this.models.filter(model => model.visible);
        visibleModels.forEach(model => {
            if (!model.context) {
                model.parent = this;
                model.context = this.context;
                model.Scene = this.Scene;
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
