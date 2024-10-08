import { chapters } from './storyText.js';

// 获取开始按钮
const startButton = document.getElementById('startButton');
// 按钮点击事件处理
startButton.addEventListener('click', startGame);
function startGame() {
    // 隐藏开始按钮
    startButton.style.display = 'none';
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showNextLine(0);
}

// 获取画布元素和绘图上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//一行一行地显示剧情文字
let currentStoryIndex = 0;
function showNextLine( chapterNumber, tip) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    if (tip) {
        if (currentStoryIndex < chapters[chapterNumber].tip.length) {
            ctx.fillText(chapters[chapterNumber].tip[currentStoryIndex], 50, 50 + currentStoryIndex * 30);
            currentStoryIndex++;
            setTimeout(() => showNextLine(chapterNumber, tip), 1000);
        }
        else {
            currentStoryIndex = 0;
        }
    }
    else {
        if (currentStoryIndex < chapters[chapterNumber].storyTexts.length) {
            ctx.fillText(chapters[chapterNumber].storyTexts[currentStoryIndex], 50, 50 + currentStoryIndex * 30);
            currentStoryIndex++;
            setTimeout(() => showNextLine(chapterNumber), 1000);
        }
        else {
            if (chapterNumber === 0){
                showDoor();
            }
            else if (chapterNumber === 1) {
                showButton();
            }
            currentStoryIndex = 0;
        }
    }
}
let doorCreated = false;
const doorContainer = document.getElementById('doorContainer');
//显示门
function showDoor() {
    doorContainer.style.display = 'block';
    if (!doorCreated) {
        const door = document.createElement('div');
        door.classList.add('door');
        doorContainer.appendChild(door);
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        door.appendChild(buttonContainer);
        for (let i = 0; i < 4; i++) {
            const button = document.createElement('button');
            button.classList.add('button');
            button.addEventListener('click', () => handleButtonClick(i));
            buttonContainer.appendChild(button);
        }
        const buttons = buttonContainer.querySelectorAll('.button');
        buttons[0].style.position = 'absolute';
        buttons[0].style.top = '20px';
        buttons[0].style.left = '2px';
        buttons[1].style.position = 'absolute';
        buttons[1].style.bottom = '20px';
        buttons[1].style.left = '2px';
        buttons[2].style.position = 'absolute';
        buttons[2].style.top = '20px';
        buttons[2].style.right = '2px';
        buttons[3].style.position = 'absolute';
        buttons[3].style.bottom = '20px';
        buttons[3].style.right = '2px';
        doorCreated = true;
    }
}

//开门
let clickedButtons = [];
let buttonOrder = [0, 1, 2, 3]; // 正确的点击顺序
function handleButtonClick(index) {
    clickedButtons.push(index);
    if (clickedButtons.length === buttonOrder.length && clickedButtons.toString() === buttonOrder.toString()) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        alert('门打开了');
        doorContainer.style.display = 'none';
        drawBackground('pic/雕像.jpeg'); // 替换为你的新背景图路径
        showNextLine(1);
        clickedButtons = [];
    }
    else if (clickedButtons.length === buttonOrder.length && clickedButtons.toString() !== buttonOrder.toString()) {
        alert('顺序不对');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        showNextLine( 0, true );
        clickedButtons = [];
    }
}

//替换背景
function drawBackground(imageUrl) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

let statueButtonCreated = false;
const statueContainer = document.getElementById('statueContainer');
// 查看雕像背部按钮
function showButton() {
    statueContainer.style.display = 'block';
    if (!statueButtonCreated) {
        const statueButton = document.createElement('button');
        statueButton.id = 'statueButton';
        statueButton.textContent = '查看雕像背部';
        statueButton.addEventListener('click', function handleStatueButtonClick() {
            if (this.textContent === '查看雕像背部') {
                drawBackground('pic/雕像背部.jpeg');
                this.textContent = '返回正面';
            } else {
                let textShown = false;
                let step = 0;
                const intervalId = setInterval(() => {
                    if (step === 0) {
                        showNextLine(1, true);
                        step++;
                    } else if (step === 1 &&!textShown) {
                        textShown = true;
                        startBattle();
                        clearInterval(intervalId);
                    }
                }, 1000);
                const showTextCallback = () => {
                    showNextLine(1, true);
                };
                drawBackground('pic/雕像.jpeg');
                this.textContent = '查看雕像背部';
                statueContainer.style.display = 'none';
                setTimeout(showTextCallback, 0);
            }
        });
        statueContainer.appendChild(statueButton);
        statueButtonCreated = true;
    }
}

//战斗开始
function startBattle() {
    const music = document.getElementById('gameMusic');
    music.volume = 0.5;
    music.play();
    // 游戏角色的初始位置和速度
    let playerX = 50;
    let playerY = 50;
    let playerSpeed = 5;

    // 敌人的位置
    let enemyX = 200;
    let enemyY = 200;
    // 敌人血量
    let enemyHealth = 1000;

    // 处理键盘事件
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    let keys = {};

    // 子弹数组
    let bullets = [];

    function handleKeyDown(event) {
        keys[event.keyCode] = true;
        if (event.keyCode === 74 &&!keys[75]) { // J - 打击
            if (keys[87]) { // 上箭头
                fireBullet(playerX, playerY - 10, 0, -10);
            } else if (keys[83]) { // 下箭头
                fireBullet(playerX, playerY + 20, 0, 10);
            } else if (keys[65]) { // 左箭头
                fireBullet(playerX - 10, playerY + 10, -10, 0);
            } else if (keys[68]) { // 右箭头
                fireBullet(playerX + 20, playerY + 10, 10, 0);
            }
        }
    }

    function handleKeyUp(event) {
        keys[event.keyCode] = false;
    }

    // 游戏循环
    function gameLoop() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 根据按键状态移动角色
        if (keys[87] && playerY > 0) { // W - 上
            playerY -= playerSpeed;
        }
        if (keys[83] && playerY < canvas.height) { // S - 下
            playerY += playerSpeed;
        }
        if (keys[65] && playerX > 0) { // A - 左
            playerX -= playerSpeed;
        }
        if (keys[68] && playerX < canvas.width) { // D - 右
            playerX += playerSpeed;
        }

        // 移动和绘制子弹
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].x += bullets[i].dx;
            bullets[i].y += bullets[i].dy;
            ctx.fillStyle = 'yellow';
            ctx.fillRect(bullets[i].x, bullets[i].y, 5, 5);
            if (isCollision(bullets[i].x, bullets[i].y, enemyX, enemyY)) {
                bullets.splice(i, 1);
                enemyHealth -= 20; // 敌人被击中，减少生命值
                console.log('敌人被击中');
                if (enemyHealth <= 0) {
                    // 敌人死亡逻辑
                    endGame(true);
                    return;
                }
            }
        }

        // 敌人 AI：随机朝玩家移动
        const randomNumber = Math.random();
        if (randomNumber < 0.2 && enemyX > playerX) {
            enemyX -= 2;
        } else if (randomNumber >= 0.2 && randomNumber < 0.4 && enemyX < playerX) {
            enemyX += 2;
        }
        if (randomNumber >= 0.4 && randomNumber < 0.6 && enemyY > playerY) {
            enemyY -= 2;
        } else if (randomNumber >= 0.6 && enemyY < playerY) {
            enemyY += 2;
        }

        // 碰撞检测
        if (isCollision(playerX, playerY, enemyX, enemyY)) {
            endGame(false);
            return;
        }

        // 绘制角色和敌人
        ctx.fillStyle = 'blue';
        ctx.fillRect(playerX, playerY, 20, 20);
        ctx.fillStyle = 'red';
        ctx.fillRect(enemyX, enemyY, 20, 20);

        // 检查攻击和跳跃逻辑（这里只是简单示例，可以进一步扩展）
        if (keys[74]) { // J - 打击
            // 可以在这里添加打击敌人的逻辑
            console.log('打击');
        }
        // 继续循环
        requestAnimationFrame(gameLoop);
    }
    
    function isCollision(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) < 20 && Math.abs(y1 - y2) < 20;
    }

    function fireBullet(x, y, dx, dy) {
        bullets.push({ x, y, dx, dy });
    }

    function endGame(isVictory) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        if (!isVictory) {
            ctx.fillText("游戏失败！", canvas.width / 2 - 100, canvas.height / 2);
        }
        else{
            ctx.fillText("游戏胜利！", canvas.width / 2 - 100, canvas.height / 2);
        }
        music.pause();
        startButton.style.display = 'block';
    }

    // 启动游戏循环
    gameLoop();
}