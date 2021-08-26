import {
    CAP_FONT_SIZE, CAP_RADIOUS, CANVAS_FONT_STYLE, BUBBLE_RADIOUS, BUBBLE_FONT_SIZE,
    ANIMATION_FRAME_NUM
} from '../constant/constant';
import { getAnimationAdd } from '../utils/utils';
import Component from '../core/components/Component';

export default class Device extends Component {
    constructor() {
        super();
        this.visible = true;
        this.componentType = 'devices'; // 组件类型 device设备// 组件类型 device设备
        this.bgColor = '#ffffff';
        this.color = '#1F2429';
    }

    Create() {
        super.Create();
        const { state } = this;
        const deviceContent = state.deviceWidth;
        this.rectWidth = deviceContent.width - 2 * CAP_RADIOUS;
        this.textWidth = deviceContent.textWidth;
        this.text = deviceContent.text;
        this.visible = state.visible;
        this.hoverMore = false; // 鼠标移入 更多
        this.hoverBubble = false; // 鼠标移入 子级 节点数量
        // 获取bubbleText宽度
        this.context.font = `${BUBBLE_FONT_SIZE}px ${CANVAS_FONT_STYLE}`;
        this.bubbleTextWidth = state.data.allchildren ? this.context.measureText(`${state.data.allchildren}`).width : 0;
        this.bubbleAddWidth = this.bubbleTextWidth - 2 * BUBBLE_RADIOUS;
        if (this.bubbleAddWidth < 0) {
            this.bubbleAddWidth = 0;
        } else if (this.bubbleAddWidth > 0) {
            this.bubbleAddWidth += 8;
        }
        this.Update();
    }

    Update() {
        super.Update();
        this.visible = this.state.data.visible;
        if (this.visible && this.loaded) {
            const {
                state, scene, textWidth, text, rectWidth
            } = this;
            if (!state.currentPos) {
                state.currentPos = {
                    x: state.x,
                    y: state.y
                };
            } else {
                if (state.currentPos.x !== state.x) {
                    if (scene.frameNum <= 1) {
                        state.currentPos.x = state.x;
                    } else {
                        state.currentPos.x += getAnimationAdd(state.currentPos.x, state.x, scene.frameNum);
                    }
                }
                if (state.currentPos.y !== state.y) {
                    if (scene.frameNum <= 1) {
                        state.currentPos.y = state.y;
                    } else {
                        state.currentPos.y += getAnimationAdd(state.currentPos.y, state.y, scene.frameNum);
                    }
                }
            }
            const ctx = this.context;
            const radius = CAP_RADIOUS;
            const { currentPos } = state;
            // 画胶囊
            ctx.beginPath();
            this.drawCap();
            ctx.shadowColor = 'rgb(31, 36, 41, 0.1)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 2;
            ctx.shadowOffsetX = 0;
            ctx.fillStyle = state.data.active ? '#0091FF' : '#ffffff';
            ctx.fill();
            // 恢复设置
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            // 事件处理
            Object.keys(scene.eventMap).forEach(key => {
                const canvasEvent = scene.eventMap[key];
                if (canvasEvent.originEventType === 'mousemove') { // 移动事件 处理鼠标移入移出
                    if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                        if (!this.mouseIn) { // 上次不在组件内
                            this.mouseIn = true;
                            canvasEvent.eventType = 'mouseinCap';
                            scene.generalEventExecute(this, canvasEvent);
                        }
                        if (this.mouseIn) {
                            // 判定鼠标 有没有在 更多 按钮上
                            ctx.beginPath();
                            this.drawMoreArea();
                            if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                                this.hoverMore = true;
                            } else {
                                this.hoverMore = false;
                            }
                        } else {
                            this.hoverMore = false;
                        }
                        delete scene.eventMap[key];
                    } else if (this.mouseIn) { // 上次在组件内
                        this.mouseIn = false;
                        canvasEvent.eventType = 'mouseoutCap';
                        scene.generalEventExecute(this, canvasEvent);
                    }

                    // 判断是否在bubble内
                    this.drawBubbleArea();
                    if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                        this.hoverBubble = true;
                        this.scene.setCanvasCursor('pointer');
                        delete scene.eventMap[key];
                    } else {
                        this.hoverBubble = false;
                    }
                } else if (canvasEvent.originEventType === 'click') {
                    if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                        canvasEvent.eventType = 'clickCap';
                        if (this.mouseIn) {
                            // 判定鼠标点击 有没有在 更多 按钮上
                            ctx.beginPath();
                            this.drawMoreArea();
                            if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                                canvasEvent.eventType = 'clickMore';
                            }
                        }
                        scene.generalEventExecute(this, canvasEvent);
                        delete scene.eventMap[key];
                    }
                    if (this.hoverBubble) {
                        // 判断是否在bubble内
                        this.drawBubbleArea();
                        if (ctx.isPointInPath(canvasEvent.pos.x, canvasEvent.pos.y)) {
                            canvasEvent.eventType = 'clickExpand';
                            scene.generalEventExecute(this, canvasEvent);
                            delete scene.eventMap[key];
                        }
                    }
                }
            });
            // 画图标
            ctx.beginPath();
            ctx.arc(currentPos.x + radius, currentPos.y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = state.data.active ? '#007CDB' : '#E4E6E7';
            ctx.stroke();
            if (state.data.active) {
                ctx.fillStyle = '#4EB1FD';
                ctx.fill();
            }
            if (scene.svgImgs && scene.svgImgs[state.data.type]) {
                const promiseImg = state.data.active ? scene.svgImgs[`${state.data.type}active`] : scene.svgImgs[state.data.type];
                if (promiseImg) {
                    promiseImg.then(img => {
                        ctx.drawImage(img, currentPos.x + radius - img.width / 2, currentPos.y - img.height / 2);
                    });
                }
            }
            // 画文字
            ctx.font = `${CAP_FONT_SIZE}px ${CANVAS_FONT_STYLE}`;
            if (state.data.active) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = this.mouseIn ? '#0091FF' : '#1F2429';
            }
            ctx.textBaseline = 'middle';
            ctx.fillText(text, currentPos.x + 2 * radius + 8, currentPos.y + 1, textWidth);
            if (this.mouseIn) {
                this.scene.setCanvasCursor('pointer');
                if (!state.data.active) {
                    ctx.beginPath();
                    this.drawCap();
                    ctx.strokeStyle = '#0091FF';
                    ctx.stroke();
                }

                // 绘制 更多 按钮
                ctx.beginPath();
                ctx.arc(currentPos.x + rectWidth + radius + 2, currentPos.y - 5, 1.5, 0, 2 * Math.PI);
                ctx.arc(currentPos.x + rectWidth + radius + 2, currentPos.y, 1.5, 0, 2 * Math.PI);
                ctx.arc(currentPos.x + rectWidth + radius + 2, currentPos.y + 5, 1.5, 0, 2 * Math.PI);
                if (state.data.active) {
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = this.hoverMore ? '#0091FF' : '#646C73';
                }
                ctx.fill();
            }
            if (state.data.showChildrenNum && state.data.allchildren) {
                this.drawBubbleArea(true);
            }
        }
    }

    // 画胶囊
    drawCap() {
        const {
            state: { currentPos }, scene, textWidth, text, rectWidth
        } = this;
        const ctx = this.context;
        const radius = CAP_RADIOUS;
        ctx.moveTo(currentPos.x + radius, currentPos.y + radius);
        ctx.arc(currentPos.x + radius, currentPos.y, radius, 0.5 * Math.PI, 1.5 * Math.PI);
        ctx.lineTo(currentPos.x + radius, currentPos.y - radius);
        ctx.lineTo(currentPos.x + radius + rectWidth, currentPos.y - radius);
        ctx.arc(currentPos.x + radius + rectWidth, currentPos.y, radius, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.lineTo(currentPos.x + radius + rectWidth, currentPos.y + radius);
        ctx.lineTo(currentPos.x + radius, currentPos.y + radius);
    }

    // 画更多 的hover区域
    drawMoreArea() {
        const {
            state: { currentPos }, scene, textWidth, text, rectWidth
        } = this;
        const ctx = this.context;
        const radius = CAP_RADIOUS;
        ctx.rect(currentPos.x + rectWidth + radius - 4, currentPos.y - 8, 12, 16);
    }

    // 画 bubble
    drawBubbleArea(view) {
        const {
            state, scene, textWidth, text, rectWidth, bubbleAddWidth, bubbleTextWidth, state: { currentPos }
        } = this;
        const ctx = this.context;
        const radius = CAP_RADIOUS;
        const bubbleRadius = BUBBLE_RADIOUS;
        const start = {
            x: currentPos.x + 2 * radius + rectWidth + 8,
            y: currentPos.y
        };
        ctx.beginPath();
        ctx.moveTo(start.x + bubbleRadius, start.y + bubbleRadius);
        ctx.arc(start.x + bubbleRadius, start.y, bubbleRadius, 0.5 * Math.PI, 1.5 * Math.PI);
        ctx.lineTo(start.x + bubbleRadius, currentPos.y - bubbleRadius);
        ctx.lineTo(start.x + bubbleRadius + bubbleAddWidth, currentPos.y - bubbleRadius);
        ctx.arc(start.x + bubbleRadius + bubbleAddWidth, start.y, bubbleRadius, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.lineTo(start.x + bubbleRadius + bubbleAddWidth, start.y + bubbleRadius);
        ctx.lineTo(start.x + bubbleRadius, start.y + bubbleRadius);
        if (view) {
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = this.hoverBubble ? '#0091FF' : '#C3C7CB';
            ctx.fill();
            ctx.stroke();
            ctx.font = `${BUBBLE_FONT_SIZE}px ${CANVAS_FONT_STYLE}`;
            ctx.fillStyle = this.hoverBubble ? '#0091FF' : '#1F2429';
            ctx.textBaseline = 'middle';
            const allWidth = 2 * bubbleRadius + bubbleAddWidth;
            ctx.fillText(`${state.data.allchildren}`, start.x + (allWidth - bubbleTextWidth) / 2, start.y + 1, bubbleTextWidth);
        }
    }

    Destroy() {}
}
