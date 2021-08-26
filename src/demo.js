import Application from 'src/core/application/Application'; // 应用模块
import Store from 'src/core/store/Store'; // 数据存储
import Mind from 'src/mind/Mind'; // 数据存储单元

import treeNode from './index';

const originTree = {
    children: [
        {
            children: [{
                id: '1-2-3-2-1',
                localName: '低压末端配电柜-1-2-3-2-1',
                main: true,
                classCode: 'SETDLT',
                nextCount: 5,
                children: []
            },
            {
                children: [],
                id: '1-2-3-3-2',
                localName: '低压末端配电柜-1-2-3-3-2',
                main: true,
                classCode: 'SETDLT',
                nextCount: 5
            }],
            id: '1-2-3-1',
            localName: '低压末端配电柜-1-2-3-1',
            main: true,
            classCode: 'SETDLT',
            nextCount: 5
        },
        {
            children: [
                {
                    children: [],
                    id: '2-2-3-3-2',
                    localName: '低压末端配电柜-1-2-3-3-2',
                    main: true,
                    classCode: 'SETDLT',
                    nextCount: 5
                },
                {
                    children: [],
                    id: '2-2-3-3-3',
                    localName: '低压末端配电柜-1-2-3-3-3',
                    main: true,
                    classCode: 'SETDLT',
                    nextCount: 5
                }
            ],
            id: '1-2-3-2',
            localName: '低压末端配电柜-1-2-3-2',
            main: true,
            classCode: 'SETDLT',
            nextCount: 5
        },
        {
            children: [],
            id: '1-2-3-3',
            localName: '低压末端配电柜-1-2-3-3',
            main: true,
            classCode: 'SETDLT',
            nextCount: 5
        },
        {
            children: [{
                children: [],
                id: '3-2-3-3-2',
                localName: '低压末端配电柜-3-2-3-3-2',
                main: true,
                classCode: 'SETDLT',
                nextCount: 5
            },
            {
                children: [],
                id: '3-2-3-3-3',
                localName: '低压末端配电柜-3-2-3-3-3',
                main: true,
                classCode: 'SETDLT',
                nextCount: 5
            }],
            id: '1-2-3-4',
            localName: '低压末端配电柜-1-2-3-4',
            main: true,
            classCode: 'SETDLT',
            nextCount: 5
        },
        {
            children: [],
            id: '1-2-3-5',
            localName: '低压末端配电柜-1-2-3-4',
            main: false,
            classCode: 'SETDLT',
            nextCount: 5
        }
    ],
    id: '1-2-3',
    localName: '配电抽屉-1-2-3',
    nextCount: 5,
    classCode: 'SETDLSDW',
    parentList: [
        {
            id: '1-2',
            localName: '低压配电柜-1-2',
            main: true,
            classCode: 'SETDLF',
            parentList: [
                {
                    id: '1',
                    localName: '变压器-t1',
                    main: true,
                    classCode: 'SETDTF',
                    parentList: []
                }
            ]
        },
        {
            id: '2-2',
            localName: '低压配电柜-2-2',
            main: false,
            classCode: 'SETDLF',
            parentList: [
                {
                    id: '2',
                    localName: '变压器-t1',
                    main: true,
                    classCode: 'SETDTF',
                    parentList: []
                }
            ]
        }
    ]
};

window.app = new treeNode.Application({
    dom: document.getElementById('warp'),
    scene: new treeNode.Mind(),
    store: new treeNode.Store()
});

/**
 *  支持的事件 如下
 *   clickOut 点击非元素区域
 *   clickCap 点击胶囊
 *   clickMore 点击胶囊的更多按钮
 *   clickBubble 点击数字小球
 *   mouseinCap 鼠标移入胶囊
 *   mouseoutCap 鼠标移出胶囊
 */

// 事件测试用例
const clickBlank = (canvasEvent) => {
    console.log('点击空白:', canvasEvent);
    // 点击一次后移除
    window.app.scene.off('clickOut', clickBlank);
};
// 支持级联写法
window.app.scene
    .on('clickOut', clickBlank)
    .on('clickCap', (canvasEvent) => {
        console.log('点击胶囊:', canvasEvent);
    })
    .on('clickCap', (canvasEvent) => {
        console.log('点击胶囊2,可挂载多个事件:', canvasEvent);
    })
    .on('clickMore', (canvasEvent) => {
        console.log('点击胶囊内的更多:', canvasEvent);
    })
    .on('mouseinCap', (canvasEvent) => {
        console.log('移入胶囊:', canvasEvent);
    })
    .on('mouseoutCap', (canvasEvent) => {
        console.log('移出胶囊:', canvasEvent);
    })
    .on('mouseinSpare', canvasEvent => {
        console.log('移入备用', canvasEvent);
    })
    .on('mouseoutSpare', canvasEvent => {
        console.log('移出备用', canvasEvent);
    });

window.app.start();
// window.app.setData(testTree);
window.app.initTreeData(originTree);

const box = document.getElementById('box');

// 测试
let close = false;
const toogleBtn = document.getElementById('expend-close');
toogleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    close = !close;
    if (close) {
        toogleBtn.innerText = '展开全部';
        window.app.scene.collapseAll();
    } else {
        toogleBtn.innerHTML = '收起全部';
        window.app.scene.expandAll();
    }
});

// eslint-disable-next-line one-var
let fullScreen = false;
const fullBtn = document.getElementById('fullScreen');
fullBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fullScreen = !fullScreen;
    if (fullScreen) {
        fullBtn.innerText = '关闭全屏';
        box.style.position = 'fixed';
        box.style.width = '100%';
        box.style.height = '100%';
        box.style.top = 0;
        box.style.left = 0;
        box.style.margin = 0;
    } else {
        fullBtn.innerText = '全屏显示';
        box.style.position = null;
        box.style.width = null;
        box.style.height = null;
        box.style.top = null;
        box.style.left = null;
        box.style.margin = '50px auto';
    }

    window.app.scene.resize();
});
document.getElementById('add').addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('放大');
    window.app.scene.changeScale(0.2);
});

document.getElementById('reduce').addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('缩小');
    window.app.scene.changeScale(-0.2);
});
