// 获取UI相关DOM元素
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// 初始化游戏（重置所有状态）
function initGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = '0';
    frameCount = 0;
}

// 开始游戏
function startGame() {
    gameState = GAME_STATE.PLAYING;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    initGame();
}

// 游戏结束
function gameOver() {
    gameState = GAME_STATE.GAME_OVER;
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = score;
}

// 主游戏循环（核心驱动）
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 游戏中才更新小鸟状态
    if (gameState === GAME_STATE.PLAYING) {
        bird.update();
    }
    
    // 绘制小鸟（所有状态都绘制）
    bird.draw();
    
    // 游戏中才生成/更新管道
    if (gameState === GAME_STATE.PLAYING) {
        frameCount++;
        // 按频率生成新管道
        if (frameCount % CONFIG.pipeFrequency === 0) {
            pipes.push(new Pipe());
        }
    }
    
    // 更新/绘制所有管道，检测碰撞
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].draw();
        
        if (gameState === GAME_STATE.PLAYING) {
            // 删除超出画布的管道
            if (!pipes[i].update()) {
                pipes.splice(i, 1);
            } 
            else{
                const pipe=pipes[i];
                const pipeLeft=pipe.x;
                const pipeRight=pipe.x+pipe.width;
                const gapTop=pipe.topHeight;
                const gapBottom=canvas.height - CONFIG.groundHeight - pipe.bottomHeight;
                const birdLeft=bird.x-bird.width/2;
                const birdRight=bird.x+bird.width/2;
                const birdTop=bird.y-bird.height/2;
                const birdBottom=bird.y+bird.height/2;

                const isBirdInPipeX = birdRight > pipeLeft && birdLeft < pipeRight;
                if(isBirdInPipeX){
                    const isBirdInPipeGap = birdBottom > gapTop && birdTop < gapBottom;

                    if(!isBirdInPipeGap){
                        gameOver();
                    }else{
                        if(birdTop <= gapTop){
                            bird.y = gapTop + bird.height / 2;
                            bird.velocity = Math.abs(bird.velocity) *CONFIG.bounceFactor;
                        }
                        else if(birdBottom >= gapBottom){
                            bird.y = gapBottom - bird.height /2;
                            bird.velocity = -Math.abs(bird.velocity)* CONFIG.bounceFactor;
                        }
                    }

                }
            }
        }
    }
    
    // 绘制地面
    ctx.fillStyle = '#81C784';
    ctx.fillRect(0, canvas.height - CONFIG.groundHeight, canvas.width, CONFIG.groundHeight);
    // 绘制地面边框
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(0, canvas.height - CONFIG.groundHeight, canvas.width, 4);
    
    // 循环调用（约60次/秒）
    requestAnimationFrame(gameLoop);
}

// 绑定交互事件
function setupEventListeners() {
    // 点击画布：跳跃/开始游戏
    canvas.addEventListener('click', () => {
        if (gameState === GAME_STATE.PLAYING) {
            bird.jump();
        } else if (gameState === GAME_STATE.READY) {
            startGame();
        }
    });
    
    // 空格键：跳跃/开始游戏
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (gameState === GAME_STATE.PLAYING) {
                bird.jump();
            } else if (gameState === GAME_STATE.READY) {
                startGame();
            }
            e.preventDefault(); // 阻止默认滚动行为
        }
    });
    
    // 开始按钮
    startBtn.addEventListener('click', startGame);
    // 重新开始按钮
    restartBtn.addEventListener('click', startGame);
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    setupEventListeners();
    gameLoop();
});