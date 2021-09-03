import WebGLScene from '@/scenes/webglScene';
import Building from '@/models/building';
import * as THREE from 'three';

export default class BuildingScene extends WebGLScene {
    Create() {
        this.building = new Building();
        this.building.id = 'building1';
        this.store.state.building = {};
        this.store.state.wall = {};
        this.store.state.building.building1 = {
            x: 0,
            y: 0,
            z: 0
        };
        this.Scene.background = new THREE.Color(0x000000);
        this.Scene.add(new THREE.AmbientLight(0xffffff, 1));
        this.Scene.add(new THREE.DirectionalLight(0xffffff, 0.5));
        this.Scene.add(new THREE.AxesHelper(1));
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.Scene.add(cube);
        // this.models.push(this.building);
        console.log(this.models);
    }

    Update() {
        super.Update();
        this.updateModels();
    }

    Destroy() {
    }
}
