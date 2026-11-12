const warningBeep = new Audio('/catchphrase/warning-beep.mp3');
const endBeep = new Audio('/catchphrase/end-beep.mp3');

const play = (audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    void audio.play().catch(() => {
        // Autoplay can reject before a gesture, or the file can be missing.
    });
};

export const playWarningBeep = () => {
    warningBeep.volume = 0.5;
    play(warningBeep);
};

export const playEndBeep = () => {
    endBeep.volume = 1;
    play(endBeep);
};