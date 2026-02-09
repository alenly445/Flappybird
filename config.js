// 游戏状态常量（全局）
const GAME_STATE = {
    READY: 'ready',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

// 游戏配置常量（全局，可直接修改参数调优）
const CONFIG = {
    gravity: 0.5,         // 重力加速度
    jumpVelocity: -10,    // 跳跃初速度（负数向上）
    pipeSpeed: 2,         // 管道移动速度
    pipeGap: 150,         // 管道上下间隙
    pipeFrequency: 120,   // 生成管道的帧数间隔
    groundHeight: 100,    // 地面高度
    birdSize: 30          // 小鸟尺寸
};

// 全局游戏变量（初始化）
let gameState = GAME_STATE.READY; // 初始状态：准备中
let score = 0;                    // 初始得分
let frameCount = 0;               // 帧数计数器
let pipes = [];                   // 管道数组（全局）