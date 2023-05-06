import { normalDistribution } from "./normalDistribution";

export function typeText(element: HTMLElement, text: string, delay: number, stddev: number, callback?: () => void): Promise<void> {
    let index = 0;

    return new Promise((resolve) => {
        const typeCharacter = () => {
            if (index < text.length) {
                const character = text[index] === ' ' ? '&nbsp;' : text[index];
                element.innerHTML += character;
                index++;

                // Generate a random typing delay within a range
                if (callback) {
                    callback();
                }

                setTimeout(typeCharacter, normalDistribution(delay, stddev));
            } else {
                resolve();
            }
        };

        typeCharacter();
    });
}

export function typeValue(element: HTMLInputElement, text: string, typingSpeed: number, randAmp: number): Promise<void> {
    let index = 0;
    randAmp = randAmp ? randAmp : 1;

    return new Promise((resolve) => {
        const typeCharacter = () => {
            if (index < text.length) {
                const character = text[index];
                element.value += character;
                index++;

                // Generate a random typing delay within a range
                const randomDelay = typingSpeed + Math.random() * randAmp * typingSpeed - randAmp * typingSpeed / 2;

                setTimeout(typeCharacter, randomDelay);
            } else {
                resolve();
            }
        };

        typeCharacter();
    });
}