import { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import LivesBar from "./components/LivesBar.jsx";
import './css/font.css';
import { GIFs, GifCarrusel } from "./components/GifCarrusel.jsx";
import { NO_BUTTON_CLASS, YES_BUTTON_CLASS, avoidClickNo, avoidClickNo1, avoidClickNo2, avoidClickNo3, avoidClickNo4 } from "./components/NoButonsVariants.jsx";
import { YesButton } from "./components/YesButton.jsx";
import { AlertContext } from "./components/Alert.jsx";

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
			localStorage.setItem('lives', 8);
			localStorage.setItem('accept', false);
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
	
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const { accept, lives, gifs } = state;

	// const { showAlert } = useContext(AlertContext)

	const yes = useCallback(() => {
		if (accept) return;

		if (lives === totalLives) {
			dispatch({ type: 'WIN' });
			return;
		}

		// Clear all timeouts of No button
		for(let i = 0; i < 10000; i++) { clearTimeout(i) }

		dispatch({ type: 'ADD' });
	}, [accept, lives, dispatch]);

	const no = useCallback(() => {
		if (accept) {
			dispatch({ type: 'NO_ACCEPT' });
		}

		dispatch(lives - 1 === 0 ? { type: 'LOSE' } : { type: 'REMOVE' });
	}, [ accept, lives, dispatch ]);

	const reset = useCallback((resetOf) => {
		if(!noRef.current) return;

		const resets = Array.from(resetOf);

		if(resets.includes('events')) {
			noRef.current.onmouseover = null;
			noRef.current.onmouseout = null;
			noRef.current.ontouchstart = null;
			noRef.current.ontouchend = null;
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
		
		if(lives == 8 && accept) {
			reset([ 'events' ]);
			return;
		} else if(lives == 8) {
			currentRef.onclick = avoidClickNo(0, currentRef, no);
		} else if(lives == 7) {
			currentRef.onclick = avoidClickNo(1, currentRef, no);
		} else if(lives == 6) {
			currentRef.onclick = avoidClickNo(2, currentRef, no);
		} else if(lives == 5) {
			currentRef.onclick = avoidClickNo(3, currentRef, no);
		} else if(lives == 4) {
			// showAlert('4 o', '¿Unos clics rápidos?', true);
			currentRef.onclick = avoidClickNo4('click', currentRef, no);
		} else if(lives == 3) {
			// showAlert('3 o', '¿Como estas para matemáticas?', true);
			currentRef.onclick = avoidClickNo3(currentRef, no, yes, reset);
		} else if(lives == 2) {
			// showAlert('2 o', 'Atenta a tus clics!', true);
			currentRef.onmouseover = avoidClickNo2('enter', currentRef, no, yes, reset);
			currentRef.onmouseout = avoidClickNo2('out', currentRef, no, yes, reset);
			currentRef.ontouchstart = avoidClickNo2('enter', currentRef, no, yes, reset);
			currentRef.ontouchend = avoidClickNo2('out', currentRef, no, yes, reset);
		} else if(lives == 1) {
			// showAlert('1 o', '¿Un clic más? O se te escapa!', true);
			currentRef.onclick = avoidClickNo1('click', currentRef, no, reset);
			currentRef.onmouseover = avoidClickNo1('enter', currentRef, no, reset);
			currentRef.onmouseout = avoidClickNo1('out', currentRef, no, reset);
			currentRef.ontouchstart = avoidClickNo1('enter', currentRef, no, reset);
			currentRef.ontouchend = avoidClickNo1('out', currentRef, no, reset);
		}

		return () => { reset([ 'events', 'style', 'text' ]); }

	}, [ lives, noRef, no, yes, reset, accept ]);

	return (
		<div className='flex items-center justify-center bg-rose-200 min-h-screen bg-image'>
			<div className="flex items-center justify-center flex-col bg-rose-300 max-w-[95vw] min-h-[80vh]  md:min-h-[95vh] md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">

				{accept && <div className="text-rose-500 max-w-[70vw] text-5xl md:text-6xl text text-center text-wrap yxj-font"> I </div>}
				
				<GifCarrusel gifs={gifs.toArray()} />

				<div className="flex flex-col items-center my-3">
					{!accept && lives != 0 && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl mx-2 text text-center yxj-font">¿Serías mi San Valentín?</div>}

					{!accept && lives == 0 && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl text-wrap text-center yxj-font"> Okey... ya entendí que nO</div>}

					{accept && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl text text-center text-wrap yxj-font"> VERY MUCHITO </div>}

					<div className='flex items-center justify-center my-3'>
						<LivesBar heart={!accept ? lives : 1} total={!accept ? totalLives : 1} />
					</div>
				</div>

				<div className="mb-3">
					<YesButton onClick={yes} lives={lives} accept={accept}/>
				</div>

				{!accept && lives != 0 && <button ref={noRef} className={NO_BUTTON_CLASS(false)}>× NO ×</button>}

				{lives == 0 && <div className="pb-3">
					<button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
						onClick={yes}>o ¿Otra Oportunidad? o</button>
				</div>}

				{ accept && <button className="text-rose-700 font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font absolute top-0 right-0"
						onClick={() => dispatch({ type: 'RESET' })}>×</button> }
			</div>
		</div>
	)
}
