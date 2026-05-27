const warningBeep = new Audio('/catchphrase/warning-beep.mp3');
const endBeep = new Audio('/catchphrase/end-beep.mp3');

export const playWarningBeep = () => {
    warningBeep.currentTime = 0;
    warningBeep.volume = 0.5;
    warningBeep.play();
};

export const playEndBeep = () => {
    endBeep.currentTime = 0;
    endBeep.volume = 1;
    endBeep.play();
};