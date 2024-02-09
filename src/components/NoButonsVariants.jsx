
export const YES_BUTTON_CLASS = 'bg-rose-400 hover:bg-red-500 text-rose-100 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font';
export const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

// 
// All functions are closures to have the repeatTime variable in memory (and not in the global scope as a State)
// because all 'events' (mouseEnter, mouseOut) are independent but need to share the same repeatTime
//

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

        if(event == 'enter' && repeatTime > 15) {
            reset([ 'style', 'text', 'event' ]);
            noRef.onclick = no;
            return;
        }

        if(event == 'enter') {
            noRef.className = NO_BUTTON_CLASS(isDisabled);
            noRef.style.position = 'absolute';
            noRef.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            noRef.style.top = Math.random() * (window.innerHeight - 100) + 'px';
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