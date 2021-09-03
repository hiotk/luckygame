import Model from '@/models/Model';
import Wall from '@/models/wall';
import * as THREE from 'three';

export default class Building extends Model {
    constructor() {
        super();
        this.visible = true;
        this.modelType = 'building';
        this.children = [];
    }

    Create() {
        this.wall = new Wall();
        this.wall.id = 'wall1';
        this.store.state.wall.wall1 = {
            x: 0,
            y: 0,
            z: 0
        };
        this.children.push(this.wall);
        console.log(this.children);
    }

    Update() {
        this.updateChildren();
    }

    updateChildren() {
        const children = this.children.filter(child => child.visible);
        children.forEach(child => {
            if (!child.context) {
                child.parent = this;
                child.context = this.context;
                child.Scene = this.Scene;
                child.camera = this.camera;
                child.Create();
            } else {
                child.Update();
            }
        });
    }

    Destroy() {
    }
}
