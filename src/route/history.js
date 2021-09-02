import Scene from '@/scenes/Scene';

export default {
    current: {
        path: '/', params: {}, scene: new Scene(), store: null
    },
    scenes: [],
    history: [],
    init() {
        this.current.scene.history = this;
    },
    addRoute(path, scene) {
        this.scenes.push({
            path,
            scene
        });
    },
    removeRoute(path) {
        const findIndex = this.scenes.findIndex(scene => scene.path === path);
        if (findIndex !== -1) {
            this.scenes.splice(findIndex, 1);
        } else {
            return false;
        }
    },
    push(path, params) {
        const findIndex = this.scenes.findIndex(scene => scene.path === path);
        if (findIndex !== -1) {
            const { scene } = this.scenes[findIndex];
            // 卸载当前场景
            this.current.scene.Destroy();
            scene.store = this.current.store;
            scene.params = params;
            // 初始化新的场景
            scene.Init(this.current.scene.canvas);
            // 保存新的场景
            this.current = {
                path,
                params,
                scene,
                store: this.current.store
            };
            this.current.scene.history = this;
            // 将新的场景放入历史堆栈中
            this.history.push(this.current);
            return this.current;
        }
        return false;
    },
    reset(path, params) {
        const findIndex = this.scenes.findIndex(scene => scene.path === path);
        if (findIndex !== -1) {
            const { scene } = this.scenes[findIndex];
            // 卸载当前场景
            this.current.scene.Destroy();
            // 初始化新的场景
            scene.Init(this.current.scene.canvas);
            // 保存新的场景
            this.current = {
                path,
                params,
                scene,
                store: this.current.store
            };
            this.current.scene.params = this.current.params;
            this.current.scene.store = this.current.store;
            this.current.scene.history = this;
            // 将新的场景放入历史堆栈中
            this.history = [this.current];
            return this.current;
        }
        return false;
    },
    pop() {
        if (this.history.length >= 1) {
            // 卸载当前场景
            this.current.scene.Destroy();
            // 回退到上一级
            return this.history.pop();
        }
        return false;
    },
    getCurrent() {
        return this.current;
    }
};
