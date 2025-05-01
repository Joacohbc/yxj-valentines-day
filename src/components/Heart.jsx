import { memo } from 'react';

const Heart = memo((props) => {
  return <span className={`text-rose-500 text-4xl md:text-8xl text-center ${props.animated && 'animate-jump animate-infinite animate-delay-1500 animate-duration-1000'} yxj-font`}>o</span>
});

Heart.displayName = 'Heart';
export default Heart;
