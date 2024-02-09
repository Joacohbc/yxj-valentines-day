import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { phrase } from './assets/phrases.js';
import LivesBar from "./components/LivesBar.jsx";
import './css/font.css';
import { GIFs, GifCarrusel } from "./components/GifCarrusel.jsx";
import { NO_BUTTON_CLASS, YES_BUTTON_CLASS, avoidClickNo1, avoidClickNo2 } from "./components/NoButonsVariants.jsx";

const totalLives = 8;

const initialState = {
	accept: false,
	lives: totalLives,
	gifs: GIFs()
};

function reducer(state, action) {
	// Reset the selected gif
	const gifs = GIFs();

	switch (action.type) {
		case 'WIN': {
			gifs.win.selected = true;
			localStorage.setItem('lives', 8);
			localStorage.setItem('accept', true);
			return { ...state, lives: 8, gifs: gifs, accept: true };
		}

		case 'ADD': {
			const lives = state.lives + 1 > totalLives ? totalLives : state.lives + 1;
			gifs[lives].selected = true;
			localStorage.setItem('lives', lives);
			localStorage.setItem('accept', false);
			return { ...state, lives: lives, gifs: gifs, accept: false };
		}

		case 'REMOVE': {
			const lives = state.lives - 1 > 0 ? state.lives - 1 : 0;
			gifs[lives].selected = true;
			localStorage.setItem('lives', lives);
			localStorage.setItem('accept', false);
			return { ...state, lives: lives, gifs: gifs, accept: false };
		}

		case 'LOSE': {
			gifs.lose.selected = true;
			localStorage.setItem('lives', 0);
			localStorage.setItem('accept', false);
			return { ...state, lives: 0, gifs: gifs, accept: false };
		}

		case 'NO_ACCEPT':
			return { ...state, accept: false };


		case 'RESET':
			gifs[8].selected = true;
			return { ...state, lives: 8, gifs: gifs, accept: false };

		case 'LOAD': {
			const totalLives = 8;
			const lsAccept = localStorage.getItem('accept') === 'true';
			const lsLives = localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives')) : totalLives;

			if (lsAccept) {
				gifs.win.selected = true;
			}

			if (!lsAccept && lsLives == 0) {
				gifs.lose.selected = true;
			}

			if (lsLives > 0 && lsLives <= totalLives && !lsAccept) {
				gifs[lsLives].selected = true;
			}

			return { accept: lsAccept, lives: lsLives, gifs: gifs };
		}
		default:
			return state;
	}
}

export default function App() {

	const noRef = useRef(null);
	const [ noIsDisabled, setNoDisabled ] = useState(false);
	const [prevSelected, setPrevSelected] = useState(0);

	const [state, dispatch] = useReducer(reducer, initialState);
	const { accept, lives, gifs } = state;

	const yes = useCallback(() => {
		if (accept) return;

		if (lives === totalLives) {
			dispatch({ type: 'WIN' });
			return;
		}

		dispatch({ type: 'ADD' });
	}, [accept, lives, dispatch]);

	const no = useCallback(() => {
		if (accept) {
			dispatch({ type: 'NO_ACCEPT' });
		}

		// Don't allow to select the same phrase twice in a row
		let selected = Math.floor(Math.random() * 1);
		while (selected === prevSelected) {
			selected = Math.floor(Math.random() * phrase.length);
		}
		setPrevSelected(selected);

		dispatch(lives - 1 === 0 ? { type: 'LOSE' } : { type: 'REMOVE' });

		noRef.current.innerHTML = '× ' + phrase[selected].toUpperCase() + ' ×';

		setNoDisabled(true);
		setTimeout(() => {
			setNoDisabled(false);
		}, 200 * totalLives - lives);

	}, [ accept, lives, prevSelected, dispatch ]);

	const reset = useCallback((resetOf) => {
		if(!noRef.current) return;

		const resets = Array.from(resetOf);

		if(resets.includes('events')) {
			noRef.current.onmouseover = null;
			noRef.current.onmouseout = null;
			noRef.current.ontouchstart = null;
			noRef.current.ontouchcancel = null;
			noRef.current.onclick = null;
		}

		if(resets.includes('style')) {
			noRef.current.className = NO_BUTTON_CLASS(false);
			noRef.current.style = {};

			// Transition is set make smooth the transition from avoidClickNo functions
			noRef.current.style.transition = 'all 0.2s ease-in-out';
		}

		if(resets.includes('text')) {
			noRef.current.innerHTML = '× NO ×';
		}

	}, [ noRef ]);

	useEffect(() => {
		dispatch({ type: 'LOAD' });

		const currentRef = noRef.current;

		if(lives >= 3) {
			reset([ 'events' ]);
			currentRef.onclick = no;
			return;
		} else if(lives == 2) {
			currentRef.onclick = null;
			currentRef.onmouseover = avoidClickNo2('enter', currentRef, no, yes, noIsDisabled, reset);
			currentRef.onmouseout = avoidClickNo2('out', currentRef, no, yes, noIsDisabled, reset);
			currentRef.ontouchstart = null;
			currentRef.ontouchcancel = null;
			return () => { reset([ 'events', 'style', 'text' ]); }
		} else if(lives == 1) {
			currentRef.onmouseover = avoidClickNo1('enter', currentRef, no, yes, noIsDisabled, reset);
			currentRef.onmouseout = avoidClickNo1('out', currentRef, no, yes, noIsDisabled, reset);
			currentRef.ontouchstart = null;
			currentRef.ontouchcancel = null;
			return () => { reset([ 'events', 'style', 'text' ]); }
		}

	}, [ lives, noRef, no, yes, noIsDisabled, reset]);
		
	return (
		<div className='flex items-center justify-center bg-rose-200 min-h-screen bg-image'>
			<div className="flex items-center justify-center flex-col bg-rose-300 md:max-w-full md:h-screen md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">

				<GifCarrusel gifs={gifs.toArray()} />

				<div className="flex flex-col items-center my-3">
					{!accept && lives != 0 && <div className="text-rose-500 text-3xl md:text-6xl mx-2 text text-center yxj-font">¿Serías mi San Valentín?</div>}

					{!accept && lives == 0 && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font">Okey... No sigo mas :c</div>}

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
						disabled={noIsDisabled}>× NO ×</button>}

				{lives == 0 && <div className="pb-3">
					<button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
						onClick={yes}>o ¿Otra Oportunidad? o</button>
				</div>}
			</div>
		</div>
	)
}
