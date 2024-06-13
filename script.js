document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('color-grid');
    const ctx = canvas.getContext('2d');
    const rows = 18; // 行数を18に増やす
    const cols = 32;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const rowColors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00",
        "#00FF7F", "#00FFFF", "#007FFF", "#0000FF", "#7F00FF",
        "#FF00FF", "#FF007F", "#FF7F7F", "#7F7F7F", "#FFD700", "#ADFF2F",
        "#8A2BE2", "#DC143C" // 新しい行の色を追加
    ];

    let grid = Array.from({ length: rows }, () => Array(cols).fill('white'));

    function drawGrid() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                ctx.fillStyle = grid[row][col];
                ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                ctx.strokeStyle = 'gray';
                ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

                // 最下行に丸を描画
                if (row === rows - 1) {
                    drawCircle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // 半径を12px小さくする
                }
                // 下から2番目の行に三角形を描画
                else if (row === rows - 2) {
                    drawTriangle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // サイズを12px小さくする
                }
            }
        }
    }

    function drawCircle(x, y, radius) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    function drawTriangle(x, y, size) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x, y - size); // 上端
        ctx.lineTo(x - size, y + size); // 左下端
        ctx.lineTo(x + size, y + size); // 右下端
        ctx.closePath();
        ctx.fill();
    }

    drawGrid();

    const colorSounds = {
        "#FF0000": 220, "#FF7F00": 246.94, "#FFFF00": 277.18, "#7FFF00": 293.66,
        "#00FF00": 329.63, "#00FF7F": 369.99, "#00FFFF": 415.30, "#007FFF": 440,
        "#0000FF": 493.88, "#7F00FF": 554.37, "#FF00FF": 622.25, "#FF007F": 698.46,
        "#FF7F7F": 739.99, "#7F7F7F": 783.99, "#FFD700": 880, "#ADFF2F": 987.77,
        "#8A2BE2": 1046.50, "#DC143C": 1174.66 // 新しい行の音の周波数を追加
    };

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        const currentColor = grid[row][col];
        const newColor = currentColor === 'white' ? rowColors[row] : 'white';

        grid[row][col] = newColor;
        ctx.fillStyle = newColor;
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

        if (row === rows - 1) {
            drawCircle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // 半径を12px小さくする
        } else if (row === rows - 2) {
            drawTriangle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // サイズを12px小さくする
        }

        playSound(newColor);
    });

    function playSound(color) {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const frequency = colorSounds[color];
        
        if (frequency) {
            oscillator.frequency.value = frequency;
            oscillator.connect(audioContext.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 500);
        } else {
            console.log(`No sound defined for color: ${color}`);
        }
    }

    let isPlaying = false;
    let playInterval;

    document.getElementById('play-sound-button').addEventListener('click', () => {
        const button = document.getElementById('play-sound-button');
        if (isPlaying) {
            isPlaying = false;
            button.textContent = 'Play';
            clearInterval(playInterval);
        } else {
            isPlaying = true;
            button.textContent = 'Stop';
            playColumns();
        }
    });

    function playColumns() {
        let col = 0;
        function playNextColumn() {
            if (col < cols && isPlaying) {
                let originalColors = [];
                for (let row = 0; row < rows; row++) {
                    originalColors[row] = grid[row][col];
                    grid[row][col] = 'blue';
                }
                drawGrid();
                for (let row = 0; row < rows; row++) {
                    const color = originalColors[row];
                    if (color !== 'white') playSound(color);
                }
                setTimeout(() => {
                    for (let row = 0; row < rows; row++) {
                        grid[row][col] = originalColors[row];
                    }
                    drawGrid();
                    col++;
                    if (col < cols) {
                        playNextColumn();
                    } else {
                        col = 0;
                        if (isPlaying) playNextColumn();
                    }
                }, 600);
            }
        }
        playNextColumn();
    }
});
