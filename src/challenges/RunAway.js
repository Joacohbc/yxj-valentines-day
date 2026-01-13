const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

function getRandomInt(max, minDiff) {
    let prevVal = 0;
    return () => {
        let val = Math.floor(Math.random() * max);
        while(Math.abs(val - prevVal) < minDiff) {
            val = Math.floor(Math.random() * max);
        }
        prevVal = val;
        return val;
    }
}

export default {
    id: "run_away",
    name: "Botón Huidizo",
    description: "El botón se mueve a una posición aleatoria al intentar hacer clic.",
    defaultConfig: {
        runCount: 15,
        resetDelay: 2500
    },
    run: (element, callbacks, config) => {
        const { runCount, resetDelay } = config;
        const { onLose } = callbacks;

        let repeatTime = 0;
        let toutId = null;

        const getLeft = getRandomInt(95, 10);
        const getTop = getRandomInt(95, 10);

        const onInteraction = (e) => {
            e.stopPropagation();

            if (repeatTime > runCount) {
                // Done
                element.style.position = ''; // Reset position?
                // Actually original code reset everything.
                element.className = NO_BUTTON_CLASS(false);
                element.style = {};
                element.style.transition = 'all 0.2s ease-in-out';
                element.innerHTML = '× NO ×';

                element.onclick = onLose;

                // Clear listeners
                element.onmouseover = null;
                element.onmouseout = null;
                element.ontouchstart = null;
                element.ontouchend = null;
                return;
            }

            element.className = NO_BUTTON_CLASS(false);
            element.style.position = 'absolute';
            element.style.left = getLeft() + '%';
            element.style.top = getTop() + '%';
            element.style.transform = 'rotate(' + Math.random() * 60 + 'deg)';
            element.style.transition = 'all 0.2s ease-in-out';
            element.innerHTML = 'Intenta otra vez c:';
            element.onclick = null;

            repeatTime++;

            clearTimeout(toutId);
            toutId = setTimeout(() => {
                 // reset style
                 // Original: reset(['style', 'text'])
                 // But keeps it absolute?
                 // Original reset function:
                 /*
                    if(resets.includes('style')) {
                        noRef.current.className = NO_BUTTON_CLASS(false);
                        noRef.current.style = {};
                        noRef.current.style.transition = 'all 0.2s ease-in-out';
                    }
                    if(resets.includes('text')) {
                        noRef.current.innerHTML = '× NO ×';
                    }
                 */
                 // Wait, if it resets style {}, it goes back to static position flow?
                 // Yes. So it "runs away" but then comes back if you wait?

                 element.className = NO_BUTTON_CLASS(false);
                 // We can't clear all style because we lose position if we want it to stay?
                 // But original code calls reset which clears style.
                 // So yes, it resets to original position.
                 element.style.position = '';
                 element.style.left = '';
                 element.style.top = '';
                 element.style.transform = '';
                 element.style.transition = 'all 0.2s ease-in-out';
                 element.innerHTML = '× NO ×';

            }, resetDelay);
        };

        element.onmouseover = onInteraction;
        element.ontouchstart = onInteraction;
        element.onclick = onInteraction;

        return () => {
             clearTimeout(toutId);
             element.onmouseover = null;
             element.ontouchstart = null;
             element.onclick = null;
             element.style = {};
        };
    }
};
