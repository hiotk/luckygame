import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

export default class Model {
    constructor() {
        this.visible = false;
        this.isModel = true;
        this.mesh = null;
        this.scene = null;
        this.load = false;
        this.modelType = '';
        this.store = null;
        this.position = { x: 0, y: 0, z: 0 };
    }

    createMaterials(data) {
        const matArray = [];
        for (let i = 0; i < data.material.length; i++) {
            const mat = new THREE.MeshPhongMaterial({});
            mat.copy(data.material[i]);
            matArray.push(mat);
        }
        return matArray;
    }

    Preload(url) {
        if (this.load) return;
        const self = this;
        const loader = new FBXLoader();
        loader.load(url, (object) => {
            console.log(object);
            if (object.type === 'Group') {
                const data = object.children[0];
                const matArray = this.createMaterials(data);
                this.mesh = new THREE.Mesh(data.geometry, matArray);
                this.mesh.position.set(0, 0, 0);
                console.log(this.mesh);
                console.log(this.scene);
                this.scene.add(this.mesh);
            }
            self.load = true;
        });
    }

    Create() {

    }

    Update() {

    }

    Destroy() {

    }
}
