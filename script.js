// キャンバスの設定
const canvas = document.getElementById('musicGrid');
const ctx = canvas.getContext('2d');

// グリッドの寸法設定
const rows = 16;
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

// オーディオコンテキストの作成
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// オーディオファイルのパスを音階に対応させてマッピング
const audioFiles = {
    'C3': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
    'D3': 'piano/piano_ongen/AnyConv.com__piano1-re.mp3',
    'E3': 'piano/piano_ongen/AnyConv.com__piano1-mi.mp3',
    'F3': 'piano/piano_ongen/AnyConv.com__piano1-fa.mp3',
    'G3': 'piano/piano_ongen/AnyConv.com__piano1-so.mp3',
    'A3': 'piano/piano_ongen/AnyConv.com__piano1-ra.mp3',
    'B3': 'piano/piano_ongen/AnyConv.com__piano1-shi.mp3',
    'C4': 'piano/piano_ongen/AnyConv.com__piano2-do.mp3',
    'D4': 'piano/piano_ongen/AnyConv.com__piano2-re.mp3',
    'E4': 'piano/piano_ongen/AnyConv.com__piano2-mi.mp3',
    'F4': 'piano/piano_ongen/AnyConv.com__piano2-fa.mp3',
    'G4': 'piano/piano_ongen/AnyConv.com__piano2-so.mp3',
    'A4': 'piano/piano_ongen/AnyConv.com__piano2-ra.mp3',
    'B4': 'piano/piano_ongen/AnyConv.com__piano2-shi.mp3',
   
    
};

// 音階のマッピング

const noteMapping = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'];

// キャンバスのクリックイベントリスナーを設定
canvas.addEventListener('click', handleCanvasClick);

// キャンバスのクリックを処理する関数
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const cellIndex = row * cols + col;

    if (row === rows - 1 || row === rows - 2) {
        toggleEnlargedCell(cellIndex);
    } else {
        toggleActiveCell(cellIndex);
    }
    
    playSound(cellIndex, 0.5);
    drawGrid();
}

// アクティブなセルをトグルする関数
function toggleActiveCell(cellIndex) {
    if (activeCells.has(cellIndex)) {
        activeCells.delete(cellIndex);
    } else {
        activeCells.add(cellIndex);
    }
}

// 拡大されたセルをトグルする関数
function toggleEnlargedCell(cellIndex) {
    if (enlargedCells.has(cellIndex)) {
        enlargedCells.delete(cellIndex);
    } else {
        enlargedCells.add(cellIndex);
    }
}

// 行から音階への変換関数
function rowToNote(row) {
    if (row < rows - 2) { // ピアノ音源用の行
        return noteMapping[row];
    } else if (row === rows - 2) { // スネアドラム用の行
        return 'snare';
    } else { // キックドラム用の行
        return 'kick';
    }
}

// 音源を再生する関数
function playSound(cellIndex, duration = 1) {
    const row = Math.floor(cellIndex / cols);
    const note = rowToNote(row);

    if (note === 'kick') {
        playDrumSound('kick', duration);
    } else if (note === 'snare') {
        playDrumSound('snare', duration);
    } else {
        const audioFile = audioFiles[note];
        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.play();
            setTimeout(() => audio.pause(), duration * 1000);
        }
    }
}
// ... (前のコードの大部分は変更なし)

// キャンバスのクリックを処理する関数を更新
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const cellIndex = row * cols + col;

    let shouldPlaySound = false;

    if (row === rows - 1 || row === rows - 2) {
        // ドラムセル（円と三角形）の処理
        if (enlargedCells.has(cellIndex)) {
            enlargedCells.delete(cellIndex);
        } else {
            enlargedCells.add(cellIndex);
            shouldPlaySound = true;
        }
    } else {
        // 通常のセル（ピアノ音）の処理
        if (activeCells.has(cellIndex)) {
            activeCells.delete(cellIndex);
        } else {
            activeCells.add(cellIndex);
            shouldPlaySound = true;
        }
    }
    
    if (shouldPlaySound) {
        playSound(cellIndex, 0.5);
    }
    
    drawGrid();
}

// シーケンスを再生する関数を更新
function playSequence() {
    currentColumn = 0;
    playInterval = setInterval(() => {
        if (currentColumn >= cols) {
            currentColumn = 0;
        }

        // 現在の列のアクティブなセルの音を再生
        for (let row = 0; row < rows; row++) {
            const cellIndex = row * cols + currentColumn;
            if ((row < rows - 2 && activeCells.has(cellIndex)) || 
                (row >= rows - 2 && enlargedCells.has(cellIndex))) {
                playSound(cellIndex);
            }
        }

        drawGrid();
        currentColumn++;
    }, 500); // 500ミリ秒ごとに次の列に移動
}


// ドラムサウンドを再生する関数（例：キック・スネア）
function playDrumSound(type, duration) {
    if (type === 'kick') {
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

// 行の色を取得する関数
function getRowColor(row) {
    const colors = ['orange','peru','green','lawngreen','deepskyblue','plum','hotpink',
    'orange','peru','green','lawngreen','deepskyblue','plum','hotpink',
    ];
    return colors[row % colors.length];
}

// グリッドを描画する関数
// グリッドを描画する関数
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellIndex = row * cols + col;

            // セルの背景色を設定
            if (activeCells.has(cellIndex)) {
                ctx.fillStyle = getRowColor(row);
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

            // セルの枠線（通常の線）
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

            // C4の下の枠線を太くする
            if (row === 6) { // C4の行は6
                ctx.lineWidth = 4; // 太い線
                ctx.beginPath();
                ctx.moveTo(col * cellWidth, (row + 1) * cellHeight); // 左端
                ctx.lineTo((col + 1) * cellWidth, (row + 1) * cellHeight); // 右端
                ctx.strokeStyle = 'gray'; // 線の色
                ctx.stroke();
                ctx.lineWidth = 1; // 戻す
            }

            // 偶数列の右側の枠線を太くする
            if (col % 2 === 0) {
                ctx.lineWidth = 5; // 太い線
                ctx.beginPath();
                ctx.moveTo((col + 1) * cellWidth, row * cellHeight); // 上端
                ctx.lineTo((col + 1) * cellWidth, (row + 1) * cellHeight); // 下端
                ctx.strokeStyle = 'gray'; // 線の色
                ctx.stroke();
                ctx.lineWidth = 1; // 戻す
            }

            // 音階名を描画（ピアノ音源の行のみ）
            if (row < rows - 2) {
                ctx.fillStyle = 'black';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(noteMapping[row], col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
            }

            // ドラムのセルを描画
            if (row === rows - 1) {
                drawCircle(col, row, cellIndex);
            } else if (row === rows - 2) {
                drawTriangle(col, row, cellIndex);
            }
        }
    }

    if (currentColumn >= 0) {
        highlightCurrentColumn();
    }
}



// 円を描画する関数
function drawCircle(col, row, cellIndex) {
    const size = cellWidth / 3 + (enlargedCells.has(cellIndex) ? 3 : 0);
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = enlargedCells.has(cellIndex) ? '#4C444D' : 'gray';
    ctx.fill();
}

// 三角形を描画する関数
function drawTriangle(col, row, cellIndex) {
    const size = cellWidth / 3 + (enlargedCells.has(cellIndex) ? 3 : 0);
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;
    ctx.beginPath();
    ctx.moveTo(x, y - size / Math.sqrt(3));
    ctx.lineTo(x - size / 2, y + size / (2 * Math.sqrt(3)));
    ctx.lineTo(x + size / 2, y + size / (2 * Math.sqrt(3)));
    ctx.closePath();
    ctx.fillStyle = enlargedCells.has(cellIndex) ? '#4C444D' : 'gray';
    ctx.fill();
}

// 現在の列をハイライトする関数
function highlightCurrentColumn() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(currentColumn * cellWidth, 0, cellWidth, canvas.height);
    ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.fillRect(currentColumn * cellWidth, 0, cellWidth, canvas.height);
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


// BPMの初期値
let bpm = 120;
let intervalTime = (60 / bpm) * 1000; // 1列移動ごとの時間 (ms)

// シーケンス再生の間隔をBPMに応じて調整
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
    }, intervalTime); // BPMに基づいた間隔
}

// スライダーの値を変更した際にBPMを更新するイベントリスナー
const bpmSlider = document.getElementById('bpmSlider');
const bpmDisplay = document.getElementById('bpmDisplay');

bpmSlider.addEventListener('input', (event) => {
    bpm = event.target.value;
    bpmDisplay.textContent = `BPM: ${bpm}`;
    
    // 再生中であれば、再生速度を更新
    if (isPlaying) {
        clearInterval(playInterval); // 現在の再生を止める
        intervalTime = (60 / bpm) * 1000; // 新しいBPMで間隔を計算
        playSequence(); // 新しい間隔で再生再開
    }
});



////////////////////////グリッド状態をエンコードしてURLに埋め込む////////////////////////////////////////
f// グリッドの状態を取得し、URLに埋め込む関数
function getGridState() {
    const gridState = {
        activeCells: Array.from(activeCells),
        enlargedCells: Array.from(enlargedCells),
        bpm: document.getElementById('bpmSlider').value
    };

    const encodedState = encodeURIComponent(JSON.stringify(gridState));
    const url = `${window.location.origin}${window.location.pathname}?state=${encodedState}`;
    return url;
}

// 保存ボタンをクリックしたときの処理
document.getElementById('saveButton').addEventListener('click', function() {
    const shareUrl = getGridState();

    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('保存完了！URLがクリップボードにコピーされました。');
    }).catch(err => {
        console.error('クリップボードへのコピーに失敗しました:', err);
    });
});

// ページ読み込み時にURLから状態を復元する
window.addEventListener('load', loadGridFromUrl);

function loadGridFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedState = urlParams.get('state');
    
    if (encodedState) {
        const gridState = JSON.parse(decodeURIComponent(encodedState));
        
        activeCells.clear();
        enlargedCells.clear();
        
        gridState.activeCells.forEach(cell => activeCells.add(cell));
        gridState.enlargedCells.forEach(cell => enlargedCells.add(cell));
        document.getElementById('bpmSlider').value = gridState.bpm;
        
        drawGrid();
    }
}

// その他の必要なコード（例：グリッド描画など）はそのまま使用
