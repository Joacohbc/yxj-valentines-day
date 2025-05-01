import Cross from './Cross';
import Heart from './Heart';

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

export default LivesBar;
