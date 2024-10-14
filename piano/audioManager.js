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

// 音声ファイルのURLを定義
const trumpetsoundUrls = {
  piano: {
    'C3': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
    'D3': 'piano/piano_ongen/AnyConv.com__piano1-re.mp3',
    'E3': 'piano/piano_ongen/AnyConv.com__piano1-mi.mp3',
    'F3': 'piano/piano_ongen/AnyConv.com__piano1-fa.mp3',
    'G3': 'piano/piano_ongen/AnyConv.com__piano1-so.mp3',
    'A3': 'piano/piano_ongen/AnyConv.com__piano1-ra.mp3',
    'B3': 'piano/piano_ongen/AnyConv.com__piano1-shi.mp3',
    'C4': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
    'D4': 'piano/piano_ongen/AnyConv.com__piano1-shi.mp3',
    'E4': 'piano/piano_ongen/AnyConv.com__piano1-ra.mp3',
    'F4': 'piano/piano_ongen/AnyConv.com__piano1-so.mp3',
    'G4': 'piano/piano_ongen/AnyConv.com__piano1-fa.mp3',
    'A4': 'piano/piano_ongen/AnyConv.com__piano1-mi.mp3',
    'B4': 'piano/piano_ongen/AnyConv.com__piano1-re.mp3',
    'C5': 'piano/piano_ongen/AnyConv.com__piano1-do.mp3',
    
  }
};
