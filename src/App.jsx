import { useRef, useState } from "react";
import { phrase } from './assets/phrases.js';
import LivesBar from "./components/LivesBar.jsx";
import './css/font.css';

const urlGifImage = `/src/assets/${Math.floor(Math.random() * 7) + 1}.gif?q=${Date.now()}`;
const lsAccept = localStorage.getItem('accept') === 'true';
const lsLives = localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives')) : 8;
const totalLives = 8;

export default function App() {

  const noRef = useRef(null);
  const [ lives, setLives ] = useState(lsLives);
  const [ accept, setAccept ] = useState(lsAccept);
  const [ noIsDisabled, setNoDisabled ] = useState(false);

  const yes = () => {
    if(accept) return;

    if (lives === totalLives) {
      setAccept(true);
      localStorage.setItem('lives', lives);
      localStorage.setItem('accept', true);
      return;
    }

    setLives(lives + 1);
    localStorage.setItem('lives', lives + 1);
  }

  const no = () => {
    if (accept) {
      setAccept(false);
      localStorage.setItem('accept', false);
    }

    setLives(lives - 1);
    localStorage.setItem('lives', lives - 1);

    noRef.current.innerHTML = '× ' + phrase[Math.floor(Math.random() * phrase.length)].toUpperCase() + ' ×';
    
    setNoDisabled(true);
    setTimeout(() => {
      setNoDisabled(false);
    }, 500 * lives);
  }

  return (
    <div className='flex items-center justify-center bg-rose-200 min-h-screen '>
      <div className="flex items-center justify-center flex-col bg-rose-300 md:max-w-full md:h-screen md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">
        <div className="flex items-center justify-center">
          {lives === 0 ?
            <img src={`/src/assets/lose.gif?q='${Date.now()}`} alt="No San Valentin </3" />
            : <img src={urlGifImage} alt="San Valentin <3" />}
        </div>

        <div className="flex flex-col items-center my-3">
          {!accept && lives != 0 && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font">¿Serías mi San Valentín?</div>}

          {!accept && lives == 0 && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font"> Okey... </div>}

          {accept && <div className="text-rose-500 text-3xl md:text-6xl text text-center text-wrap yxj-font"> I LOVE YOU </div>}

          <div className="flex items-center justify-center my-3">
            <LivesBar heart={lives} total={totalLives} />
          </div>
        </div>

        {!accept && lives != 0 && <div className="mb-3">
          <button className="bg-rose-400 hover:bg-red-500 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={yes}>o SI o</button>
        </div>}
        
        {!accept && lives != 0 && <div className="pb-3">
          <button ref={noRef} className={`${!noIsDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-md yxj-font`}
            onClick={no} disabled={noIsDisabled}>× NO ×</button>
        </div>}

        {lives == 0 && <div className="pb-3">
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={yes}>o ¿Otra Oportunidad? o</button>
        </div>}

        {accept && <div className="pb-3">
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={no}>× ¿Cambiaste de opinion? ×</button>
        </div>}
      </div>
    </div>
  )
}
