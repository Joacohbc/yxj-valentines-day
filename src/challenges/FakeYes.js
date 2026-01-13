
const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;
const YES_BUTTON_CLASS = 'bg-rose-400 hover:bg-red-500 text-rose-100 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font';

export default {
    id: "fake_yes",
    name: "Falso SI",
    description: "El botón cambia a 'SI' al pasar el mouse, pero requiere varios intentos.",
    defaultConfig: {
        switchCount: 3,
        initialWait: 2400
    },
    run: (element, callbacks, config) => {
        const { switchCount, initialWait } = config;
        const { onLose, onWin } = callbacks; // onWin corresponds to 'yes' action

        let repeatTime = 0;
        let start = false;

        element.onclick = null;
        element.style.transition = 'all 2.5s ease-in-out';
        element.className = "text-black mb-3 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font";
        element.innerHTML = 'Cuidado con tus clicks! c:';

        const timer = setTimeout(() => {
            element.style.transition = 'all 0.2s ease-in-out';
            element.className = NO_BUTTON_CLASS(false);
            element.innerHTML = '× NO ×';
            start = true;
        }, initialWait);

        const onEnter = (e) => {
            if (!start) return;
            e.stopPropagation();

            if (repeatTime >= switchCount) {
                // Done, behave like normal button (click to lose)
                element.onclick = onLose;
                // Clean events
                element.onmouseover = null;
                element.onmouseout = null;
                element.ontouchstart = null;
                element.ontouchend = null;

                element.className = NO_BUTTON_CLASS(false);
                element.innerHTML = '× NO ×';
                return;
            }

            element.style.transition = 'all 0.2s ease-in-out';
            element.className = "mb-2 animate-wiggle animate-once " + YES_BUTTON_CLASS;
            // 'o'.repeat(3 - repeatTime) logic
            const oRep = Math.max(0, 3 - repeatTime);
            const os = 'o'.repeat(oRep);
            element.innerHTML = `${os} SI ${os}`;
            element.onclick = onWin;
            repeatTime++;
        };

        const onOut = (e) => {
            if (!start) return;
            // e.stopPropagation(); // mouseout bubbling might be needed?

            if (repeatTime > switchCount) return;

            element.className = NO_BUTTON_CLASS(false);
            element.style.transition = 'all 0.2s ease-in-out';
            element.innerHTML = '× NO ×';
            element.onclick = null; // Remove 'yes' action
        };

        element.onmouseover = onEnter;
        element.ontouchstart = onEnter;
        element.onmouseout = onOut;
        element.ontouchend = onOut;

        return () => {
            clearTimeout(timer);
            element.onmouseover = null;
            element.ontouchstart = null;
            element.onmouseout = null;
            element.ontouchend = null;
            element.onclick = null;
            element.style.transition = '';
        };
    }
};
