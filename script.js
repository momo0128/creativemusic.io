document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('color-grid');
    const ctx = canvas.getContext('2d');
    const rows = 18; 
    const cols = 32;
    


    // 上部と下部の余白を設定
    const paddingTop = 100;
    const paddingBottom = 150;

    // 親要素の幅に合わせてcanvasの幅を設定
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = window.innerHeight - paddingTop - paddingBottom;

    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

//行ごとに色を定義
    const rowColors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00",
        "#00FF7F", "#00FFFF", "#007FFF", "#0000FF", "#7F00FF",
        "#FF00FF", "#FF007F", "#FF7F7F", "#7F7F7F", "#FFD700", "#ADFF2F",
        "#8A2BE2", "#DC143C" 
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

    //色に対応した周波数を定義する
    const colorSounds = {
        "#FF0000": 220, "#FF7F00": 246.94, "#FFFF00": 277.18, "#7FFF00": 293.66,
        "#00FF00": 329.63, "#00FF7F": 369.99, "#00FFFF": 415.30, "#007FFF": 440,
        "#0000FF": 493.88, "#7F00FF": 554.37, "#FF00FF": 622.25, "#FF007F": 698.46,
        "#FF7F7F": 739.99, "#7F7F7F": 783.99, "#FFD700": 880, "#ADFF2F": 987.77,
        "#8A2BE2": 1046.50, "#DC143C": 1174.66 
    };

    // canvas要素がクリックされた時のイベントリスナーを追加する
canvas.addEventListener('click', (event) => {
    // canvas要素の位置情報を取得する
    const rect = canvas.getBoundingClientRect();
    // クリックされた位置のx座標とy座標を計算する
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // クリックされた位置が属する列と行を計算する
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    // 現在の色と新しい色を決定する
    const currentColor = grid[row][col];
    const newColor = currentColor === 'white' ? rowColors[row] : 'white';

    // グリッドの色を更新し、描画する
    grid[row][col] = newColor;
    ctx.fillStyle = newColor;
    ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

    // 最下行の場合は円を描画する
    if (row === rows - 1) {
        drawCircle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // 半径を12px小さくする
    } 
    // 下から2番目の行の場合は三角形を描画する
    else if (row === rows - 2) {
        drawTriangle(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 12); // サイズを12px小さくする
    }

    // 新しい色に対応する音を再生する
    playSound(newColor);
});

// 色に対応する音を再生する関数
function playSound(color) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const frequency = colorSounds[color];
    
    // 色に対応する周波数が定義されている場合
    if (frequency) {
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 500); // 500ms後に音を停止する
    } else {
        console.log(`No sound defined for color: ${color}`);
    }
}

// 再生中かどうかを示すフラグと、再生中に使用するインターバルを管理する変数を定義する
let isPlaying = false;
let playInterval;

// 再生/停止ボタンがクリックされた時の処理を定義する
document.getElementById('play-sound-button').addEventListener('click', () => {
    const button = document.getElementById('play-sound-button');
    if (isPlaying) {
        // 再生中の場合、停止する
        isPlaying = false;
        button.textContent = 'Play';
        clearInterval(playInterval);
    } else {
        // 停止中の場合、再生する
        isPlaying = true;
        button.textContent = 'Stop';
        playColumns(); // 列ごとに順番に再生する
    }
});

   // playSound関数の外で、単一のAudioContextインスタンスを作成する
const audioContext = new AudioContext();

// 色に対応する音を再生する関数
function playSound(color) {
    const oscillator = audioContext.createOscillator();
    const frequency = colorSounds[color];
    
    // 色に対応する周波数が定義されている場合
    if (frequency) {
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 500); // 500ms後に音を停止する
    } else {
        console.log(`No sound defined for color: ${color}`);
    }
}

// 列ごとに色を順番に再生する関数
function playColumns() {
    let col = 0;
    
    function playNextColumn() {
        if (col < cols && isPlaying) {
            // 列の元の色を保存する配列を作成する
            let originalColors = [];
            for (let row = 0; row < rows; row++) {
                originalColors[row] = grid[row][col];
                grid[row][col] = '#EEEEEE'; // 列の色を青に変更する
            }
            drawGrid(); // グリッドを描画する

            // 各行の色に対応する音を再生する
            for (let row = 0; row < rows; row++) {
                const color = originalColors[row];
                if (color !== 'white') playSound(color);
            }

            // 一定時間後に元の色に戻す
            setTimeout(() => {
                for (let row = 0; row < rows; row++) {
                    grid[row][col] = originalColors[row];
                }
                drawGrid(); // グリッドを描画する
                col++; // 次の列に進む

                // 全ての列が再生されたら、再度最初の列から再生する
                if (col < cols) {
                    playNextColumn();
                } else {
                    col = 0;
                    if (isPlaying) playNextColumn();
                }
            }, 600); // 600ms後に次の列を再生する
        }
    }

    playNextColumn(); // 最初の列を再生する
}


document.getElementById('save-button').addEventListener('click', () => {
    const gridData = {
        rows: rows,
        cols: cols,
        grid: grid
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gridData)
    };

    fetch('/saveGrid', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Save successful:', data.message);
            // ファイルダウンロードの処理を実行する
            downloadFile();
        })
        .catch(error => {
            console.error('Error saving grid:', error);
            // エラー処理を記述
        });
});

// ファイルをダウンロードする関数
function downloadFile() {
    fetch('/downloadGrid')
        .then(response => response.blob())
        .then(blob => {
            // BlobからURLを生成する
            const url = window.URL.createObjectURL(blob);

            // <a>要素を作成し、ダウンロードリンクを設定する
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gridData.json'; // ダウンロード時のファイル名を指定する
            document.body.appendChild(a);
            a.click();

            // 不要になったURLオブジェクトを解放する
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            // エラー処理を記述
        });
}



});
