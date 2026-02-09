const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

const roseColors = {
    50: 'bg-pink-50',
    100: 'bg-pink-100',
    200: 'bg-pink-200',
    300: 'bg-pink-300',
    400: 'bg-pink-400',
    500: 'bg-pink-500',
    600: 'bg-pink-600',
    700: 'bg-pink-700',
    800: 'bg-pink-800',
    900: 'bg-pink-900',
};

const getColorClass = (clicksLeft) => {
    // Mapping remaining clicks to colors. Assuming max around 20.
    // If we have more clicks, we might want to scale this.
    // For now using the original logic which maps directly to values.

    // original logic was:
    // if (clickTime <= 2) roseColors[50] ...

    if (clicksLeft <= 2) return roseColors[50];
    if (clicksLeft <= 4) return roseColors[100];
    if (clicksLeft <= 6) return roseColors[200];
    if (clicksLeft <= 8) return roseColors[300];
    if (clicksLeft <= 10) return roseColors[400];
    if (clicksLeft <= 12) return roseColors[500];
    if (clicksLeft <= 14) return roseColors[600];
    if (clicksLeft <= 16) return roseColors[700];
    if (clicksLeft <= 18) return roseColors[800];
    return roseColors[900];
};

export default {
    id: "click_count",
    name: "Contador de Clics",
    description: "Requiere una cierta cantidad de clics para desbloquear el botón.",
    defaultConfig: {
        clicksRequired: 20,
        messageTemplate: "× Da {n} clics para desbloquear el NO ×"
    },
    run: (element, callbacks, config) => {
        let clicksLeft = config.clicksRequired;
        const messageTemplate = config.messageTemplate || "× Da {n} clics para desbloquear el NO ×";
        const { onLose } = callbacks;

        const updateView = () => {
            element.innerHTML = messageTemplate.replace("{n}", clicksLeft);
            if (clicksLeft < config.clicksRequired) { // Only change color after first click as per original logic?
                // Original logic: applied colorClass immediately on click.
                // Initial state: NO_BUTTON_CLASS(false) which is blue-300.
                // On click: applies pink classes.
                 element.className = 'max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font ' + getColorClass(clicksLeft);
            } else {
                 element.className = NO_BUTTON_CLASS(false);
            }
        };

        // Initial render
        updateView();

        const onClick = (e) => {
            e.stopPropagation();

            if (clicksLeft <= 0) {
                onLose();
                return;
            }

            clicksLeft--;
            updateView();

            if (clicksLeft === 0) {
                 // Next click triggers onLose
                 // Update view to indicate it's ready?
                 // Original logic:
                 // if(clickTime == 0) { noRef.onclick = no; return; }
                 // So when it hits 0, next click calls no.
            }
        };

        element.onclick = onClick;

        return () => {
            element.onclick = null;
        };
    }
};
