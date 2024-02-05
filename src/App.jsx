import { useRef, useState } from "react";
import { phrase } from './assets/phrases.js';
import LivesBar from "./components/LivesBar.jsx";
import './css/font.css';

const lsAccept = localStorage.getItem('accept') === 'true';
const totalLives = 8;
const lsLives = localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives')) : totalLives;

export default function App() {

  const noRef = useRef(null);
  const [ lives, setLives ] = useState(lsLives);
  const [ accept, setAccept ] = useState(lsAccept);
  const [ noIsDisabled, setNoDisabled ] = useState(false);
  const [ prevSelected, setPrevSelected ] = useState(0);
  
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

    // Don't allow to select the same phrase twice in a row
    const selected = Math.floor(Math.random() * phrase.length);
    if (selected === prevSelected) {
      no();
      return
    }
    setPrevSelected(selected);

    setLives(lives - 1);
    localStorage.setItem('lives', lives - 1);

    noRef.current.innerHTML = '× ' + phrase[selected].toUpperCase() + ' ×';

    setNoDisabled(true);
    setTimeout(() => {
      setNoDisabled(false);
    }, 200 * totalLives - lives);
  }

  return (
    <div className='flex items-center justify-center bg-rose-200 min-h-screen bg-image'>
      <div className="flex items-center justify-center flex-col bg-rose-300 md:max-w-full md:h-screen md:p-5 rounded-lg border-dashed border-2 border-rose-600 animate-fade-up animate-once animate-ease-in-out">
        <div className="flex items-center justify-center">
          {!accept && lives == 0 && <img src={`/src/assets/lose.gif?q='${Date.now()}`} alt="No San Valentin </3" />}
          {!accept && lives != 0 && <img src={`/src/assets/${lives}.gif?q=${Date.now()}`} alt="San Valentin <3" />}
          {accept && <img src={`/src/assets/win.gif?q=${Date.now()}`} alt="San Valentin <3" />}
        </div>

        <div className="flex flex-col items-center my-3">
          {!accept && lives != 0 && <div className="text-rose-500 text-3xl md:text-6xl mx-2 text text-center yxj-font">¿Serías mi San Valentín?</div>}

          {!accept && lives == 0 && <div className="text-rose-500 text-3xl md:text-6xl text text-center yxj-font">Okey...</div>}

          {accept && <div className="text-rose-500 text-3xl md:text-6xl text text-center text-wrap yxj-font">I LOVE YOU</div>}

          <div className="flex items-center justify-center my-3">
            <LivesBar heart={lives} total={totalLives} />
          </div>
        </div>

        {!accept && lives != 0 && <div className="mb-3">
          <button className="bg-rose-400 hover:bg-red-500 text-rose-100 font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={yes}>o SI o</button>
        </div>}
        
        {!accept && lives != 0 && <div className="pb-3 max-w-md">
          <button ref={noRef} className={`${!noIsDisabled ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'} text-white text-wrap font-bold py-2 px-4 mx-4 mb-2 md:py-3 md:px-6 rounded-md yxj-font`}
            onClick={no} disabled={noIsDisabled}>× NO ×</button>
        </div>}

        {lives == 0 && <div className="pb-3">
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={yes}>o ¿Otra Oportunidad? o</button>
        </div>}

        {/* {accept && <div className="pb-3">
          <button className="bg-sky-200 hover:bg-sky-300 text-black font-bold py-2 px-4 md:py-3 md:px-6 mr-1 rounded-md yxj-font"
            onClick={no}>× ¿Cambiaste de opinion? ×</button>
        </div>} */}
      </div>
    </div>
  )
}
