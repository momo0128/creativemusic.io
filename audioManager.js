// audioManager.js

// ピアノの音階を定義（C3からB4まで）
const pianoNotes = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'
];

// 音声ファイルのURLを定義
const soundUrls = {
  piano: {
    'C3': 'piano1-do.mp3',
    'D3': 'piano_ongen/AnyConv.com__piano1-re.mp3',
    'E3': 'piano_ongen/AnyConv.com__piano1-mi.mp3',
    'F3': 'piano_ongen/piano1fa.aif',
    'G3': 'piano_ongen/piano1so.aif',
    'A3': 'piano_ongen/piano1ra.aif',
    'B3': 'piano_ongen/piano1shi.aif',
    'C4': 'piano_ongen/piano2do.aif',
    'D4': 'piano_ongen/piano2re.aif',
    'E4': 'piano_ongen/piano2mi.aif',
    'F4': 'piano_ongen/piano2fa.aif',
    'G4': 'piano_ongen/piano2so.aif',
    'A4': 'piano_ongen/piano2ra.aif',
    'B4': 'piano_ongen/piano2shi.aif',
  }
};

