// audioManager.js

// ピアノの音階を定義（C3からB4まで）
const pianoNotes = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'
];

// 音声ファイルのURLを定義
const pianosoundUrls = {
  piano: {
    'C3': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
    'D3': 'piano/piano_ongen/AnyConv.com__piano1-re.mp3',
    'E3': 'piano/piano_ongen/AnyConv.com__piano1-mi.mp3',
    'F3': 'piano/piano_ongen/AnyConv.com__piano1-fa.mp3',
    'G3': 'piano/piano_ongen/AnyConv.com__piano1-so.mp3',
    'A3': 'piano/piano_ongen/AnyConv.com__piano1-ra.mp3',
    'B3': 'piano/piano_ongen/AnyConv.com__piano1-shi.mp3',
    'C4': 'piano/piano_ongen/AnyConv.com__piano2-do.mp3',
    'D4': 'piano/piano_ongen/AnyConv.com__piano2-shi.mp3',
    'E4': 'piano/piano_ongen/AnyConv.com__piano2-ra.mp3',
    'F4': 'piano/piano_ongen/AnyConv.com__piano2-so.mp3',
    'G4': 'piano/piano_ongen/AnyConv.com__piano2-fa.mp3',
    'A4': 'piano/piano_ongen/AnyConv.com__piano2-mi.mp3',
    'B4': 'piano/piano_ongen/AnyConv.com__piano2-re.mp3',
    'C5': 'piano/piano_ongen/AnyConv.com__piano3-do.mp3',
  }
};


// トランペットの音階を定義（C3からB4まで）
const trumpetNotes = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'
];

const trumpetNotes = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'
];


// トランペットの音声ファイル
const trumpetsounds = {
  trumpet: {
    'C3': 'trumpet/trumpet_ongen/trumpet-do.mp3',
    'D3': 'trumpet/trumpet_ongen/trumpet-re.mp3',
    'E3': 'trumpet/trumpet_ongen/trumpet-mi.mp3',
    'F3': 'trumpet/trumpet_ongen/trumpet-fa.mp3',
    'G3': 'trumpet/trumpet_ongen/trumpet-so.mp3',
    'A3': 'trumpet/trumpet_ongen/trumpet-ra.mp3',
    'B3': 'trumpet/trumpet_ongen/trumpet-shi.mp3',
    'C4': 'trumpet/trumpet_ongen/trumpet-do1.mp3',
    'D4': 'trumpet/trumpet_ongen/trumpet-re1.mp3',
    'E4': 'trumpet/trumpet_ongen/trumpet-mi1.mp3',
    'F4': 'trumpet/trumpet_ongen/trumpet-fa1.mp3',
    'G4': 'trumpet/trumpet_ongen/trumpet-so1.mp3',
    'A4': 'trumpet/trumpet_ongen/trumpet-ra1.mp3',
    'B4': 'trumpet/trumpet_ongen/trumpet-shi1.mp3',
       
  }
};



// ギターの音声ファイル
const guitersounds = {
  guiter:{
    'C3': 'guitar/guitar_ongen/guitar-do.mp3',
    'D3': 'guitar/guitar_ongen/guitar-re.mp3',
    'E3': 'guitar/guitar_ongen/guitar-mi.mp3',
    'F3': 'guitar/guitar_ongen/guitar-fa.mp3',
    'G3': 'guitar/guitar_ongen/guitar-so.mp3',
    'A3': 'guitar/guitar_ongen/guitar-ra.mp3',
    'B3': 'guitar/guitar_ongen/guitar-shi.mp3',
    'C4': 'guitar/guitar_ongen/guitar-do1.mp3',
    'D4': 'guitar/guitar_ongen/guitar-re1.mp3',
    'E4': 'guitar/guitar_ongen/guitar-mi1.mp3',
    'F4': 'guitar/guitar_ongen/guitar-fa1.mp3',
    'G4': 'guitar/guitar_ongen/guitar-so1.mp3',
    'A4': 'guitar/guitar_ongen/guitar-ra1.mp3',
    'B4': 'guitar/guitar_ongen/guitar-shi1.mp3',
    
  }
}

//バイオリンの音声ファイル
const violinsounds = {
  violin:{
    'C3': 'violin/violin_ongen/violin-do.mp3',
    'D3': 'violin/violin_ongen/violin-re.mp3',
    'E3': 'violin/violin_ongen/violin-mi.mp3',
    'F3': 'violin/violin_ongen/violin-fa.mp3',
    'G3': 'violin/violin_ongen/violin-so.mp3',
    'A3': 'violin/violin_ongen/violin-ra.mp3',
    'B3': 'violin/violin_ongen/violin-shi.mp3',
    'C4': 'violin/violin_ongen/violin-do1.mp3',
    'D4': 'violin/violin_ongen/violin-re1.mp3',
    'E4': 'violin/violin_ongen/violin-mi1.mp3',
    'F4': 'violin/violin_ongen/violin-fa1.mp3',
    'G4': 'violin/violin_ongen/violin-so1.mp3',
    'A4': 'violin/violin_ongen/violin-ra1.mp3',
    'B4': 'violin/violin_ongen/violin-shi1.mp3',
    
  }
}


let drumkick = new Audio('drum/drum/drum00.mp3');

let audiosnare = new Audio('drum/drum/drum001.mp3');

ドラムサウンドをmp3の音源に変更したい。

kickの音源は"drum/drum/drum00.mp3"
snareの音源は"drum/drum/drum001.mp3"

として、機能は変えずに音だけ変更してください。