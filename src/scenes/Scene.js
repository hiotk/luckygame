/* eslint-disable import/extensions */
export default class Scene {
    constructor() {
        this.store = null; // 数据存储对象
        this.history = null;

        this.dom = null; // canvas的容器

        /** 画布相关属性 */
        this.canvas = null; // canvas 对象
        this.context = null; // 画笔工具
        this.canvasWidth = 0; // 画布宽
        this.canvasHeight = 0; // 画布高
        this.canvasRangeStartPos = { x: 0, y: 0 };// canvas 画布左上点坐标
        this.canvasRangeEndPos = { x: 0, y: 0 };// canvas 画布右下点坐标

        /** 坐标相关属性 */
        this.scale = 1; // 缩放比例
        this.translateX = 0; // 坐标translate x值
        this.translateY = 0; // 坐标translate y值

        /** 画布元素相关属性 */
        this.children = []; // 存储 画布元素对象的数组

        /** 事件相关全局变量 */
        this._haveMoving = false; // 是否有移动,移动后屏蔽点击事件
        this.eventMap = {}; // 存储事件

        this.frameNum = 1; // 惰性帧数
    }

    Init(canvas) {
        if (!canvas) return;
        this.canvas = canvas;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.canvasRangeEndPos = { x: this.canvasWidth, y: this.canvasHeight };
        this.context = canvas.getContext('2d', {
            antialias: true
        });
        this.Create();
    }

    updateChildren() {
        const visibleChildren = this.children.filter(child => child.visible).sort((a, b) => {
            if (a._zIndex === b._zIndex) {
                return a.index < b.index;
            }
            return (a._zIndex > b._zIndex);
        });
        visibleChildren.forEach(child => {
            if (!child.loaded) {
                // 注入相关数据
                child.scene = this;
                child.context = this.context;
                child.state = this.store.state[child.componentType][child.id]; // 注入数据
                child.store = this.store; // 注入仓库
                child.loaded = true;
                child.Create();
            } else child.Update();
        });
    }

    Create() {
    }

    Update() {
        // 清除画布
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    Destroy() {
    }
}
