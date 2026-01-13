
const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

export default {
    id: "delayed_unlock",
    name: "Frase con espera",
    description: "Muestra un mensaje y espera unos segundos antes de permitir continuar.",
    defaultConfig: {
        initialText: "× NO ×",
        clickedText: "Texto al hacer click",
        unlockDelay: 3000
    },
    run: (element, callbacks, config) => {
        const { initialText, clickedText, unlockDelay } = config;
        const { onLose } = callbacks; // onLose is equivalent to 'no' which decreases life or loses

        element.innerHTML = initialText.toUpperCase();
        element.className = NO_BUTTON_CLASS(false);

        const onClick = (e) => {
            e.stopPropagation();

            element.className = NO_BUTTON_CLASS(true);
            element.onclick = null; // Disable further clicks
            element.innerHTML = clickedText.toUpperCase();

            setTimeout(() => {
                onLose();
            }, unlockDelay);
        };

        element.onclick = onClick;

        // Cleanup function
        return () => {
            element.onclick = null;
        };
    }
};
