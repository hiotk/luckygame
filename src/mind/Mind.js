import Scene from '../core/scenes/Scene';
import Device from '../components/Device';
import Line from '../components/Line';
import { getDeviceWidth } from '../utils/utils';
import {
    CAP_RADIOUS, SINGLE_CHILD_OFFSETX, MULTIPLE_CHILD_OFFSETX, CHILD_OFFSETY, ANIMATION_FRAME_NUM
} from '../constant/constant';

export default class Mind extends Scene {
    Create() {
        // 子母映射
        this.childToParentMap = {};
        // 母子映射
        this.parentToChildrenMap = {};
        // 初始坐标
        this.initialX = 0;
        this.initialY = 0;
        // 最大，最小x,y
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.on('clickCollapse', (canvasEvent) => {
            this.toggleChildren(canvasEvent.targetCanvasElement.state.from.id);
        }).on('clickExpand', (canvasEvent) => {
            this.toggleChildren(canvasEvent.targetCanvasElement.state.id);
        });
    }

    setData(init) {
        const { treeData } = this.store.state;
        this.setParent(treeData, treeData.children);
        this.initTreeVisible(treeData);
        this.calculateChildrenPositions(treeData);
        this.calculateParentPositions(treeData);
        this.initTranslateCanvas();
        this.refresh(1);
    }

    setParent(parent, children) {
        this.parentToChildrenMap[parent.id] = children;
        children.forEach(c => {
            this.childToParentMap[c.id] = parent.id;
            if (c.children && c.children.length) {
                this.setParent(c, c.children);
            }
        });
    }

    /**
     * 初始化树的显示
     * @param {Object} treeData 树数据
     * @param {Boolean} visibleAll 是否显示全部节点
     */
    initTreeVisible(treeData, visibleAll) {
        let currentData = treeData,
            children = null;
        while (currentData) {
            if (currentData.children && currentData.children.length === 1) {
                currentData = currentData.children[0];
            } else {
                // eslint-disable-next-line prefer-destructuring
                children = currentData.children;
                currentData = null;
            }
        }
        if (children && children.length) {
            children.forEach(one => {
                one.showChildrenNum = !visibleAll;
                if (one.children && one.children.length) {
                    this.setChildrenVisibale(one.children, !!visibleAll);
                }
            });
        }
        this.calculateChildrenPositions(this.store.state.treeData);
    }

    setChildrenVisibale(children, visible) {
        children.forEach(one => {
            one.showChildrenNum = true;
            one.visible = visible;
            if (one.children && one.children.length) {
                this.setChildrenVisibale(one.children, false);
            }
        });
    }

    calculateChildrenPositions(treeData) {
        let areaHeight = 2 * CAP_RADIOUS;
        if (this.parentToChildrenMap[treeData.id]) {
            const l = this.parentToChildrenMap[treeData.id].filter(child => child.visible).length;
            if (l > 0) {
                areaHeight = l * (2 * CAP_RADIOUS + CHILD_OFFSETY) - CHILD_OFFSETY;
            }
        }
        if (this.store.state.devices[treeData.id]) {
            this.store.state.devices[treeData.id].data = treeData;
            this.store.state.devices[treeData.id].x = this.initialX;
            this.store.state.devices[treeData.id].y = this.initialY;
            this.store.state.devices[treeData.id].deviceWidth = getDeviceWidth(this.context, treeData.name);
            this.store.state.devices[treeData.id].areaHeight = areaHeight;
        } else {
            this.store.state.devices[treeData.id] = {
                data: treeData,
                id: treeData.id,
                x: this.initialX,
                y: this.initialY,
                deviceWidth: getDeviceWidth(this.context, treeData.name),
                areaHeight
            };
            this.createDevice(treeData.id);
        }

        this.minX = this.initialX;
        this.minY = this.initialY - CAP_RADIOUS;
        this.maxX = this.initialX + this.store.state.devices[treeData.id].deviceWidth.width;
        this.maxY = this.initialY + CAP_RADIOUS;
        this.deviceHeight = 2 * CAP_RADIOUS;
        this.initialChildrenPositions(treeData);
        this.updatePositions();
    }

    initialChildrenPositions(parent) {
        const parentDevice = this.store.state.devices[parent.id];
        const topY = parentDevice.y + CAP_RADIOUS - parentDevice.areaHeight / 2;
        const children = this.parentToChildrenMap[parent.id];
        const visiableChildren = children.filter(child => child.visible);
        const offsetX = visiableChildren.length > 1 ? parentDevice.x + parentDevice.deviceWidth.width + MULTIPLE_CHILD_OFFSETX : parentDevice.x + parentDevice.deviceWidth.width + SINGLE_CHILD_OFFSETX;
        visiableChildren.forEach((c, index) => {
            if (parentDevice) {
                let areaHeight = 2 * CAP_RADIOUS;
                if (this.parentToChildrenMap[c.id]) {
                    const l = this.parentToChildrenMap[c.id].filter(child => child.visible).length;
                    if (l > 0) {
                        areaHeight = l * (2 * CAP_RADIOUS + CHILD_OFFSETY) - CHILD_OFFSETY;
                    }
                }
                const deviceWidth = getDeviceWidth(this.context, c.name);
                if (this.store.state.devices[c.id]) {
                    this.store.state.devices[c.id].data = c;
                    this.store.state.devices[c.id].x = offsetX;
                    this.store.state.devices[c.id].y = topY + index * (2 * CAP_RADIOUS + CHILD_OFFSETY);
                    this.store.state.devices[c.id].deviceWidth = deviceWidth;
                    this.store.state.devices[c.id].areaHeight = areaHeight;
                } else {
                    this.store.state.devices[c.id] = {
                        data: c,
                        id: c.id,
                        x: offsetX,
                        y: topY + index * (2 * CAP_RADIOUS + CHILD_OFFSETY),
                        deviceWidth,
                        areaHeight
                    };
                    this.createDevice(c.id);
                }

                const maxX = offsetX + deviceWidth.width;
                const minY = this.store.state.devices[c.id].y;
                const maxY = this.store.state.devices[c.id].y + 2 * CAP_RADIOUS;
                if (maxX > this.maxX) {
                    this.maxX = maxX;
                }
                if (minY < this.minY) {
                    this.minY = minY;
                }
                if (maxY > this.maxY) {
                    this.maxY = maxY;
                }
                if (this.store.state.lines[`${parent.id}-${c.id}`]) {
                    // this.store.state.lines[`${parent.id}-${c.id}`].from = parentDevice;
                    // this.store.state.lines[`${parent.id}-${c.id}`].to = this.store.state.devices[c.id];
                } else {
                    let prevTo;
                    if (index > 0) {
                        prevTo = this.store.state.devices[children[index - 1]];
                    } else {
                        prevTo = null;
                    }

                    this.store.state.lines[`${parent.id}-${c.id}`] = {
                        id: `${parent.id}-${c.id}`,
                        from: parentDevice,
                        to: this.store.state.devices[c.id],
                        prevTo,
                        order: index
                    };
                    this.createLine(parent, c);
                }

                if (c.children && c.children.length) {
                    this.initialChildrenPositions(c, c.children);
                }
            }
        });
    }

    calculateParentPositions(child) {
        const childDevice = this.store.state.devices[child.id];
        const parentList = child.parentList.filter(p => p.visible);
        let topY = childDevice.y;
        if (parentList.length > 1) {
            topY = childDevice.y - CAP_RADIOUS - CHILD_OFFSETY / 2;
        }

        const offsetX = parentList.length > 1 ? childDevice.x - MULTIPLE_CHILD_OFFSETX : childDevice.x - SINGLE_CHILD_OFFSETX;
        parentList.forEach((p, index) => {
            const deviceWidth = getDeviceWidth(this.context, p.name);
            this.store.state.devices[p.id] = {
                data: p,
                id: p.id,
                x: offsetX - deviceWidth.width,
                y: topY + index * (2 * CAP_RADIOUS + CHILD_OFFSETY),
                deviceWidth,
                areaHeight: 2 * CAP_RADIOUS
            };
            this.createDevice(p.id);
            const minX = offsetX - deviceWidth.width;
            const minY = this.store.state.devices[p.id].y;
            const maxY = this.store.state.devices[p.id].y + 2 * CAP_RADIOUS;

            if (minX < this.minX) {
                this.minX = minX;
            }
            if (minY < this.minY) {
                this.minY = minY;
            }
            if (maxY > this.maxY) {
                this.maxY = maxY;
            }

            this.store.state.lines[`${p.id}-${childDevice.id}`] = {
                id: `${p.id}-${childDevice.id}`,
                from: childDevice,
                to: this.store.state.devices[p.id],
                order: index
            };
            this.createLine(p, childDevice);
            if (p.parentList && p.parentList.length) {
                this.calculateParentPositions(p, false);
            }
        });
    }

    createDevice(id) {
        const d = new Device();
        d.id = id;
        this.children.push(d);
    }

    createLine(to, form) {
        const l = new Line();
        l.id = `${to.id}-${form.id}`;
        this.children.push(l);
    }

    initTranslateCanvas() {
        const objectCenter = {
            x: (this.maxX + this.minX) / 2,
            y: (this.maxY + this.minY) / 2
        };
        this.setTranslate((this.canvasRangeStartPos.x + this.canvasRangeEndPos.x) / 2 - objectCenter.x, (this.canvasRangeStartPos.y + this.canvasRangeEndPos.y) / 2 - objectCenter.y);

        const scalex = (this.maxX - this.minX) / (this.canvasRangeEndPos.x - this.canvasRangeStartPos.x),
            scaley = (this.maxY - this.minY) / (this.canvasRangeEndPos.y - this.canvasRangeStartPos.y);
        let increment = 0;
        if (scalex > scaley) {
            if (scalex > 1) {
                increment = 1 / scalex - 1;
            }
        } else if (scaley > 1) {
            increment = 1 / scaley - 1;
        }
        this.changeScale(increment);
    }

    // 展开收起操作
    /**
     * 展开收起操作
     * @param {String} nodeKey 节点id
     * @param {Boolean} visible 可见性 不传则取反
     */
    toggleChildren(nodeKey, visible) {
        this.updateTreeVisible(nodeKey, visible);
        this.calculateChildrenPositions(this.store.state.treeData);
        // console.log(this.store.state.devices['1-2-3-1']);
    }

    /**
     * 展开收起计算
     * @param {String} nodeKey 节点id
     * @param {Boolean} visible 可见性 不传则取反
     */
    updateTreeVisible(nodeKey, visible) {
        const { treeData } = this.store.state;
        if (treeData.id === nodeKey) {
            treeData.showChildrenNum = visible ? false : !treeData.showChildrenNum;
            this.updateChildrenVisible(treeData, nodeKey, visible);
        } else {
            this.findChildrenByKey(treeData.children, nodeKey, visible);
        }
        // this.store.setState('treeData', treeData);
    }

    /**
     * 子节点展开收起计算
     * @param {Array} children 子节点列表
     * @param {String} nodeKey 节点id
     * @param {Boolean} visible 可见性 不传则取反
     */
    findChildrenByKey(children, nodeKey, visible) {
        children.forEach(c => {
            if (c.id === nodeKey) {
                c.showChildrenNum = visible ? false : !c.showChildrenNum;
                this.updateChildrenVisible(c, nodeKey, visible);
            } else if (c.children && c.children.length) {
                this.findChildrenByKey(c.children, nodeKey, visible);
            }
        });
    }

    /**
     * 子节点展开收起计算
     * @param {Object} data 子节点数据
     * @param {String} nodeKey 节点id
     * @param {Boolean} visible 可见性 不传则取反
     */
    updateChildrenVisible(data, nodeKey, visible) {
        if (data.id !== nodeKey) {
            data.visible = visible !== undefined ? visible : !data.visible;
        }

        if (data.children && data.children.length) {
            data.children.forEach(c => {
                if (c.children && c.children.length) {
                    this.updateChildrenVisible(c, nodeKey);
                } else {
                    c.visible = visible !== undefined ? visible : !c.visible;
                }
            });
        }
    }

    /**
     * 更新位置
     */
    updatePositions() {
        Object.keys(this.store.state.devices).forEach(k => {
            const selfAreaHeight = this.store.state.devices[k].areaHeight;
            const height = 2 * CAP_RADIOUS;
            if (selfAreaHeight > height) {
                const diff = selfAreaHeight - height;
                this.updateBrotherPositions(k, diff / 2);
            }
        });
    }

    /**
     * 更新兄弟节点的位置
     * @param {String} nodeKey
     * @param {Number} addHeight
     */
    updateBrotherPositions(nodeKey, addHeight) {
        const parentDevice = this.childToParentMap[nodeKey];
        if (parentDevice) {
            const childrenList = this.parentToChildrenMap[parentDevice].filter(c => c.visible),
                index = childrenList.findIndex((item) => item.id === nodeKey);
            childrenList.forEach((item, _index) => {
                let _offset = 0;
                if (_index < index) {
                    _offset = -addHeight;
                } else if (_index === index) {
                    return;
                } else if (_index > index) {
                    _offset = addHeight;
                }

                this.store.state.devices[item.id].y += _offset;
                const minY = this.store.state.devices[item.id].y;
                const maxY = this.store.state.devices[item.id].y + 2 * CAP_RADIOUS;
                if (minY < this.minY) {
                    this.minY = minY;
                }
                if (maxY > this.maxY) {
                    this.maxY = maxY;
                }
                const children = this.parentToChildrenMap[item.id];
                if (children) {
                    this.updateChildrenPositions(children, _offset);
                }
            });
            this.updateBrotherPositions(parentDevice, addHeight);
        }
    }

    /**
     * 更新子节点位置
     * @param {Array} children
     * @param {Number} offset
     */
    updateChildrenPositions(children, offset) {
        const visiableChildren = children.filter(c => c.visible);
        visiableChildren.forEach((item) => {
            this.store.state.devices[item.id].y += offset;
            const nextChildren = this.parentToChildrenMap[item.id];
            if (nextChildren) {
                this.updateChildrenPositions(nextChildren, offset);
            }
        });
    }

    /**
     * @override
     * 抽象方法重写; 被基类render方法调用
     * 渲染背景
     */
    Update() {
        if (this.canvas) {
            // 绘制背景
            const ctx = this.context;
            ctx.fillStyle = '#F8F9FA';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            for (let x = 12; x < this.canvasWidth + 22; x = x + 22) {
                for (let y = 12; y < this.canvasHeight + 22; y = y + 22) {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = '#E4E6E7';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // 提供给外部调用的方法
    /**
     * tree-node销毁时调用
     */
    Destroy() {
        super.Destroy();
    }

    /**
     *  展开所有下级
     */
    expandAll() {
        const { treeData } = this.store.state;
        this.initTreeVisible(treeData, true);
        this.refresh(ANIMATION_FRAME_NUM);
    }

    /**
     * 收起所有下级
     */
    collapseAll() {
        const { treeData } = this.store.state;
        this.initTreeVisible(treeData);
        this.refresh(ANIMATION_FRAME_NUM);
    }
}
