import gif1 from '/1.gif';
import gif2 from '/2.gif';
import gif3 from '/3.gif';
import gif4 from '/4.gif';
import gif5 from '/5.gif';
import gif6 from '/6.gif';
import gif7 from '/7.gif';
import gif8 from '/8.gif';
import lose from '/lose.gif';
import win from '/win.gif';

// Return an object with all the gifs
const getAllGIFs = () => {
    const gifs = {
        lose: { url: lose, title: 'Lose </3', selected: false },
        win: { url: win, title: 'Win <3', selected: false },
        1: { url: gif1, title: 'San Valentin <3', index: 1, selected: false},
        2: { url: gif2, title: 'San Valentin <3', index: 2, selected: false }, 
        3: { url: gif3, title: 'San Valentin <3', index: 3, selected: false }, 
        4: { url: gif4, title: 'San Valentin <3', index: 4, selected: false }, 
        5: { url: gif5, title: 'San Valentin <3', index: 5, selected: false }, 
        6: { url: gif6, title: 'San Valentin <3', index: 6, selected: false }, 
        7: { url: gif7, title: 'San Valentin <3', index: 7, selected: false }, 
        8: { url: gif8, title: 'San Valentin <3', index: 8, selected: false }, 
        toArray: function() {
            return Object.values(this);
        },
    };
    
    return gifs;
}

// Helper to update ALL_GIFs state based on lives and accept status
// Assumes ALL_GIFs() returns an object where keys are numbers (lives), 'win', 'lose'
// and values have a 'selected' boolean property.
const createGifsSelection = (totalLives) => {
    const internalTotalLives = totalLives || 8;
    const gifs = getAllGIFs();
    
    return (lives, accept) => {

        // Reset all gifs to unselected
        gifs.toArray().forEach(gif => {
            gif.selected = false;
        })

        if (accept) {
            gifs.win.selected = true;
        } else if (lives === 0) {
            gifs.lose.selected = true;
        } else if (lives > 0 && lives <= internalTotalLives) {
            gifs[lives].selected = true;
        } else {
            if (gifs[internalTotalLives]) gifs[internalTotalLives].selected = true; // Default to initial state gif
        }

        return gifs;
    }
};

const GifCarrusel = ({ gifs }) => {
    return (
        <div className="flex items-center justify-center">
            {gifs.map((gif, index) => <img key={index} src={gif.url} alt={gif.title} className="h-72 object-fill" hidden={!gif.selected}/> )}
        </div>
    )
}

export { getAllGIFs, createGifsSelection, GifCarrusel };
