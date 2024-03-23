
import PropTypes from 'prop-types';

// Return an object with all the gifs
const GIFs = () => {
    const gifs = {
        lose: { url: '/lose.gif', title: 'Lose </3', selected: false },
        1: { url: '/1.gif', title: 'San Valentin <3', selected: false},
        2: { url: '/2.gif', title: 'San Valentin <3', selected: false }, 
        3: { url: '/3.gif', title: 'San Valentin <3', selected: false }, 
        4: { url: '/4.gif', title: 'San Valentin <3', selected: false }, 
        5: { url: '/5.gif', title: 'San Valentin <3', selected: false }, 
        6: { url: '/6.gif', title: 'San Valentin <3', selected: false }, 
        7: { url: '/7.gif', title: 'San Valentin <3', selected: false }, 
        8: { url: '/8.gif', title: 'San Valentin <3', selected: false }, 
        win: { url: '/win.gif', title: 'Win <3', selected: false },
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
