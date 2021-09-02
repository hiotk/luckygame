import Scene from '@/scenes/Scene';
import Node from '@/components/Node';
import Btn from '@/components/Btn';
export default class MainScene extends Scene {
    Create = () => {
        const self = new Node();
        self.id = 'self';
        this.store.state.node = {};
        this.store.state.btn = {};
        this.store.state.node.self = {
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            speed: 2
        };
        this.children.push(self);
        const enemy = new Node();
        enemy.id = 'enemy';
        enemy.color = 'red';
        this.store.state.node.enemy = {
            x: 300,
            y: 300,
            width: 50,
            height: 50,
            speed: 2
        };
        this.children.push(enemy);

        const btn = new Btn();
        btn.id = 'btn1';
        this.store.state.btn.btn1 = {
            x: 400,
            y: 0,
            width: 100,
            height: 50
        }
        this.children.push(btn)
        this.bindEvent();
    }

    unbindEvent = () => {
        this.canvas.removeEventListener('mousedown', this.onMouseDown, {
            capture: true,
            passive: false,
            once: false
        });
        this.canvas.removeEventListener('mouseup', this.onMouseUp, {
            capture: true,
            passive: false,
            once: false
        });
    }

    onMouseDown = (evt) => {
        console.log(evt);
        console.log(this.children);
        const position = { x: evt.offsetX, y: evt.offsetY };
        const children = this.children.filter(child => child.clickable && child.isScope(position));
        const touchedObject = this.children.find(child => child.touched)
        children.forEach(child => {
            child.onMouseDown(evt, touchedObject);
        });
    }

    onMouseUp = (evt) => {}

    bindEvent() {
        // 注册事件
        this.canvas.addEventListener('mousedown', this.onMouseDown, {
            capture: true,
            passive: false,
            once: false
        });
        this.canvas.addEventListener('mouseup', this.onMouseUp, {
            capture: true,
            passive: false,
            once: false
        });
    }

    Update() {
        super.Update();
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'white';
        this.context.font = '30px Times New Roman';
        const text = 'main';
        const size = this.context.measureText(text);
        this.context.fillText(text, this.canvasWidth / 2 - size.width / 2, this.canvasHeight / 2);
        this.updateChildren();
    }

    Destroy() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.unbindEvent();
    }
}
