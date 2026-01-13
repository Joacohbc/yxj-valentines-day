const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

export default {
    id: "math_challenge",
    name: "Problema Matemático",
    description: "Pide resolver una operación matemática simple.",
    defaultConfig: {
        maxNumber: 10,
        operations: ['+', '-', '*']
    },
    run: (element, callbacks, config) => {
        const { maxNumber, operations } = config;
        const { onLose } = callbacks;

        let num1 = Math.floor(Math.random() * maxNumber);
        let num2 = Math.floor(Math.random() * maxNumber + 1);
        let operation = operations[Math.floor(Math.random() * operations.length)];
        // Safety check for eval
        if (!['+', '-', '*'].includes(operation)) operation = '+';

        let result = eval(`${num1} ${operation} ${num2}`);

        // Avoid 0 result
        let attempts = 0;
        while (result === 0 && attempts < 10) {
             num1 = Math.floor(Math.random() * maxNumber);
             num2 = Math.floor(Math.random() * maxNumber + 1);
             operation = operations[Math.floor(Math.random() * operations.length)];
             result = eval(`${num1} ${operation} ${num2}`);
             attempts++;
        }

        const id = Math.random().toString(36).substring(2, 15);

        element.style.transition = 'all 0.2s ease-in-out';
        element.onclick = null;

        // Render input
        element.innerHTML = `${num1} ${operation} ${num2} = <input id="${id}" style="color:black; border: 1px solid gray; padding: 5px; border-radius: 5px; width: 60px;"> ?`;

        // Focus input after render
        setTimeout(() => {
            const input = document.getElementById(id);
            if (input) input.focus();
        }, 0);

        const checkResult = () => {
             const input = document.getElementById(id);
             if (!input) return;

             if (input.value === result.toString()) {
                element.innerHTML = `× Veo que no te saltaste las tablas en la escuela ×`;
                element.onclick = onLose;
                // Remove input listener
                input.onchange = null;
             } else {
                element.className = "animate-shake animate-once " + NO_BUTTON_CLASS(false);
                // In original code, it recursively calls avoidClickNo3 to reset the problem
                // Here we can just restart the run function essentially, but we need to be careful with recursion/loops.
                // Or just generate a new problem within this scope.

                // Let's regenerate problem
                num1 = Math.floor(Math.random() * maxNumber);
                num2 = Math.floor(Math.random() * maxNumber + 1);
                operation = operations[Math.floor(Math.random() * operations.length)];
                result = eval(`${num1} ${operation} ${num2}`);
                 while (result === 0) {
                     num1 = Math.floor(Math.random() * maxNumber);
                     num2 = Math.floor(Math.random() * maxNumber + 1);
                     result = eval(`${num1} ${operation} ${num2}`);
                }
                element.innerHTML = `${num1} ${operation} ${num2} = <input id="${id}" style="color:black; border: 1px solid gray; padding: 5px; border-radius: 5px; width: 60px;"> ?`;
                const newInput = document.getElementById(id);
                if (newInput) {
                    newInput.value = 0;
                    newInput.focus();
                    newInput.onchange = checkResult;
                }
             }
        };

        // Attach listener to document/input via event delegation or direct attachment?
        // Direct attachment works but we need to wait for DOM.
        // We used setTimeout above.

        // Better: use a delegated event listener on the element to catch change events from the input?
        // But 'change' doesn't bubble on all browsers? It does on modern ones.
        // Or just re-attach to the input.

        setTimeout(() => {
            const input = document.getElementById(id);
            if (input) input.onchange = checkResult;
        }, 50);

        return () => {
            element.onclick = null;
            element.style.transition = '';
            // Input is inside element, so it will be removed when element content changes.
        };
    }
};
