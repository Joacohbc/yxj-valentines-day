import { memo } from 'react';
import Cross from './Cross';
import Heart from './Heart';

const LivesBar = memo(({ heart, total }) => {

  const hearts = Array(heart).fill('o');
  const crosses = Array(total - heart).fill('×');
  const lives = [...hearts, ...crosses];

  return (
    <div className='flex items-center animate-shake animate-once justify-center my-3'>
      {lives.map((e, i) => e === 'o' ? <Heart key={i} animated /> : <Cross key={i} />)}
    </div>
  )
});

LivesBar.displayName = 'LivesBar';
export default LivesBar;
