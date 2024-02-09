
export const YES_BUTTON_CLASS = 'bg-rose-400 hover:bg-red-500 text-rose-100 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font';
export const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

// 
// All functions are closures to have the repeatTime variable in memory (and not in the global scope as a State)
// because all 'events' (mouseEnter, mouseOut) are independent but need to share the same repeatTime
//


export const avoidClickNo4 = (event, noRef, no, yes, isDisabled, reset) => {
    let clickTime = 20;
    
    noRef.innerHTML = ` × Da ${clickTime} para desbloquear el NO ×`;
    
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

    const colorClass = (clickTime) => {
        if (clickTime <= 2) {
            return roseColors[50];
        } else if (clickTime <= 4) {
            return roseColors[100];
        } else if (clickTime <= 6) {
            return roseColors[200];
        } else if (clickTime <= 8) {
            return roseColors[300];
        } else if (clickTime <= 10) {
            return roseColors[400];
        } else if (clickTime <= 12) {
            return roseColors[500];
        } else if (clickTime <= 14) {
            return roseColors[600];
        } else if (clickTime <= 16) {
            return roseColors[700];
        } else if (clickTime <= 18) {
            return roseColors[800];
        } else if (clickTime <= 20) {
            return roseColors[900];
        }
    };
    
    return () => {
        if(clickTime == 0) {
            noRef.onclick = no;
            return;
        }

        if (event === 'click') {
            console.log('avoidClickNo4', clickTime);
            noRef.innerHTML = ` × Da ${clickTime} para desbloquear el NO ×`;
            noRef.className = 'max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font ' + colorClass(clickTime);
            clickTime--;
        }
    }
}

export const avoidClickNo3 = (event, noRef, no, yes, isDisabled, reset) => {
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10 + 1);
    let operation = [ '+', '-', '*' ][Math.floor(Math.random() * 3)];
    let result = eval(`${num1} ${operation} ${num2}`);

    // Avoid the 0 result (because is no detected as a change in the input field)
    while(result == 0) {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10 + 1);
        operation = [ '+', '-', '*' ][Math.floor(Math.random() * 3)];
        result = eval(`${num1} ${operation} ${num2}`);
    }

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    noRef.style.transition = 'all 0.2s ease-in-out';
    noRef.onclick = null;

    noRef.innerHTML = `× ${num1} ${operation} ${num2} = <input id=${id} type="number" style="color:black; border: 1px solid gray; padding: 5px; border-radius: 5px;"> ? ×`;
    document.getElementById(id).value = 0;
    document.getElementById(id).focus();

    document.getElementById(id).onchange = () => {
        if (document.getElementById(id).value === result.toString()) {
            noRef.innerHTML = `× Voe que note saltaste las tablas en la escuela ×`;
            noRef.onclick = no;
        } else {
            // Change the operation if the result is wrong
            noRef.className = "animate-shake animate-once " + NO_BUTTON_CLASS(isDisabled);
            avoidClickNo3('click', noRef, no, yes, isDisabled, reset);
        }
    }
}

export const avoidClickNo2 = (event, noRef, no, yes, isDisabled, reset) => {
    let repeatTime = 0;
    
    return () => {
        console.log('avoidClickNo2', event, repeatTime);

        if(repeatTime > 5) {
            reset([ 'style', 'text', 'event' ]);
            noRef.onclick = no;
            return;
        }

        if (event === 'enter') {
            noRef.className = "mb-2 animate-wiggle animate-once " + YES_BUTTON_CLASS;
            noRef.innerHTML = 'o DALE QUE SI! o';
            noRef.onclick = yes;
            repeatTime++;
            return;
        }

        if (event === 'out') {
            noRef.className = NO_BUTTON_CLASS(isDisabled);
            noRef.style.transition = 'all 0.2s ease-in-out';
            noRef.innerHTML = '× NO ×';
            noRef.onclick = no;
            return;
        }
    }
}

export const avoidClickNo1 = (event, noRef, no, yes, isDisabled, reset) => {
    let repeatTime = 0;
    let toutId = null;

    return () => {
        console.log('avoidClickNo1', event, repeatTime);

        if(event == 'enter' && repeatTime > 10) {
            reset([ 'style', 'text', 'event' ]);
            noRef.onclick = no;
            return;
        }

        if(event == 'enter') {
            noRef.className = NO_BUTTON_CLASS(isDisabled);
            noRef.style.position = 'absolute';
            
            const getRandomPosition = () => {
                const left = Math.random() * (window.innerWidth - 90);
                const top = Math.random() * (window.innerHeight - 90);
                return { left, top };
            };

            const position = getRandomPosition();
            noRef.style.left = position.left + 'px';
            noRef.style.top = position.top + 'px';
            noRef.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            noRef.style.transition = 'all 0.2s ease-in-out';
            noRef.innerHTML = 'Intenta otra vez c:';
            noRef.onclick = null;
            repeatTime++;
    
            clearTimeout(toutId);
            toutId = setTimeout(() => {
                reset([ 'style', 'text' ]);
            }, 2500)
        }
    }
}