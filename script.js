/*script.js */
// 既存のキャンバス設定の後に追加
const canvas = document.getElementById('musicGrid');
const ctx = canvas.getContext('2d');

// 既存のグリッド設定の近くに追加
const STAVE_MARGIN_LEFT = 40;  // 五線譜の左マージン
const STAVE_WIDTH = 1200;      // 五線譜の幅

// 五線譜の設定と描画用の変数を追加
let vf;
let context;
let stave;
let notes = [];

// 音符の順序を定義
const NOTE_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// 音符と色の対応を定義
const noteColors = {
    'B5': 'orange',
    'A5': 'peru',
    'G5': 'green',
    'F5': 'lawngreen',
    'E5': 'deepskyblue',
    'D5': 'plum',
    'C5': 'hotpink',
    'B4': 'orange',
    'A4': 'peru',
    'G4': 'green',
    'F4': 'lawngreen',
    'E4': 'deepskyblue',
    'D4': 'plum',
    'C4': 'hotpink'
};


// グリッドの寸法設定
const rows = 16;
const cols = 32;
let cellWidth;
let cellHeight;

// キャンバスのリサイズ処理
function resizeCanvas() {
    const gridContainer = document.getElementById('grid');
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    
    // コンテナのアスペクト比を維持しながら、
    // セルが見やすいサイズになるように調整
    const minCellSize = 20; // 最小セルサイズ
    const idealCellWidth = Math.floor(containerWidth / cols);
    const idealCellHeight = Math.floor(containerHeight / rows);
    
    // セルサイズが最小値を下回らないように調整
    cellWidth = Math.max(minCellSize, idealCellWidth);
    cellHeight = Math.max(minCellSize, idealCellHeight);
    
    // キャンバスのサイズを設定
    canvas.width = cellWidth * cols;
    canvas.height = cellHeight * rows;
    
    drawGrid();
}

// ウィンドウリサイズ時のデバウンス処理を修正
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initializeStave(); // この行を追加
        updateNotes();     // この行を追加
    }, 100);
});

// 初期化時のリサイズ
window.addEventListener('load', resizeCanvas);

// アクティブなセルと拡大されたセルを追跡するためのSet
const activeCells = new Set();
const enlargedCells = new Set();

// 再生関連の変数
let currentColumn = -1;
let playInterval = null;
let isPlaying = false;


// オーディオファイルのパスを音階に対応させてマッピング
// 楽器の音源マッピング
// 楽器の音源マッピングを更新

// ドラム音源のパスを定義（上部に移動）
const drumSounds = {
    kick: 'drum/drum/drum00.mp3',
    snare: 'drum/drum/drum01.mp3'
};



const instruments = {
    piano: {
        'C4': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
        'D4': 'piano/piano_ongen/AnyConv.com__piano1-re.mp3',
        'E4': 'piano/piano_ongen/AnyConv.com__piano1-mi.mp3',
        'F4': 'piano/piano_ongen/AnyConv.com__piano1-fa.mp3',
        'G4': 'piano/piano_ongen/AnyConv.com__piano1-so.mp3',
        'A4': 'piano/piano_ongen/AnyConv.com__piano1-ra.mp3',
        'B4': 'piano/piano_ongen/AnyConv.com__piano1-shi.mp3',
        'C5': 'piano/piano_ongen/AnyConv.com__piano2-do.mp3',
        'D5': 'piano/piano_ongen/AnyConv.com__piano2-re.mp3',
        'E5': 'piano/piano_ongen/AnyConv.com__piano2-mi.mp3',
        'F5': 'piano/piano_ongen/AnyConv.com__piano2-fa.mp3',
        'G5': 'piano/piano_ongen/AnyConv.com__piano2-so.mp3',
        'A5': 'piano/piano_ongen/AnyConv.com__piano2-ra.mp3',
        'B5': 'piano/piano_ongen/AnyConv.com__piano2-shi.mp3'
    },
    trumpet: {
        'C4': 'trumpet/trumpet_ongen/trumpet-do.mp3',
        'D4': 'trumpet/trumpet_ongen/trumpet-re.mp3',
        'E4': 'trumpet/trumpet_ongen/trumpet-mi.mp3',
        'F4': 'trumpet/trumpet_ongen/trumpet-fa.mp3',
        'G4': 'trumpet/trumpet_ongen/trumpet-so.mp3',
        'A4': 'trumpet/trumpet_ongen/trumpet-ra.mp3',
        'B4': 'trumpet/trumpet_ongen/trumpet-shi.mp3',
        'C5': 'trumpet/trumpet_ongen/trumpet-do1.mp3',
        'D5': 'trumpet/trumpet_ongen/trumpet-re1.mp3',
        'E5': 'trumpet/trumpet_ongen/trumpet-mi1.mp3',
        'F5': 'trumpet/trumpet_ongen/trumpet-fa1.mp3',
        'G5': 'trumpet/trumpet_ongen/trumpet-so1.mp3',
        'A5': 'trumpet/trumpet_ongen/trumpet-ra1.mp3',
        'B5': 'trumpet/trumpet_ongen/trumpet-shi1.mp3'
    },
    guitar: {
        'C4': 'guitar/guitar_ongen/guitar-do.mp3',
        'D4': 'guitar/guitar_ongen/guitar-re.mp3',
        'E4': 'guitar/guitar_ongen/guitar-mi.mp3',
        'F4': 'guitar/guitar_ongen/guitar-fa.mp3',
        'G4': 'guitar/guitar_ongen/guitar-so.mp3',
        'A4': 'guitar/guitar_ongen/guitar-ra.mp3',
        'B4': 'guitar/guitar_ongen/guitar-shi.mp3',
        'C5': 'guitar/guitar_ongen/guitar-do1.mp3',
        'D5': 'guitar/guitar_ongen/guitar-re1.mp3',
        'E5': 'guitar/guitar_ongen/guitar-mi1.mp3',
        'F5': 'guitar/guitar_ongen/guitar-fa1.mp3',
        'G5': 'guitar/guitar_ongen/guitar-so1.mp3',
        'A5': 'guitar/guitar_ongen/guitar-ra1.mp3',
        'B5': 'guitar/guitar_ongen/guitar-shi1.mp3'
    },
    violin: {
        'C4': 'violin/violin_ongen/violin-do.mp3',
        'D4': 'violin/violin_ongen/violin-re.mp3',
        'E4': 'violin/violin_ongen/violin-mi.mp3',
        'F4': 'violin/violin_ongen/violin-fa.mp3',
        'G4': 'violin/violin_ongen/violin-so.mp3',
        'A4': 'violin/violin_ongen/violin-ra.mp3',
        'B4': 'violin/violin_ongen/violin-shi.mp3',
        'C5': 'violin/violin_ongen/violin-do1.mp3',
        'D5': 'violin/violin_ongen/violin-re1.mp3',
        'E5': 'violin/violin_ongen/violin-mi1.mp3',
        'F5': 'violin/violin_ongen/violin-fa1.mp3',
        'G5': 'violin/violin_ongen/violin-so1.mp3',
        'A5': 'violin/violin_ongen/violin-ra1.mp3',
        'B5': 'violin/violin_ongen/violin-shi1.mp3'
    }
};

// 現在選択されている楽器を追跡する変数を追加
let currentInstrument = 'piano';

// 音階のマッピング

const noteMapping = ['B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

// キャンバスのクリックイベントリスナーを設定
canvas.addEventListener('click', handleCanvasClick);

// アクティブなセルをトグルする関数
function toggleActiveCell(cellIndex) {
    if (activeCells.has(cellIndex)) {
        activeCells.delete(cellIndex);
    } else {
        activeCells.add(cellIndex);
    }
    updateNotes(); // この行を追加
}

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



// 拡大されたセルをトグルする関数
function toggleEnlargedCell(cellIndex) {
    if (enlargedCells.has(cellIndex)) {
        enlargedCells.delete(cellIndex);
    } else {
        enlargedCells.add(cellIndex);
    }
}

// 行から音階への変換関数
// rowToNote関数を確認・修正
function rowToNote(row) {
    if (row < rows - 2) { // ピアノ音源用の行
        return noteMapping[row];
    } else if (row === rows - 2) { // スネアドラム用の行
        return 'snare';
    } else if (row === rows - 1) { // キックドラム用の行
        return 'kick';
    }
}

// 音源を再生する関数
// playSound関数を以下のように更新
function playSound(cellIndex, duration = 1) {
    const row = Math.floor(cellIndex / cols);
    const note = rowToNote(row);
    
    console.log('Playing note:', note, 'Row:', row);

    if (note === 'kick' || note === 'snare') {
        if (drumSounds[note]) {
            console.log('Playing drum sound:', drumSounds[note]);
            const audio = new Audio(drumSounds[note]);
            audio.volume = 0.5;
            
            audio.play()
                .then(() => {
                    console.log(`${note} sound played successfully`);
                })
                .catch(error => {
                    console.error(`Error playing ${note} sound:`, error);
                });
        } else {
            console.error(`Drum sound not found for ${note}`);
        }
    } else {
        const audioFile = instruments[currentInstrument][note];
        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.volume = 0.5;
            audio.play()
                .catch(error => console.error('音源の再生に失敗:', error));
        }
    }

    if (duration) {
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, duration * 1000);
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
// playSequence関数を更新
function playSequence() {
    currentColumn = 0;
    const intervalTime = (60 / bpm) * 1000; // BPMに基づいた間隔

    playInterval = setInterval(() => {
        if (currentColumn >= cols) {
            currentColumn = 0;
        }

        // 現在の列のアクティブなセルの音を再生
        for (let row = 0; row < rows; row++) {
            const cellIndex = row * cols + currentColumn;
            if ((row < rows - 2 && activeCells.has(cellIndex)) || 
                (row >= rows - 2 && enlargedCells.has(cellIndex))) {
                playSound(cellIndex, 0.5); // 各音を0.5秒で再生
            }
        }

        drawGrid();
        currentColumn++;
    }, intervalTime);
}



// デバッグ用：ドラムサウンドのパスを確認
console.log('Drum sounds configuration:', drumSounds);

function playSound(cellIndex, duration = 1) {
    const row = Math.floor(cellIndex / cols);
    const note = rowToNote(row);
    
    // デバッグ用ログ
    console.log('Row:', row);
    console.log('Note type:', note);

    if (note === 'kick' || note === 'snare') {
        // デバッグ用ログ
        console.log('Playing drum sound:', note);
        console.log('Drum sound path:', drumSounds[note]);
        
        const audio = new Audio(drumSounds[note]);
        audio.volume = 0.5;
        
        // エラーハンドリングを追加
        audio.play()
            .then(() => {
                console.log(`${note} sound played successfully`);
            })
            .catch(error => {
                console.error(`Error playing ${note} sound:`, error);
            });
        
        if (duration) {
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, duration * 1000);
        }
    } else {
        // 既存の楽器音源の処理
        const audioFile = instruments[currentInstrument][note];
        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.volume = 0.5;
            audio.play()
                .catch(error => console.error('音源の再生に失敗:', error));
            
            if (duration) {
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, duration * 1000);
            }
        }
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
// グリッドを描画する関数も更新
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

            // セルの枠線
            ctx.strokeStyle = '#00CED1';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

            // C4の下の枠線を太く
            if (row === 13) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(col * cellWidth, (row + 1) * cellHeight);
                ctx.lineTo((col + 1) * cellWidth, (row + 1) * cellHeight);
                ctx.strokeStyle = '#00CED1';
                ctx.stroke();
                ctx.lineWidth = 1;
            }

            // 4列ごとに区切り線を太く
            if (col % 4 === 0) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(col * cellWidth, 0);
                ctx.lineTo(col * cellWidth, canvas.height);
                ctx.strokeStyle = '#00CED1';
                ctx.stroke();
                ctx.lineWidth = 1;
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
    
    updateNotes();
}


// 五線譜の初期化関数
// 五線譜の初期化関数を修正
// 五線譜の初期化関数を修正
function initializeStave() {
    try {
        const div = document.getElementById('musical-score');
        if (!div) {
            console.error('musical-score element not found');
            return false;
        }

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        const renderer = new Vex.Flow.Renderer(
            div,
            Vex.Flow.Renderer.Backends.SVG
        );

        // レンダラーのサイズを調整
        renderer.resize(STAVE_WIDTH + 100, 120);
        context = renderer.getContext();

        if (!context) {
            throw new Error('Failed to get rendering context');
        }

        // 五線譜のY位置を調整
        const staveY = 0;

        // ト音記号用の五線譜
        const clefStave = new Vex.Flow.Stave(10, staveY, 50);
        clefStave.addClef('treble');
        clefStave.setContext(context);
        clefStave.draw();

        // メインの五線譜
        stave = new Vex.Flow.Stave(60, staveY, STAVE_WIDTH);
        stave.setContext(context);
        
        // 小節線を非表示に
        stave.setEndBarType(Vex.Flow.Barline.type.NONE);
        stave.draw();

        // 五線の位置を取得
        const staveInfo = stave.getYForLine(0); // 第一線のY座標
        const lineSpacing = stave.getSpacingBetweenLines();
        const totalLines = 5;

        // 小節線を描画
        const columnWidth = STAVE_WIDTH / cols;
        for (let i = 0; i <= cols; i++) {
            const x = 60 + (i * columnWidth);
            const lineWidth = i % 4 === 0 ? 1 : 0.5;
            const lineColor = i % 4 === 0 ? '#000000' : '#666666';
            
            context.beginPath();
            context.moveTo(x, staveInfo);  // 第一線から
            context.lineTo(x, staveInfo + (lineSpacing * (totalLines - 1))); // 第五線まで
            context.strokeStyle = lineColor;
            context.lineWidth = lineWidth;
            context.stroke();
        }

        return true;
    } catch (error) {
        console.error('Error initializing stave:', error);
        return false;
    }
}

function updateNotes() {
    try {
        if (!context || !stave) {
            if (!initializeStave()) return;
        }

        context.clear();
        
        // 五線譜の再描画
        const staveY = 0;
        const clefStave = new Vex.Flow.Stave(10, staveY, 50);
        clefStave.addClef('treble');
        clefStave.setContext(context);
        clefStave.draw();

        stave.setContext(context);
        stave.draw();

        // 小節線の再描画
        const staveInfo = stave.getYForLine(0);
        const lineSpacing = stave.getSpacingBetweenLines();
        const totalLines = 5;
        const columnWidth = STAVE_WIDTH / cols;

        for (let i = 0; i <= cols; i++) {
            const x = 60 + (i * columnWidth);
            const lineWidth = i % 4 === 0 ? 1 : 0.5;
            const lineColor = i % 4 === 0 ? '#000000' : '#666666';
            
            context.beginPath();
            context.moveTo(x, staveInfo);
            context.lineTo(x, staveInfo + (lineSpacing * (totalLines - 1)));
            context.strokeStyle = lineColor;
            context.lineWidth = lineWidth;
            context.stroke();
        }

        // 音符の処理
        for (let col = 0; col < cols; col++) {
            const notesInThisColumn = [];
            
            for (let row = 0; row < rows - 2; row++) {
                const cellIndex = row * cols + col;
                if (activeCells.has(cellIndex)) {
                    const note = noteMapping[row];
                    notesInThisColumn.push({
                        note: note,
                        color: noteColors[note]
                    });
                }
            }

            if (notesInThisColumn.length > 0) {
                // 音符をソート
                notesInThisColumn.sort((a, b) => {
                    const aOctave = parseInt(a.note.slice(-1));
                    const bOctave = parseInt(b.note.slice(-1));
                    if (aOctave !== bOctave) return aOctave - bOctave;
                    
                    const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
                    const aNote = a.note.slice(0, -1);
                    const bNote = b.note.slice(0, -1);
                    return noteOrder.indexOf(aNote) - noteOrder.indexOf(bNote);
                });

                const keys = notesInThisColumn.map(n => 
                    n.note.toLowerCase().replace(/(\w)(\d)/, '$1/$2')
                );

                try {
                    // 全音符として音符を作成
                    const staveNote = new Vex.Flow.StaveNote({
                        clef: "treble",
                        keys: keys,
                        duration: "w",  // 'w' は whole note (全音符) を表す
                        auto_stem: false // 符幹なしに設定
                    });

                    // 音符の色を設定
                    notesInThisColumn.forEach((noteInfo, i) => {
                        staveNote.setKeyStyle(i, { 
                            fillStyle: noteInfo.color,
                            strokeStyle: noteInfo.color
                        });
                    });

                    staveNote.setStave(stave);
                    
                    // 音符の位置を設定
                    const noteX = 60 + (columnWidth * col);
                    const tickContext = new Vex.Flow.TickContext()
                        .setX(noteX)
                        .setPadding(0);
                    
                    staveNote.setTickContext(tickContext);
                    staveNote.draw();

                } catch (e) {
                    console.error('Error creating note:', e);
                }
            }
        }

    } catch (error) {
        console.error('Error updating notes:', error);
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




// グリッドのサイズ

// セルのデータを取得（アクティブ、拡大の状態を取得）
function collectCellData() {
    return Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
            const cellIndex = row * cols + col;
            return {
                active: activeCells.has(cellIndex),
                enlarged: enlargedCells.has(cellIndex)
            };
        })
    );
}

// JSONデータをURLクエリ形式に変換
function saveToUrl(jsonData) {
    const queryString = encodeURIComponent(JSON.stringify(jsonData));
    const newUrl = `${window.location.origin + window.location.pathname}?data=${queryString}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    return newUrl;
}

// DOMContentLoadedイベントリスナーを以下のように変更
// 初期化時に五線譜を設定
// DOMContentLoadedイベントリスナーを修正
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化コード
    resizeCanvas();
    initializeStave(); // この行を追加
    
    // 保存ボタンのクリックイベント設定
    document.getElementById('saveButton').addEventListener('click', () => {
        const cellData = collectCellData();
        const newUrl = saveToUrl(cellData);
        window.location.href = `save.html?url=${encodeURIComponent(newUrl)}`;
    });

    // 楽器選択のイベントリスナーを設定
    const instrumentSelect = document.getElementById('instrumentSelect');
    instrumentSelect.addEventListener('change', (event) => {
        currentInstrument = event.target.value;
        console.log('Selected instrument:', currentInstrument);
    });

    // URLからのデータ読み込み
    const savedData = loadDataFromUrl();
    if (savedData) {
        activeCells.clear();
        enlargedCells.clear();
        savedData.forEach((row, rowIndex) =>
            row.forEach((cell, colIndex) => {
                const cellIndex = rowIndex * cols + colIndex;
                if (cell.active) activeCells.add(cellIndex);
                if (cell.enlarged) enlargedCells.add(cellIndex);
            })
        );
        drawGrid();
        updateNotes(); // この行を追加
    }
});

// URLからデータを解析して取得
function loadDataFromUrl() {
    const dataParam = new URLSearchParams(window.location.search).get('data');
    if (dataParam) {
        try {
            return JSON.parse(decodeURIComponent(dataParam));
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
        }
    }
    return null;
}

// ページ読み込み時のデータ復元
window.addEventListener('DOMContentLoaded', () => {
    const savedData = loadDataFromUrl();
    if (savedData) {
        activeCells.clear();
        enlargedCells.clear();
        savedData.forEach((row, rowIndex) =>
            row.forEach((cell, colIndex) => {
                const cellIndex = rowIndex * cols + colIndex;
                if (cell.active) activeCells.add(cellIndex);
                if (cell.enlarged) enlargedCells.add(cellIndex);
            })
        );
        drawGrid();
    }
});




