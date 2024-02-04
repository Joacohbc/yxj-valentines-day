import { useRef, useState } from "react";
import './App.css';
import { phrase } from './assets/phrases.js';

const image = `/src/assets/${Math.floor(Math.random() * 7) + 1}.gif`;
const localStorageAccept = Boolean(localStorage.getItem('accept'));
const localStorageLifes = localStorage.getItem('lifes');
const LIFES = localStorageLifes ? localStorageLifes.split(',') : 'o'.repeat(8).split('');

export default function App() {

  const noRef = useRef(null);
  const [ lifes, setLifes ] = useState(LIFES);
  const [ noDisabled, setNoDisabled ] = useState(false);
  const [ accept, setAccept ] = useState(localStorageAccept);

  const yes = () => {
    if(accept) return;

    lifes[lifes.indexOf('×')] = 'o';
    if(lifes.every(e => e === 'o')) {
      setAccept(true);
      localStorage.setItem('lifes', lifes);
      localStorage.setItem('accept', true);
      return;
    }
    
    localStorage.setItem('lifes', lifes);
    setLifes([...lifes]);
  }

  const no = () => {
    lifes[lifes.lastIndexOf('o')] = '×';
    localStorage.setItem('lifes', lifes);
    setLifes([...lifes]);

    noRef.current.innerHTML = '× ' + phrase[Math.floor(Math.random() * phrase.length)].toUpperCase() + ' ×';

    setNoDisabled(true);
    setTimeout(() => {
      setNoDisabled(false);
    }, 500 * lifes.filter(l => l === '×').length);
  }

  return (
    <div className='flex items-center justify-center bg-rose-200 min-h-screen '>
        <div className="flex items-center justify-center flex-col bg-rose-300 md:max-w-full md:h-screen md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">
        <div className="flex items-center justify-center">
          {lifes.every(e => e === '×') ?
            <img src='/src/assets/lose.gif' alt="San Valentin"/> 
              : <img src={image} alt="San Valentin"/>}
        </div>

        <div className="flex flex-col items-center my-3">
          {!accept && lifes.some(e => e === 'o') && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font">¿Serías mi San Valentín?</div>}
          
          {!accept && lifes.every(e => e === '×') && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font"> Okey... </div>}

          {accept && <div className="text-rose-500 text-3xl md:text-6xl text text-center text-wrap yxj-font"> I LOVE YOU </div>}

          <div className="flex items-center justify-center my-3">
          {lifes.map((e, i) => e === 'o' ?
            // Math.random() is used to force the re-render of the component (to sync the animation)
            <span key={Math.random()} className="text-rose-500 text-4xl md:text-8xl text-center animate-jump animate-infinite animate-delay-1500 animate-duration-1000 yxj-font">o</span>
            : <span key={i} className="text-rose-500 text-4xl md:text-8xl yxj-font">×</span> )}
          </div>
        </div>

        <div className="mb-3" hidden={accept}>
          <button className="bg-rose-400 hover:bg-red-500 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={yes} hidden={lifes.every(e => e === '×')}>o SI o</button>
        </div>

        <div className="pb-3" hidden={accept}>
          <button ref={noRef} className={`${!noDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-md yxj-font`}
            onClick={no} disabled={noDisabled} hidden={lifes.every(e => e === '×')}>× NO ×</button>
        </div>

        <div className="pb-3" hidden={accept}>
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
              onClick={yes} hidden={!lifes.every(e => e === '×')}>o ¿Otra Oportunidad? o</button>
        </div>
      </div>
    </div>
  )
}
