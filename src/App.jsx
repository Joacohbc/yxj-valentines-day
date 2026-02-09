import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import LivesBar from "./components/LivesBar.jsx";
import { GifCarrusel, createGifsSelection } from "./components/GifCarrusel.jsx";
import { NO_BUTTON_CLASS } from "./components/NoButonsVariants.jsx";
import { YesButton } from "./components/YesButton.jsx";
import { createLocalStorageManager } from "./utils/LocalStorageManager.js";
import { defaultGameConfig } from "./GameConfig.js";
import { getChallenge } from "./challenges/registry.js";
import AdminConfig from "./components/AdminConfig.jsx";

// Keys for localStorage
const CONFIG_STORAGE_KEY = 'valentine_game_config';

// Helper to load config
const loadConfig = () => {
    try {
        const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load config", e);
    }
    return defaultGameConfig;
};

const initialConfig = loadConfig();

// Dynamic managers creation based on config
// We need to recreate these when config changes, so they can't be static constants anymore.
// But useReducer requires a reducer function. The reducer depends on TOTAL_HEARTS.
// We can store config in the state or use a ref?
// Actually, if we change config (total lives), we probably want to reset the game or reload the page.
// The plan says "Guardar y Reiniciar" in AdminConfig.

// So we can assume `initialConfig` is static for the lifetime of the component unless we force a reload/reset.

const createGameHelpers = (totalLives) => {
    return {
        localStorageManager: createLocalStorageManager(totalLives),
        GIFsManager: createGifsSelection(totalLives)
    };
};

// Initial helpers
let { localStorageManager, GIFsManager } = createGameHelpers(initialConfig.totalLives);


const createInitialState = (totalLives) => ({
	accept: false,
	lives: totalLives,
	gifs: GIFsManager(totalLives, false),
});

// We need a way to inject current totalLives into reducer, or pass it in action.
// Or we wrap reducer in a higher order function?
// Simplest is to pass totalLives in the action or access it from scope if we assume it changes via full reset.

function reducer(state, action) {
    // We get totalLives from action if provided, or from state?
    // But state.lives is current lives.

    // We can assume totalLives is passed in action for RESET/WIN or stored in a closure if we recreate reducer.
    // Let's use `action.totalLives` if available, or maybe store `totalLives` in state.

    const totalLives = state.totalLives || initialConfig.totalLives;

	let lives = state.lives;
	let accept = state.accept;

	switch (action.type) {
        case 'INIT_CONFIG':
            return {
                ...state,
                lives: action.config.totalLives,
                totalLives: action.config.totalLives,
                gifs: action.gifsManager(action.config.totalLives, false)
            };

		case 'WIN':
			lives = totalLives;
			accept = true;
			break;

		case 'ADD':
			lives = Math.min(state.lives + 1, totalLives);
			accept = lives === totalLives;
			break;

		case 'REMOVE':
			lives = Math.max(state.lives - 1, 0);
			accept = false;
			break;

		case 'LOSE':
			lives = 0;
			accept = false;
			break;

		case 'NO_ACCEPT':
			accept = false;
			return { ...state, accept: false };

		case 'RESET':
			lives = totalLives;
			accept = false;
			break;

		case 'LOAD': {
            // We need to use the current localStorageManager which is updated when config changes
            const manager = action.localStorageManager || localStorageManager;
			const loadedState = manager.load();
			if (loadedState.accept && loadedState.lives !== totalLives) {
				loadedState.lives = totalLives;
			}
            const gManager = action.gifsManager || GIFsManager;
			const loadedGifs = gManager(loadedState.lives, loadedState.accept);
			return { ...state, ...loadedState, gifs: loadedGifs, totalLives };
		}
		default:
			return state;
	}

    // Side effects in reducer are bad practice generally, but were in original code.
    // We should use the updated manager.
    const manager = action.localStorageManager || localStorageManager;
    const gManager = action.gifsManager || GIFsManager;

	manager.save(lives, accept);
	const updatedGifs = gManager(lives, accept);

	return { ...state, lives, accept, gifs: updatedGifs, totalLives };
}

export default function App() {
    const [config, setConfig] = useState(initialConfig);
    const [showAdmin, setShowAdmin] = useState(false);
	const noRef = useRef(null);

    // We include totalLives in state to keep track of it
	const [ state, dispatch ] = useReducer(reducer, { ...createInitialState(config.totalLives), totalLives: config.totalLives });
	const { accept, lives, gifs, totalLives } = state;

    // Update helpers when config changes
    useEffect(() => {
        // When config changes, we update helpers and reset game
        const helpers = createGameHelpers(config.totalLives);
        localStorageManager = helpers.localStorageManager;
        GIFsManager = helpers.GIFsManager;

        dispatch({
            type: 'INIT_CONFIG',
            config: config,
            gifsManager: GIFsManager
        });

        // Also reload from local storage if compatible?
        // Or just reset. The requirement said "Guardar y Reiniciar".
        // INIT_CONFIG basically resets to start.
        // If we want to persist progress across config changes, it's tricky because totalLives changed.
        // So reset is safer.

    }, [config]);

	const yes = useCallback(() => {
		if (accept) return;

		if (lives === totalLives) {
			dispatch({ type: 'WIN' });
			return;
		}
		
		for(let i = 0; i < 10000; i++) { clearTimeout(i) }

		dispatch({ type: 'ADD' });
	}, [accept, lives, dispatch, totalLives]);

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
			noRef.current.style.transition = 'all 0.2s ease-in-out';
		}

		if(resets.includes('text')) {
            // We need to know what the initial text should be.
            // But reset('text') in original code set it to 'NO'.
			noRef.current.innerHTML = '× NO ×';
		}

	}, [ noRef ]);

	useEffect(() => {
		dispatch({ type: 'LOAD', localStorageManager, gifsManager: GIFsManager });
    }, []); // Run once on mount

    useEffect(() => {
		const currentRef = noRef.current;
        if (!currentRef) return;

		if(lives === totalLives && accept) {
			reset([ 'events' ]);
			return;
		}

        // Dynamic Challenge Logic
        // Calculate index in challenges array
        // If lives == totalLives, index 0.
        // If lives == 1, index totalLives - 1.

        const index = totalLives - lives;
        const challengeEntry = config.challenges[index];

        let cleanup = () => {};

        if (lives > 0 && challengeEntry) {
            // Registry lookup
            const ChallengeImpl = getChallenge(challengeEntry.id);
            if (ChallengeImpl) {
                // Prepare callbacks
                const callbacks = {
                    onLose: no,
                    onWin: yes,
                    onEvent: (name) => {
                         // Helper if needed by legacy challenges or new ones
                    }
                };

                // We might need to reset styles before running new challenge
                // But typically challenges handle their own setup.
                // However, avoiding residue from previous challenge is good.
                // The dependencies of this useEffect are [lives], so it runs on change.
                // We should cleanup previous one.

                // Note: The cleanup function returned by useEffect handles the previous run.

                cleanup = ChallengeImpl.run(currentRef, callbacks, challengeEntry.config);
            } else {
                console.error(`Challenge ${challengeEntry.id} not found.`);
                // Fallback?
                currentRef.onclick = no;
            }
        } else if (lives > 0) {
             // Fallback if no challenge configured for this life
             currentRef.onclick = no;
        }


		return () => {
            cleanup();
            reset([ 'events', 'style', 'text' ]);
        }

	}, [ lives, noRef, no, yes, reset, accept, config, totalLives ]);

    const handleSaveConfig = (newConfig) => {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
        setConfig(newConfig);
        setShowAdmin(false);
    };

	return (
		<div className='flex items-center justify-center bg-rose-200 min-h-screen bg-image relative'>
            <button
                className="absolute top-2 left-2 text-rose-300 hover:text-rose-500 z-10"
                onClick={() => setShowAdmin(true)}
                title="Configuración"
            >
                ⚙️
            </button>

            {showAdmin && (
                <AdminConfig
                    currentConfig={config}
                    onSave={handleSaveConfig}
                    onClose={() => setShowAdmin(false)}
                />
            )}

			<div className="flex items-center justify-center flex-col bg-rose-300 max-w-[95vw] min-h-[80vh]  md:min-h-[95vh] md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">

				{accept && <div className="text-rose-500 max-w-[70vw] text-5xl md:text-6xl text text-center text-wrap yxj-font"> I </div>}

				<GifCarrusel gifs={gifs.toArray()} />

				<div className="flex flex-col items-center my-3">
					{!accept && lives != 0 && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl mx-2 text text-center yxj-font">¿Serías mi San Valentín?</div>}

					{!accept && lives == 0 && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl text-wrap text-center yxj-font"> Okey... ya entendí que nO</div>}

					{accept && <div className="text-rose-500 max-w-[70vw] text-3xl md:text-6xl text text-center text-wrap yxj-font"> VERY MUCHITO </div>}

      				{/* Math.random() is used to force the re-render of the component (to sync the animation) */}
					<LivesBar key={Math.random()} heart={!accept ? lives : 1} total={!accept ? totalLives : 1} />
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
