// 先获取DOM元素（画布上下文）
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 小鸟对象（全局）
const bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: CONFIG.birdSize,
    height: CONFIG.birdSize,
    velocity: 0,
    color: '#FF6B6B',
    
    // 绘制小鸟
    draw() {
        // 画小鸟身体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 画眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y - 3, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 画嘴巴
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 18, this.y);
        ctx.lineTo(this.x + 10, this.y + 3);
        ctx.closePath();
        ctx.fill();
    },
    
    // 更新小鸟状态（重力、边界检测）
    update() {
        this.velocity += CONFIG.gravity;
        this.y += this.velocity;
        
        // 碰撞地面 → 游戏结束
        if (this.y + this.height / 2 >= canvas.height - CONFIG.groundHeight) {
            this.y = canvas.height - CONFIG.groundHeight - this.height / 2;
            if (gameState === GAME_STATE.PLAYING) {
                gameOver(); // gameOver函数在game-logic.js中定义
            }
        }
        
        // 碰撞天花板 → 停止向上
        if (this.y - this.height / 2 <= 0) {
            this.y = this.height / 2;
            this.velocity = 0;
        }
    },
    
    // 跳跃动作
    jump() {
        this.velocity = CONFIG.jumpVelocity;
    }
};

// 管道类（全局）
class Pipe {
    constructor() {
        this.x = canvas.width;
        this.width = 60;
        this.gap = CONFIG.pipeGap;
        // 随机生成上管道高度（保证间隙合理）
        this.topHeight = Math.floor(Math.random() * (canvas.height - CONFIG.groundHeight - this.gap - 100)) + 50;
        this.bottomHeight = canvas.height - CONFIG.groundHeight - this.topHeight - this.gap;
        this.passed = false;
        this.color = '#4CAF50';
        this.border = '#2E7D32';
    }
    
    // 绘制管道
    draw() {
        // 上管道
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        // 上管道边框
        ctx.fillStyle = this.border;
        ctx.fillRect(this.x, this.topHeight - 10, this.width, 10);
        
        // 下管道
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, canvas.height - CONFIG.groundHeight - this.bottomHeight, this.width, this.bottomHeight);
        // 下管道边框
        ctx.fillStyle = this.border;
        ctx.fillRect(this.x, canvas.height - CONFIG.groundHeight - this.bottomHeight, this.width, 10);
    }
    
    // 更新管道状态（移动、计分）
    update() {
        this.x -= CONFIG.pipeSpeed;
        
        // 小鸟穿过管道 → 加分
        if (!this.passed && this.x + this.width < bird.x) {
            this.passed = true;
            score++;
            scoreDisplay.textContent = score;
        }
        
        // 返回管道是否仍在画布内（用于删除超出的管道）
        return this.x + this.width > 0;
    }
    
    // 碰撞检测
    checkCollision() {
        // 上管道碰撞
        if (
            bird.x + bird.width / 2 > this.x && 
            bird.x - bird.width / 2 < this.x + this.width &&
            bird.y - bird.height / 2 < this.topHeight
        ) {
            return true;
        }
        
        // 下管道碰撞
        if (
            bird.x + bird.width / 2 > this.x && 
            bird.x - bird.width / 2 < this.x + this.width &&
            bird.y + bird.height / 2 > canvas.height - CONFIG.groundHeight - this.bottomHeight
        ) {
            return true;
        }
        
        return false;
    }
}