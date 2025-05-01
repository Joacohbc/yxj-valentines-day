import { memo } from 'react';

const Cross = memo(() => {
    return <span className='text-rose-500 text-4xl md:text-8xl text-center yxj-font'>×</span>
});

Cross.displayName = 'Cross';
export default Cross;
