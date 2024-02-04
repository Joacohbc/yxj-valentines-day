import { useRef, useState } from "react"
import './App.css'
import { phrase } from './assets/phrases.js';

const localStorageLifes = localStorage.getItem('lifes');
const LIFES = localStorageLifes ? localStorageLifes.split(',') : 'o'.repeat(8).split('');
const image = `/src/assets/${Math.floor(Math.random() * 7) + 1}.gif`;

export default function App() {

  const noRef = useRef(null);
  const [lifes, setLifes] = useState(LIFES);
  const [noDisabled, setNoDisabled] = useState(false);

  const yes = () => {
    lifes[lifes.indexOf('×')] = 'o';
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
    <div className='flex items-center justify-center bg-rose-200 h-screen'>
      <div className="flex items-center justify-center flex-col bg-rose-300 p- h-5/6 rounded-lg border-dashed border-2 border-rose-600">
        <div className="flex items-center justify-center">
          <img src={image} />
        </div>

        <div className="flex flex-col items-center m-3 p-3">
          <div className="text-rose-500 text-5xl yxj-font">¿Serias mi San Valentin?</div>
          <div className="text-rose-500 text-8xl yxj-font">{lifes.join('')}</div>
        </div>

        <div className="mb-1">
          <button className="bg-rose-400 hover:bg-red-500 text-black font-bold py-2 px-4 mr-1 rounded-md yxj-font"
            onClick={yes}>o SI o</button>
        </div>

        <div className="pb-3">
          <button ref={noRef} className={`${!noDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-blue-950'} text-white font-bold py-2 px-4 rounded-md yxj-font`}
            onClick={no} disabled={noDisabled}>× NO ×</button>
        </div>
      </div>
    </div>
  )
}