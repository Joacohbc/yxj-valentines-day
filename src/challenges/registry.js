import DelayedUnlock from './DelayedUnlock.js';
import ClickCount from './ClickCount.js';
import MathChallenge from './MathChallenge.js';
import FakeYes from './FakeYes.js';
import RunAway from './RunAway.js';

const challenges = {
    [DelayedUnlock.id]: DelayedUnlock,
    [ClickCount.id]: ClickCount,
    [MathChallenge.id]: MathChallenge,
    [FakeYes.id]: FakeYes,
    [RunAway.id]: RunAway
};

export const getChallenge = (id) => challenges[id];
export const getAllChallenges = () => Object.values(challenges);
