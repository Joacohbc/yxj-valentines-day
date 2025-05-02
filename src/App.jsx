import { useCallback, useEffect, useReducer, useRef } from "react";
import LivesBar from "./components/LivesBar.jsx";
import { GifCarrusel, createGifsSelection } from "./components/GifCarrusel.jsx";
import { NO_BUTTON_CLASS, avoidClickNo, avoidClickNo1, avoidClickNo2, avoidClickNo3, avoidClickNo4 } from "./components/NoButonsVariants.jsx";
import { YesButton } from "./components/YesButton.jsx";
import { createLocalStorageManager } from "./utils/LocalStorageManager.js";

const TOTAL_HEARTS = 8;
const localStorageManager = createLocalStorageManager(8);
const GIFsManager = createGifsSelection(8);


// Define initial state structure - actual values will be set by LOAD or defaults
const initialState = {
	accept: false,
	lives: TOTAL_HEARTS,
	gifs: GIFsManager(TOTAL_HEARTS, false), // Initial GIFs based on total lives and accept status
};

// Reducer function optimized for clarity and reduced redundancy
function reducer(state, action) {
	let lives = state.lives;
	let accept = state.accept;

	switch (action.type) {
		case 'WIN':
			lives = TOTAL_HEARTS;
			accept = true;
			break;

		case 'ADD':
			// Prevent exceeding total lives unless it triggers a win
			lives = Math.min(state.lives + 1, TOTAL_HEARTS);
			// If adding a life reaches the total, it's a win
			accept = lives === TOTAL_HEARTS;
			break;

		case 'REMOVE':
			lives = Math.max(state.lives - 1, 0);
			accept = false; // Cannot be accepted if a life was just removed
			break;

		case 'LOSE':
			lives = 0;
			accept = false;
			break;

		case 'NO_ACCEPT':
			// Only flips the accept flag, doesn't change lives
			// Used when 'No' is clicked after already accepting
			accept = false;
			 // No localStorage update here as per original logic for this specific case
			 // No GIF update needed as lives haven't changed
			return { ...state, accept: false };

		case 'RESET':
			lives = TOTAL_HEARTS;
			accept = false;
			break;

		case 'LOAD': {
			const loadedState = localStorageManager.load();
			// Ensure consistency: if loaded accept is true, lives must be totalLives
			if (loadedState.accept && loadedState.lives !== TOTAL_HEARTS) {
				loadedState.lives = TOTAL_HEARTS;
			}
			const loadedGifs = GIFsManager(loadedState.lives, loadedState.accept);
			return { ...state, ...loadedState, gifs: loadedGifs };
		}
		default:
			// Return current state if action type is unknown
			return state;
	}

	// For actions that change lives/accept, update localStorage and gifs
	localStorageManager.save(lives, accept);
	const updatedGifs = GIFsManager(lives, accept);

	// Return the new state
	return { ...state, lives, accept, gifs: updatedGifs };
}

export default function App() {

	const noRef = useRef(null);
	
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const { accept, lives, gifs } = state;

	// const { showAlert } = useContext(AlertContext)

	const yes = useCallback(() => {
		if (accept) return;

		if (lives === TOTAL_HEARTS) {
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
			currentRef.onclick = avoidClickNo4('click', currentRef, no);
		} else if(lives == 3) {
			currentRef.onclick = avoidClickNo3(currentRef, no, yes, reset);
		} else if(lives == 2) {
			currentRef.onmouseover = avoidClickNo2('enter', currentRef, no, yes, reset);
			currentRef.onmouseout = avoidClickNo2('out', currentRef, no, yes, reset);
			currentRef.ontouchstart = avoidClickNo2('enter', currentRef, no, yes, reset);
			currentRef.ontouchend = avoidClickNo2('out', currentRef, no, yes, reset);
		} else if(lives == 1) {
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

      				{/* Math.random() is used to force the re-render of the component (to sync the animation) */}
					<LivesBar key={Math.random()} heart={!accept ? lives : 1} total={!accept ? TOTAL_HEARTS : 1} />
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
