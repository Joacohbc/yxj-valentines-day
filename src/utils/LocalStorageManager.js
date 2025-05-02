
// Helper to manage localStorage persistence
export const createLocalStorageManager = (totalLives) => {
	const save =  (lives, accept) => {
		localStorage.setItem('lives', lives);
		localStorage.setItem('accept', accept);
	}

    const load = () => {
		const accept = localStorage.getItem('accept') === 'true';

		// Ensure loaded lives are within valid bounds
		const rawLives = localStorage.getItem('lives');
		let lives = totalLives; // Default to total lives

		if (rawLives !== null) {
			const parsedLives = parseInt(rawLives, 10);

			if (!isNaN(parsedLives) && parsedLives >= 0 && parsedLives <= totalLives) {
				lives = parsedLives;
			} else if (accept) {
				// If accepted state is loaded but lives are invalid, assume full lives
				lives = totalLives;
			} else {
				// If not accepted and lives are invalid, default based on accept status
				lives = 0; // Or perhaps totalLives, depending on desired default
			}
		} else if (accept) {
			// If accept is true but no lives saved, assume win state
			lives = totalLives;
		}

		// If loaded state is accepted, lives must be totalLives
		if (accept && lives !== totalLives) {
			lives = totalLives;
		}

        return { accept, lives };
	}

    return { save, load };
};
