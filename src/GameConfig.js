import { phrases } from "./phrases.js";

// Ordered list of challenges.
// index 0 corresponds to the first challenge (when lives == totalLives)
// index len-1 corresponds to the last challenge (when lives == 1)

export const defaultGameConfig = {
    totalLives: 8,
    challenges: [
        {
            id: 'delayed_unlock',
            config: {
                initialText: '× NO ×',
                clickedText: phrases[0].text,
                unlockDelay: phrases[0].ms
            }
        },
        {
            id: 'delayed_unlock',
            config: {
                initialText: phrases[0].text,
                clickedText: phrases[1].text,
                unlockDelay: phrases[1].ms
            }
        },
        {
            id: 'delayed_unlock',
            config: {
                initialText: phrases[1].text,
                clickedText: phrases[2].text,
                unlockDelay: phrases[2].ms
            }
        },
        {
            id: 'delayed_unlock',
            config: {
                initialText: phrases[2].text,
                clickedText: phrases[3].text,
                unlockDelay: phrases[3].ms
            }
        },
        {
            id: 'click_count',
            config: {
                clicksRequired: 20
            }
        },
        {
            id: 'math_challenge',
            config: {
                maxNumber: 10,
                operations: ['+', '-', '*']
            }
        },
        {
            id: 'fake_yes',
            config: {
                switchCount: 3,
                initialWait: 2400
            }
        },
        {
            id: 'run_away',
            config: {
                runCount: 15,
                resetDelay: 2500
            }
        }
    ]
};
