import Cross from './Cross';
import Heart from './Heart';


import PropTypes from 'prop-types';

const LivesBar = ({ heart, total }) => {

  const hearts = Array(heart).fill('o');
  const crosses = Array(total - heart).fill('×');
  const lives = [...hearts, ...crosses];

  return (
    <>
      {/* Math.random() is used to force the re-render of the component (to sync the animation) */}
      {lives.map((e) => e === 'o' ? <Heart key={Math.random()} animated /> : <Cross key={Math.random()} />)}
    </>
  )
};

LivesBar.propTypes = {
  heart: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default LivesBar;
