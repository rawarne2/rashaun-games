const warningBeep = new Audio('src/utils/warning-beep.mp3');
const endBeep = new Audio('src/utils/end-beep.mp3');

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