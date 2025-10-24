const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const areaJuego = document.getElementById('area-juego');
const slidPlayer = document.getElementById('playerSpd');
const slidEnemy = document.getElementById('enemySpd');
const valSpdPlay = document.getElementById('valSpdPlay');
const valSpdEn = document.getElementById('valSpdEn');
const btnPlay = document.getElementById('btn-play');
const btnImg = document.getElementById('btn-img');
const music = document.getElementById('music');
const repMusic = document.getElementById('rep-music');
const vida = document.getElementById('vida');
const sfx = document.getElementById('sfx')

sfx.src = 'https://moisessunza.github.io/Chafa-tale/Assets/Daño.wav'

let playerPos = { x: 100, y: 100 };
let vidaPlayer = 10;
let enemyPos = { x: 500, y: 500 };
let playerVel = { x: 0, y: 0 };

let playerSpd = parseInt(slidPlayer.value);
let enemySpd = parseInt(slidEnemy.value);

slidPlayer.addEventListener('input', (evt) => {
    playerSpd = parseInt(evt.target.value);
    valSpdPlay.textContent = playerSpd;
    slidPlayer.blur();
});

slidEnemy.addEventListener('input', (evt) => {
    enemySpd = parseInt(evt.target.value);
    valSpdEn.textContent = enemySpd;
    slidEnemy.blur();
});

let keys = {};
const accel = 0.5;
const friction = 0.9;

window.addEventListener('keydown', (evt) => keys[evt.key] = true);
window.addEventListener('keyup', (evt) => keys[evt.key] = false);

function updatePlayer() {
    let moveX = 0;
    let moveY = 0;

    if (keys['ArrowUp']) moveY = -1;
    if (keys['ArrowDown']) moveY = 1;
    if (keys['ArrowLeft']) moveX = -1;
    if (keys['ArrowRight']) moveX = 1;

    if (moveX !== 0 && moveY !== 0) {
        const norm = Math.sqrt(2) / 2;
        moveX *= norm;
        moveY *= norm;
    }

    playerVel.x += moveX * accel * playerSpd;
    playerVel.y += moveY * accel * playerSpd;
    playerVel.x *= friction;
    playerVel.y *= friction;

    playerPos.x += playerVel.x;
    playerPos.y += playerVel.y;

    playerPos.x = Math.max(0, Math.min(areaJuego.clientWidth - 50, playerPos.x));
    playerPos.y = Math.max(0, Math.min(areaJuego.clientHeight - 50, playerPos.y));
}

function moveEnemy() {
    if (enemyPos.x < playerPos.x) enemyPos.x += enemySpd;
    else if (enemyPos.x > playerPos.x) enemyPos.x -= enemySpd;

    if (enemyPos.y < playerPos.y) enemyPos.y += enemySpd;
    else if (enemyPos.y > playerPos.y) enemyPos.y -= enemySpd;

    updatePositions();
    checkCollision();
}

function updatePositions() {
    player.style.transform = `translate(${playerPos.x}px, ${playerPos.y}px)`;
    enemy.style.transform = `translate(${enemyPos.x}px, ${enemyPos.y}px)`;
}

function checkCollision() {
    if (Math.abs(playerPos.x - enemyPos.x) < 50 &&
        Math.abs(playerPos.y - enemyPos.y) < 50) {
        sfx.play();
        playerPos = { x: 100, y: 100 };
        vidaPlayer -= 1;
        vida.textContent = vidaPlayer;
        enemyPos = { x: 500, y: 500 };
        playerVel = { x: 0, y: 0 };

        if(vidaPlayer == 0){
            repMusic.pause();
            valSpdEn.textContent = enemySpd;
            sfx.src = "https://moisessunza.github.io/Chafa-tale/Assets/Determination.wav"
            sfx.play();
            sfx.loop = true;
            alert("Don't lose hope..., Stay determined...");
            btnImg.src = 'https://moisessunza.github.io/Chafa-tale/Assets/playBtn.jpg';
            vidaPlayer = 10;
            gameRunning = false;
            
            return;
        }

        if (!gameRunning) {
            gameRunning = true;
            requestAnimationFrame(loop);
        }
    }
}

let gameRunning = false;

function loop() {
    if (!gameRunning) return;
    updatePlayer();
    moveEnemy();
    updatePositions();
    requestAnimationFrame(loop);
}

if (btnPlay) btnPlay.type = 'button';

btnPlay.addEventListener('click', (e) => {
    e.preventDefault();
    vida.textContent = vidaPlayer;
    if (!gameRunning) {
        gameRunning = true;
        btnImg.src = 'https://moisessunza.github.io/Chafa-tale/Assets/btnPlay2.jpg';
        requestAnimationFrame(loop);
        sfx.loop = false;
        sfx.pause();
        sfx.src = 'https://moisessunza.github.io/Chafa-tale/Assets/Daño.wav';
        const selectedSong = music.value || music.options[0].value;
        repMusic.src = selectedSong;
        repMusic.currentTime = 0;
        repMusic.loop = true;
        repMusic.play();
    } else {
        gameRunning = false;
        btnImg.src = 'https://moisessunza.github.io/Chafa-tale/Assets/playBtn.png';
        repMusic.pause();
    }
});

const enemyImg = {
    "https://moisessunza.github.io/Chafa-tale/Assets/Dogsong.wav": "https://moisessunza.github.io/Chafa-tale/Assets/Annoying.webp",
    "https://moisessunza.github.io/Chafa-tale/Assets/Song That Might Play When You Fight Sans.wav": "https://moisessunza.github.io/Chafa-tale/Assets/sans.png",
    "https://moisessunza.github.io/Chafa-tale/Assets/Temmie Village.wav": "https://moisessunza.github.io/Chafa-tale/Assets/Temmie.webp"
};

const enemySelSpd = {
    "https://moisessunza.github.io/Chafa-tale/Assets/Dogsong.wav": 2,
    "https://moisessunza.github.io/Chafa-tale/Assets/Temmie Village.wav": 5,
    "https://moisessunza.github.io/Chafa-tale/Assets/Song That Might Play When You Fight Sans.wav": 8
}

music.addEventListener('change', () => {
    const cancionSel = music.value;
    if (cancionSel) {
        repMusic.src = cancionSel;
        repMusic.currentTime = 0;
        repMusic.loop = true;
        repMusic.play();
        if (enemyImg[cancionSel]) {
            enemy.style.backgroundImage = `url(https://moisessunza.github.io/Chafa-tale/Assets/${enemyImg[cancionSel]})`;
        }
        if(enemySelSpd[cancionSel]){
            enemySpd = parseInt(enemySelSpd[cancionSel]);
            valSpdEn.textContent = enemySpd;
            slidEnemy.value = enemySpd; 
        }
    } else {
        repMusic.pause();
        repMusic.src = '';
        repMusic.loop = false;
        enemy.src = `url(https://moisessunza.github.io/Chafa-tale/Assets/${enemyImg[cancionSel]})`;
        enemySpd = parseInt(enemySelSpd[cancionSel]);
        valSpdEn.textContent = enemySpd;
        slidEnemy.value = enemySpd; 
    }
    music.blur();

});
