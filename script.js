/*script.js */





// キャンバスの設定
const canvas = document.getElementById('musicGrid');
const ctx = canvas.getContext('2d');

// グリッドの寸法設定
const rows = 18;
const cols = 32;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

// アクティブなセルと拡大されたセルを追跡するためのSet
const activeCells = new Set();
const enlargedCells = new Set();

// 再生関連の変数
let currentColumn = -1;
let playInterval = null;
let isPlaying = false;

// 各セルの周波数を計算（220Hzから始まり、10Hz刻みで増加）
const frequencies = Array.from({ length: rows * cols }, (_, i) => 220 + (i * 10));

// Web Audio APIのコンテキストを作成
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// キャンバスのクリックイベントリスナーを設定
canvas.addEventListener('click', handleCanvasClick);

// キャンバスのクリックを処理する関数
function handleCanvasClick(event) {
    // クリックされた位置を計算
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // クリックされたセルの位置を計算
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const cellIndex = row * cols + col;

    // 最後の2行（ドラム）の特別な処理
    if (row === rows - 1 || row === rows - 2) {
        if (enlargedCells.has(cellIndex)) {
            enlargedCells.delete(cellIndex);
            stopSound(cellIndex); // 拡大から縮小に戻るときに音を止める
        } else {
            enlargedCells.add(cellIndex);
            playSound(cellIndex, 0.5);  // 円または三角形がクリックされたときに音を再生
        }
    } else {
        // 通常のセルの処理
        if (activeCells.has(cellIndex)) {
            activeCells.delete(cellIndex);
            stopSound(cellIndex);
        } else {
            activeCells.add(cellIndex);
            playSound(cellIndex, 0.5);
        }
    }

    // グリッドを再描画
    drawGrid();
}

// 音を再生する関数
function playSound(cellIndex, duration = 1) {
    const row = Math.floor(cellIndex / cols);
    if (row === rows - 1) {
        playDrumSound('kick', duration);
    } else if (row === rows - 2) {
        playDrumSound('snare', duration);
    } else {
        // 通常の音（オシレーター）を再生
        const frequency = frequencies[cellIndex];
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
}

// ドラムサウンドを再生する関数
function playDrumSound(type, duration) {
    if (type === 'kick') {
        // キックドラムの音を生成
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } else if (type === 'snare') {
        // スネアドラムの音を生成（ノイズとトーンの組み合わせ）
        const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(1, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        noise.connect(noiseGain).connect(audioContext.destination);
        noise.start();

        const snareOscillator = audioContext.createOscillator();
        snareOscillator.type = 'triangle';
        snareOscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        snareOscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
        const snareGain = audioContext.createGain();
        snareGain.gain.setValueAtTime(0.7, audioContext.currentTime);
        snareGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        snareOscillator.connect(snareGain).connect(audioContext.destination);
        snareOscillator.start();
        snareOscillator.stop(audioContext.currentTime + duration);
    }
}

// 音を停止する関数（実装が必要）
function stopSound(cellIndex) {
    // 音を停止する実装
}

// 行の色を取得する関数
function getRowColor(row) {
    const colors = [
        'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet',
        'pink', 'brown', 'gray', 'cyan', 'magenta', 'lime', 'gold',
        'salmon', 'purple', 'teal', 'navy'
    ];
    return colors[row % colors.length];
}

// グリッドを描画する関数
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        const rowColor = getRowColor(row);
        for (let col = 0; col < cols; col++) {
            const cellIndex = row * cols + col;
            // セルの描画
            ctx.fillStyle = activeCells.has(cellIndex) ? rowColor : 'white';
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

            // キックドラム（円）の描画
            if (row === rows - 1) {
                const size = cellWidth / 3 + (enlargedCells.has(cellIndex) ? 3 : 0);
                drawCircle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, size / 2, enlargedCells.has(cellIndex));
            }

            // スネアドラム（三角形）の描画
            if (row === rows - 2) {
                const size = cellWidth / 3 + (enlargedCells.has(cellIndex) ? 3 : 0);
                drawTriangle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, size, enlargedCells.has(cellIndex));
            }
        }
    }

    // 現在再生中の列をハイライト
    if (currentColumn >= 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(currentColumn * cellWidth, 0, cellWidth, canvas.height);

        ctx.fillStyle = 'rgba(128, 128, 128, 0.2)'; // グレーで不透明度0.2
        ctx.fillRect(currentColumn * cellWidth, 0, cellWidth, canvas.height);
    }
}

// 円を描画する関数
function drawCircle(x, y, radius, isEnlarged) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isEnlarged ? '#4C444D' : 'gray'; // 拡大時は #4C444D に、通常時は灰色に設定
    ctx.fill();
}

// 三角形を描画する関数
function drawTriangle(x, y, size, isEnlarged) {
    ctx.beginPath();
    ctx.moveTo(x, y - size / Math.sqrt(3));
    ctx.lineTo(x - size / 2, y + size / (2 * Math.sqrt(3)));
    ctx.lineTo(x + size / 2, y + size / (2 * Math.sqrt(3)));
    ctx.closePath();
    ctx.fillStyle = isEnlarged ? '#4C444D' : 'gray'; // 拡大時は #4C444D に、通常時は灰色に設定
    ctx.fill();
}

// シーケンスを再生する関数
function playSequence() {
    currentColumn = 0;
    playInterval = setInterval(() => {
        if (currentColumn >= cols) {
            currentColumn = 0;
        }

        // 現在の列のアクティブなセルの音を再生
        for (let row = 0; row < rows; row++) {
            const cellIndex = row * cols + currentColumn;
            if (activeCells.has(cellIndex) || enlargedCells.has(cellIndex)) {
                playSound(cellIndex);
            }
        }

        drawGrid();
        currentColumn++;
    }, 500); // 500ミリ秒ごとに次の列に移動
}

// 再生/停止を切り替える関数
function togglePlayStop() {
    if (isPlaying) {
        clearInterval(playInterval);
        currentColumn = -1;
        drawGrid();
        document.getElementById('playStopButton').textContent = '再生';
    } else {
        playSequence();
        document.getElementById('playStopButton').textContent = '停止';
    }
    isPlaying = !isPlaying;
}

// 再生/停止ボタンのイベントリスナーを設定
document.getElementById('playStopButton').addEventListener('click', togglePlayStop);

// 初期グリッドの描画
drawGrid(); 