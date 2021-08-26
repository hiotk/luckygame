import { CLASSCODE_TO_TYPE } from '../../constant/constant';

export default class Store {
    constructor() {
        this.state = {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            updatedAt: Date.now(),
            treeData: {},
            devices: {},
            lines: {},
            actionIds: []
        };
        this.prefix = 'treenode:';
        this.loaded = false;
        this.deltaTime = 3 * 1000;
    }

    load() {
        this.restore();
        this.loaded = true;
    }

    persist() {
        // if (this.loaded === false) return;
        // const { prefix } = this;
        // const allKeys = [];
        // Object.keys(this.state).forEach(key => {
        //     const unitValue = JSON.stringify(this.state[key]);
        //     const unitKey = prefix + key;
        //     localStorage.setItem(unitKey, unitValue);
        // });
        // localStorage.setItem(`${prefix}store:allKeys`, JSON.stringify(allKeys));
    }

    restore() {
        // const { prefix } = this;
        // const allKeys = JSON.parse(localStorage.getItem(`${prefix}store:allKeys`) || '[]');
        // allKeys.forEach(key => {
        //     const value = localStorage.getItem(key);
        //     if (value != null && key.indexOf(prefix) === 0) {
        //         const unitKey = key.replace(prefix, '');
        //         const unitValue = JSON.parse(value);
        //         this.state[unitKey] = unitValue;
        //     }
        // });
    }

    pushActions(actions) {
        this.state.actions.push(actions);
    }

    popActions() {
        return this.state.actions.pop();
    }

    getState(key) {
        return this.state[key];
    }

    setState(key, state) {
        this.state[key] = state;
    }

    // 数据治理
    initTreeData(data) {
        data.showChildrenNum = false;
        data.active = true;
        data.name = data.localName;
        data.spare = false;
        data.visible = true;
        data.type = CLASSCODE_TO_TYPE[data.classCode] || 'G';
        data.allchildren = data.children && data.children.length && data.nextCount ? data.nextCount : 0;
        if (data.children && data.children.length) {
            this.updateChildren(data);
        }
        if (data.parentList && data.parentList.length) {
            this.updateParent(data);
        }
        console.log(data);
        this.state.treeData = data;
    }

    updateChildren(data) {
        data.children.forEach(c => {
            c.name = c.localName;
            c.showChildrenNum = false;
            c.active = false;
            c.visible = true;
            c.spare = !c.main;
            c.allchildren = c.children && c.children.length && c.nextCount ? c.nextCount : 0;
            c.type = CLASSCODE_TO_TYPE[c.classCode] || 'G';
            if (c.children && c.children.length) {
                this.updateChildren(c);
            }
        });
    }

    updateParent(data) {
        data.parentList.forEach(p => {
            p.name = p.localName;
            p.showChildrenNum = false;
            p.active = false;
            p.visible = true;
            p.spare = !p.main;
            p.allchildren = p.nextCount || 0;
            p.type = CLASSCODE_TO_TYPE[p.classCode] || 'G';
            if (p.parentList && p.parentList.length) {
                this.updateParent(p);
            }
        });
    }
}
