
const YES_BUTTON_CLASS = 'bg-rose-400 hover:bg-red-500 text-rose-100 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font';
const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

// 
// All functions are closures to have the repeatTime variable in memory (and not in the global scope as a State)
// because all 'events' (mouseEnter, mouseOut) are independent but need to share the same repeatTime
//

export const avoidClickNo2 = (event, noRef, no, yes, isDisabled, styleReset) => {
    let repeatTime = 0;

    return () => {
        console.log('avoidClickNo2', event, repeatTime);

        if(repeatTime > 5) {
            styleReset();
            noRef.current.innerHTML = '× NO ×';
            noRef.current.onclick = no;
            return;
        }

        if (event === 'enter') {
            noRef.current.className = "mb-2 animate-wiggle animate-once " + YES_BUTTON_CLASS;
            noRef.current.innerHTML = 'o DALE QUE SI! o';
            noRef.current.onclick = yes;
            repeatTime++;
            return;
        }

        if (event === 'out') {
            noRef.current.className = NO_BUTTON_CLASS(isDisabled);
            noRef.current.style.transition = 'all 0.2s ease-in-out';
            noRef.current.innerHTML = '× NO ×';
            noRef.current.onclick = no;
            return;
        }
    }
}

export const avoidClickNo1 = (event, noRef, no, yes, isDisabled, styleReset) => {
    let repeatTime = 0;
    let toutId = null;

    return () => {
        console.log('avoidClickNo1', event, repeatTime);

        if(repeatTime > 15) {
            noRef.current.className = NO_BUTTON_CLASS(isDisabled);
            noRef.current.style.position = 'relative';
            noRef.current.style.left = 'auto';
            noRef.current.style.top = 'auto';
            noRef.current.style.transform = 'rotate(0deg)';
            noRef.current.style.transition = 'all 0.5s ease-in-out';
            noRef.current.innerHTML = '× NO ×';
            noRef.current.onclick = no;
            return;
        }

        if(event == 'enter') {
            noRef.current.style.position = 'absolute';
            noRef.current.style.left = Math.random() * 100 + '%';
            noRef.current.style.top = Math.random() * 100 + '%';
            noRef.current.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            noRef.current.style.transition = 'all 0.2s ease-in-out';
            noRef.current.innerHTML = 'Intenta otra vez c:';
            noRef.current.onclick = null;
            repeatTime++;
    
            clearTimeout(toutId);
            toutId = setTimeout(() => {
                styleReset();
                noRef.current.innerHTML = '× NO ×';
            }, 2500)
        }
    }
}