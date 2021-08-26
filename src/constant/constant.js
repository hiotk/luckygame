// 一些常量配置

/**
 * 胶囊相关参数
 *  */
// 胶囊里的字体大小
export const CAP_FONT_SIZE = 14;

// 胶囊半径
export const CAP_RADIOUS = 16;

// 胶囊最小宽度
export const CAP_MIN_WIDTG = 64;

// 胶囊里文字最大长度
export const CAP_TEXT_MAX_WIDTH = 215;

// 单子节点X轴偏移量
export const SINGLE_CHILD_OFFSETX = 56;

// 多子节点X轴偏移量
export const MULTIPLE_CHILD_OFFSETX = 88;

// 子节点Y轴偏移量
export const CHILD_OFFSETY = 16;

// 字体风格
export const CANVAS_FONT_STYLE = 'Monaco';

/**
 *  bubble 相关参数
 */

// bubble 半径
export const BUBBLE_RADIOUS = 10;

// bubble 字体
export const BUBBLE_FONT_SIZE = 12;

// bubble 的左右padding
export const BUBBLE_PADDING = 2;

/**
 * 线条相关参数
 */

// 基础线条长度
export const LINE_BASE_LEN = 40;

// 连接处线条长度
export const LINE_JOIN_LEN = 32;

// 线条X轴偏移量
export const LINE_OFFSETX = 8;

// 线条弧度
export const LINE_RADIOUS = 20;

// 末端线条长度
export const LINE_END_LEN = 20;

// 最大最小 缩放比例
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10;

// canvas 画布支持的事件
export const CANVAS_EVENTS = ['click', 'mousemove'];

// click 事件 支持的最大鼠标偏移量
export const CLICK_MAX_OFFSET = 2;

// classCode与type的映射关系
export const CLASSCODE_TO_TYPE = {
    SETDTF: 'A',
    SETDLF: 'B',
    SETDLSDW: 'C',
    SETDLT: 'D'
};

// 规定动画多少帧完成
export const ANIMATION_FRAME_NUM = 10;
