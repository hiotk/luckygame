import Model from '@/models/Model';

export default class Wall extends Model {
    constructor() {
        super();
        this.visible = true;
        this.modelType = 'wall';
    }

    Create() {
        this.Preload('./assets/F1-外墙.FBX');
    }

    Update() {

    }

    Destroy() {

    }
}
