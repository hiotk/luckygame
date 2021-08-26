import Component from '../core/components/Component';
import {
    LINE_JOIN_LEN, LINE_RADIOUS, LINE_OFFSETX
} from '../constant/constant';

export default class Line extends Component {
    constructor() {
        super();
        this.visible = true;
        this.componentType = 'lines'; // 组件类型 device设备
        this.drawDirection = 'right'; // 默认向右画
        this.inLine = false;
    }

    Create() {
        super.Create();
        this.isSpare = !this.state.from.data.spare && this.state.to.data.spare;
        this.prevTo = this.state.prevTo || null;
        this.Update();
    }

    Update() {
        super.Update();
        const { state, scene, isSpare } = this;
        this.order = state.order;
        if (state.from.currentPos.x > state.to.currentPos.x) {
            this.drawDirection = 'left';
            this.start = {
                x: state.from.currentPos.x - LINE_OFFSETX,
                y: state.from.currentPos.y
            };
            this.end = {
                x: state.to.currentPos.x + state.to.deviceWidth.width + LINE_OFFSETX,
                y: state.to.currentPos.y
            };
        } else {
            this.drawDirection = 'right';
            this.start = {
                x: state.from.currentPos.x + state.from.deviceWidth.width + LINE_OFFSETX,
                y: state.from.currentPos.y
            };
            this.end = {
                x: state.to.currentPos.x - LINE_OFFSETX,
                y: state.to.currentPos.y
            };
        }
        this.visible = this.state.to.data.visible;
        if (this.visible && this.loaded) {
            const ctx = this.context;
            const {
                start, end, drawDirection
            } = this;
            const branchWidth = LINE_JOIN_LEN;
            const lineRadius = LINE_RADIOUS;
            ctx.beginPath();
            ctx.strokeStyle = '#646C73';
            ctx.fillStyle = '#646C73';
            ctx.moveTo(start.x, start.y);
            if (this.order === 0) {
                if (drawDirection === 'left') {
                    ctx.lineTo(start.x - branchWidth, start.y);
                } else {
                    ctx.lineTo(start.x + branchWidth, start.y);
                }
                ctx.stroke();
            }
            ctx.beginPath();
            if (drawDirection === 'left') {
                ctx.moveTo(start.x - branchWidth, start.y);
            } else {
                ctx.moveTo(start.x + branchWidth, start.y);
            }
            if (start.y === end.y) {
                ctx.lineTo(end.x, end.y);
            } else if (start.y > end.y) {
                if (drawDirection === 'left') {
                    ctx.lineTo(start.x - branchWidth, end.y + lineRadius);
                    ctx.arc(start.x - branchWidth - lineRadius, end.y + lineRadius, lineRadius, 0, 1.5 * Math.PI, true);
                    ctx.moveTo(start.x - branchWidth - lineRadius, end.y);
                } else {
                    ctx.lineTo(start.x + branchWidth, end.y + lineRadius);
                    ctx.arc(start.x + branchWidth + lineRadius, end.y + lineRadius, lineRadius, 1 * Math.PI, 1.5 * Math.PI);
                    ctx.moveTo(start.x + branchWidth + lineRadius, end.y);
                }
            } else if (start.y < end.y) {
                if (drawDirection === 'left') {
                    ctx.lineTo(start.x - branchWidth, end.y - lineRadius);
                    ctx.arc(start.x - branchWidth - lineRadius, end.y - lineRadius, lineRadius, 0 * Math.PI, 0.5 * Math.PI);
                    ctx.moveTo(start.x - branchWidth - lineRadius, end.y);
                } else {
                    ctx.lineTo(start.x + branchWidth, end.y - lineRadius);
                    ctx.arc(start.x + branchWidth + lineRadius, end.y - lineRadius, lineRadius, 1 * Math.PI, 0.5 * Math.PI, true);
                    ctx.moveTo(start.x + branchWidth + lineRadius, end.y);
                }
            }
            ctx.lineTo(end.x, end.y);
            if (isSpare) {
                ctx.setLineDash([4, 4]);
            }
            ctx.stroke();

            // 画三角
            ctx.beginPath();
            if (drawDirection === 'left') {
                ctx.moveTo(start.x + 2, start.y);
                ctx.lineTo(start.x - 4, start.y + 4);
                ctx.lineTo(start.x - 4, start.y - 4);
            } else {
                ctx.moveTo(end.x + 2, end.y);
                ctx.lineTo(end.x - 4, end.y + 4);
                ctx.lineTo(end.x - 4, end.y - 4);
            }

            ctx.fill();
            // 恢复默认
            ctx.setLineDash([0, 0]);

            // 处理hover
            if (this.order === 0 && drawDirection !== 'left') {
                this.showStowBtn();
            }

            // 处理虚线hover
            if (isSpare) {
                this.drawLineArea();
            }
        }
    }

    drawLineArea() {
        const {
            state, scene, isSpare, start, end, drawDirection
        } = this;
        this.order = state.order;
        const ctx = this.context;
        const branchWidth = LINE_JOIN_LEN;
        const lineRadius = LINE_RADIOUS;
        const areaWidth = 6; // 区域宽度一半
        let prevY = this.prevTo ? this.prevTo.y : 0;
        if (prevY < 0) {
            prevY = 0;
        }
        ctx.beginPath();
        if (start.y === end.y) {
            if (drawDirection === 'left') {
                ctx.moveTo(end.x, end.y - areaWidth);
                ctx.rect(end.x, end.y - areaWidth, start.x - end.x, 2 * areaWidth);
            } else {
                ctx.moveTo(start.x + branchWidth, prevY - areaWidth);
                ctx.rect(start.x + branchWidth, prevY - areaWidth, end.x - start.x, 2 * areaWidth);
            }
        } else if (start.y < end.y) {
            if (drawDirection === 'left') { // 向左下弯曲
                ctx.moveTo(start.x - branchWidth, prevY);
                ctx.lineTo(start.x - branchWidth - areaWidth, prevY);
                ctx.lineTo(start.x - branchWidth - areaWidth, end.y - lineRadius);
                ctx.arc(start.x - branchWidth - lineRadius, end.y - lineRadius, lineRadius - areaWidth, 0, 0.5 * Math.PI);
                ctx.lineTo(end.x, end.y - areaWidth);
                ctx.lineTo(end.x, end.y + areaWidth);
                ctx.lineTo(start.x - branchWidth - lineRadius, end.y + areaWidth);
                ctx.arc(start.x - branchWidth - lineRadius, end.y - lineRadius, lineRadius + areaWidth, 0.5 * Math.PI, 0, true);
                ctx.lineTo(start.x - branchWidth + areaWidth, prevY);
                ctx.lineTo(start.x - branchWidth, prevY);
            } else { // 向右下弯曲
                ctx.moveTo(start.x + branchWidth, prevY);
                ctx.lineTo(start.x + branchWidth + areaWidth, prevY);
                ctx.lineTo(start.x + branchWidth + areaWidth, end.y - lineRadius);
                ctx.arc(start.x + branchWidth + lineRadius, end.y - lineRadius, lineRadius - areaWidth, 1 * Math.PI, 0.5 * Math.PI, true);
                ctx.lineTo(end.x, end.y - areaWidth);
                ctx.lineTo(end.x, end.y + areaWidth);
                ctx.lineTo(start.x + branchWidth + lineRadius, end.y + areaWidth);
                ctx.arc(start.x + branchWidth + lineRadius, end.y - lineRadius, lineRadius + areaWidth, 0.5 * Math.PI, 1 * Math.PI);
                ctx.lineTo(start.x + branchWidth - areaWidth, prevY);
                ctx.lineTo(start.x + branchWidth, prevY);
            }
        }
        // 占时只处理先下弯曲的线条
        // else if (start.y > end.y) {
        //     if (drawDirection === 'left') { // 向左上弯曲
        //         ctx.moveTo(start.x - branchWidth, start.y);
        //         ctx.lineTo(start.x - branchWidth - areaWidth, start.y);
        //         ctx.lineTo(start.x - branchWidth - areaWidth, end.y + lineRadius);
        //         ctx.arc(start.x - branchWidth - lineRadius, end.y + lineRadius, lineRadius - areaWidth, 0, 1.5 * Math.PI, true);
        //         ctx.lineTo(end.x, end.y + areaWidth);
        //         ctx.lineTo(end.x, end.y - areaWidth);
        //         ctx.lineTo(start.x - branchWidth - lineRadius, end.y - areaWidth);
        //         ctx.arc(start.x - branchWidth - lineRadius, end.y + lineRadius, lineRadius + areaWidth, 1.5 * Math.PI, 0);
        //         ctx.lineTo(start.x - branchWidth + areaWidth, start.y);
        //         ctx.lineTo(start.x - branchWidth, start.y);
        //     } else { // 向右上弯曲
        //         ctx.moveTo(start.x + branchWidth, start.y);
        //         ctx.lineTo(start.x + branchWidth + areaWidth, start.y);
        //         ctx.lineTo(start.x + branchWidth + areaWidth, end.y + lineRadius);
        //         ctx.arc(start.x + branchWidth + lineRadius, end.y + lineRadius, lineRadius - areaWidth, 1 * Math.PI, 1.5 * Math.PI);
        //         ctx.lineTo(end.x, end.y + areaWidth);
        //         ctx.lineTo(end.x, end.y - areaWidth);
        //         ctx.lineTo(start.x + branchWidth + lineRadius, end.y - areaWidth);
        //         ctx.arc(start.x + branchWidth + lineRadius, end.y + lineRadius, lineRadius + areaWidth, 1.5 * Math.PI, 1 * Math.PI, true);
        //         ctx.lineTo(start.x + branchWidth - areaWidth, start.y);
        //         ctx.lineTo(start.x + branchWidth, start.y);
        //     }
        // }
        // 事件处理
        Object.keys(scene.eventMap).forEach(key => {
            const canvasEvent = scene.eventMap[key];
            if (canvasEvent.originEventType === 'mousemove') { // 移动事件 处理鼠标移入移出
                if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                    if (isSpare) {
                        if (!this.inLine) {
                            this.inLine = true;
                            canvasEvent.eventType = 'mouseinSpare';
                            scene.generalEventExecute(this, canvasEvent);
                        }
                    }
                    delete scene.eventMap[key];
                } else if (this.inLine) {
                    this.inLine = false;
                    canvasEvent.eventType = 'mouseoutSpare';
                    scene.generalEventExecute(this, canvasEvent);
                }
            }
        });
    }

    showStowBtn() {
        const ctx = this.context;
        const {
            state, start, end, scene, drawDirection
        } = this;
        const branchWidth = LINE_JOIN_LEN;
        const lineRadius = LINE_RADIOUS;
        ctx.beginPath();

        if (drawDirection === 'left') {
            ctx.rect(start.x - branchWidth, start.y - 3, branchWidth, 6);
        } else {
            ctx.rect(start.x, start.y - 3, branchWidth, 6);
        }
        Object.keys(scene.eventMap).forEach(key => {
            const canvasEvent = scene.eventMap[key];
            if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                if (canvasEvent.originEventType === 'mousemove') { // 移动事件 处理鼠标移入移出
                    if (!this.mouseIn) { // 上次不在组件内
                        this.mouseIn = true;
                        // 先不暴露 mouseinJoin 鼠标移入焦点事件
                        // canvasEvent.eventType = 'mouseinJoin';
                        // scene.generalEventExecute(this, canvasEvent);
                    }
                    if (this.mouseIn) {
                        // 判定鼠标 有没有在 展开 按钮上
                        ctx.beginPath();
                        this.drawStowArea();
                        if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                            this.hoverStow = true;
                        } else {
                            this.hoverStow = false;
                        }
                    } else {
                        this.hoverStow = false;
                    }
                    delete scene.eventMap[key];
                } else if (canvasEvent.originEventType === 'click') {
                    if (this.mouseIn) {
                        // 判定鼠标点击 有没有在 展开 按钮上
                        ctx.beginPath();
                        this.drawStowArea();
                        if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                            canvasEvent.eventType = 'clickCollapse';
                            scene.generalEventExecute(this, canvasEvent);
                            delete scene.eventMap[key];
                        }
                    }
                }
            } else {
                if (canvasEvent.originEventType === 'mousemove' && this.mouseIn) { // 上次不在组件内
                    this.mouseIn = false;
                    this.hoverStow = false;
                    // canvasEvent.eventType = 'mouseoutJoin';
                    // scene.generalEventExecute(this, canvasEvent);
                }
            }
        });
        if (this.mouseIn) {
            this.drawStowArea();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            if (this.hoverStow) {
                scene.setCanvasCursor('pointer');
                ctx.strokeStyle = '#0091FF';
            }
            ctx.stroke();
            ctx.beginPath();
            if (drawDirection === 'left') {
                ctx.moveTo(start.x - branchWidth + 16, start.y);
                ctx.lineTo(start.x - branchWidth + 8, start.y);
            } else {
                ctx.moveTo(start.x + branchWidth - 16, start.y);
                ctx.lineTo(start.x + branchWidth - 8, start.y);
            }
            ctx.stroke();
        }
    }

    drawStowArea() {
        const ctx = this.context;
        const {
            state, start, end, scene,
            drawDirection
        } = this;
        const branchWidth = LINE_JOIN_LEN;
        const lineRadius = LINE_RADIOUS;
        ctx.beginPath();
        if (drawDirection === 'left') {
            ctx.arc(start.x - branchWidth + 12, start.y, 8, 0, 2 * Math.PI);
        } else {
            ctx.arc(start.x + branchWidth - 12, start.y, 8, 0, 2 * Math.PI);
        }
    }

    Destroy() {
    }
}
