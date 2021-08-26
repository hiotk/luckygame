export default class Component {
    constructor() {
        this.scene = null; // 场景
        this.id = ''; // ui 组件唯一标识
        this.store = null; // 仓库
        this.state = null; // 数据
        this.context = null; // 画笔
        this.componentType = ''; // 组件类型
        this.index = Component.Index++; // 组件层级
        this.visible = false; // 组件可见性
        this.mouseIn = false; // 鼠标是否在当前对象上
    }

    Create() {
    }

    Update() {
    }

    Destroy() {
    }
}

Component.Index = 0;
