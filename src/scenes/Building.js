import WebGLScene from '@/scenes/webglScene';
import Building from '@/models/building';

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
        this.models.push(this.building);
        console.log(this.models);
    }

    Update() {
        this.updateModels();
    }

    Destroy() {
    }
}
