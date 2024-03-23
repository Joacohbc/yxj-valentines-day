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

import PropTypes from 'prop-types';

// Return an object with all the gifs
const GIFs = () => {
    const gifs = {
        lose: { url: lose, title: 'Lose </3', selected: false },
        1: { url: gif1, title: 'San Valentin <3', selected: false},
        2: { url: gif2, title: 'San Valentin <3', selected: false }, 
        3: { url: gif3, title: 'San Valentin <3', selected: false }, 
        4: { url: gif4, title: 'San Valentin <3', selected: false }, 
        5: { url: gif5, title: 'San Valentin <3', selected: false }, 
        6: { url: gif6, title: 'San Valentin <3', selected: false }, 
        7: { url: gif7, title: 'San Valentin <3', selected: false }, 
        8: { url: gif8, title: 'San Valentin <3', selected: false }, 
        win: { url: win, title: 'Win <3', selected: false },
    };
    
    gifs.toArray = () => Object.values(gifs);
    return gifs;
}

const GifCarrusel = ({ gifs }) => {
    return (
        <div className="flex items-center justify-center">
            {gifs.map((gif, index) => <img key={index} src={gif.url} alt={gif.title} className="h-72 object-fill" hidden={!gif.selected}/> )}
        </div>
    )
}

GifCarrusel.propTypes = {
    gifs: PropTypes.array.isRequired
};

export { GIFs, GifCarrusel };
