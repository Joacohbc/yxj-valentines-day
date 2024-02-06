import { useCallback, useRef, useState } from "react";
import { phrase } from './assets/phrases.js';
import LivesBar from "./components/LivesBar.jsx";
import './css/font.css';

const lsAccept = localStorage.getItem('accept') === 'true';
const totalLives = 8;
const lsLives = localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives')) : totalLives;


const YES_BUTTON_CLASS = 'bg-rose-400 hover:bg-red-500 text-rose-100 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font';
const NO_BUTTON_CLASS = (isDisabled) => `${!isDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} max-w-sm text-white text-wrap mx-3 mb-2 px-3 md:px-5 py-2 md:py-3 font-bold rounded-md yxj-font`;

export default function App() {

	const noRef = useRef(null);
	const [lives, setLives] = useState(lsLives);
	const [accept, setAccept] = useState(lsAccept);
	const [noIsDisabled, setNoDisabled] = useState(false);
	const [prevSelected, setPrevSelected] = useState(0);

	const yes = useCallback(() => {
		console.log('yes');
		if (accept) return;

		if (lives === totalLives) {
			setAccept(true);
			localStorage.setItem('lives', lives);
			localStorage.setItem('accept', true);
			return;
		}

		setLives(prevLives => prevLives + 1); // Increment lives by 1
		localStorage.setItem('lives', lives + 1);
		noRef.current.innerHTML = '× NO ×';
	}, [ accept, lives, setAccept, setLives ]);

	const no = useCallback(() => {
		console.log('no');
		if (accept) {
			setAccept(false);
			localStorage.setItem('accept', false);
		}

		// Don't allow to select the same phrase twice in a row
		let selected = Math.floor(Math.random() * 1);
		while (selected === prevSelected) {
			selected = Math.floor(Math.random() * phrase.length);
		}
		setPrevSelected(selected);

		setLives(prevLives => prevLives - 1); // Decrement lives by 1
		localStorage.setItem('lives', lives - 1);

		noRef.current.innerHTML = '× ' + phrase[selected].toUpperCase() + ' ×';

		setNoDisabled(true);
		setTimeout(() => {
			setNoDisabled(false);
		}, 200 * totalLives - lives);

	}, [ accept, lives, setNoDisabled, setLives, prevSelected, setPrevSelected ]);


	const avoidClickNo = useCallback((event) => {
		let toutId;
		let repeatTime = 0;

		return () => {
			console.log('avoidClickNo', event, repeatTime);

			if (event === 'enter') {
				if (lives - 2 == 0 && repeatTime <= 5) {
					noRef.current.className = "mb-2 animate-wiggle animate-once " + YES_BUTTON_CLASS;
					noRef.current.innerHTML = 'o DALE QUE SI! o';
					noRef.current.onclick = yes;
					repeatTime++;
					return;
				}

				if (lives - 1 == 0 && repeatTime <= 15 + 5) {
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
						if (lives - 1 == 0 && noRef.current.style) {
							noRef.current.style.position = 'relative';
							noRef.current.style.left = 'auto';
							noRef.current.style.top = 'auto';
							noRef.current.style.transform = 'rotate(0deg)';
							noRef.current.style.transition = 'all 0.5s ease-in-out';
							noRef.current.innerHTML = '× NO ×';
						}
					}, 3000);
					return;
				}
			}

			if (event === 'out') {
				if (lives - 2 == 0) {
					noRef.current.className = NO_BUTTON_CLASS(noIsDisabled);
					noRef.current.style.transition = 'all 0.2s ease-in-out';
					noRef.current.innerHTML = '× NO ×';
					noRef.current.onclick = no;
				}
			}
		}
	}, [lives, noRef, yes, no, noIsDisabled ]);


	return (
		<div className='flex items-center justify-center bg-rose-200 min-h-screen bg-image'>
			<div className="flex items-center justify-center flex-col bg-rose-300 md:max-w-full md:h-screen md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">
				
				<div className="flex items-center justify-center">
					{!accept && lives == 0 && <img src={`/src/assets/lose.gif?q='${Date.now()}`} alt="No San Valentin </3" className="h-72 object-fill"/>}
					{!accept && lives != 0 && <img src={`/src/assets/${lives}.gif?q=${Date.now()}`} alt="San Valentin <3" className="h-72 object-fill"/>}
					{accept && <img src={`/src/assets/win.gif?q=${Date.now()}`} alt="San Valentin <3" className="h-72 object-fill"/>}
				</div>

				<div className="flex flex-col items-center my-3">
					{!accept && lives != 0 && <div className="text-rose-500 text-3xl md:text-6xl mx-2 text text-center yxj-font">¿Serías mi San Valentín?</div>}

					{!accept && lives == 0 && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font">Okey...</div>}

					{accept && <div className="text-rose-500 text-3xl md:text-6xl text text-center text-wrap yxj-font">I LOVE YOU</div>}

					<div className={`flex items-center justify-center my-3 ${noIsDisabled && 'animate-shake animate-once'}`}>
						<LivesBar heart={lives} total={totalLives} />
					</div>
				</div>

				{!accept && lives != 0 && <div className="mb-3">
					<button className={YES_BUTTON_CLASS}
						onClick={yes}>o SI o</button>
				</div>}

				{!accept && lives != 0 &&
					<button ref={noRef}
						className={NO_BUTTON_CLASS(noIsDisabled)}
						onMouseOver={avoidClickNo('enter')}
						onMouseOut={avoidClickNo('out')}
						onTouchStart={avoidClickNo('enter')}
						onTouchCancel={avoidClickNo('out')}
						onClick={no}
						disabled={noIsDisabled}>× NO ×</button>}

				{lives == 0 && <div className="pb-3">
					<button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
						onClick={yes}>o ¿Otra Oportunidad? o</button>
				</div>}

				{/* {accept && <div className="pb-3">
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={no}>× ¿Cambiaste de opinion? ×</button>
        </div>} */}
			</div>
		</div>
	)
}
