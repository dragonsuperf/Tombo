import './App.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const COMBO_TIMER = 10;

function App() {
  const [currentCombo, setCurrentCombo] = useState(0);
  const [comboTime, setComboTime] = useState(0);
  const [props, set] = useSpring(() => ({fontSize: '1em'}));

  const addCombo = () => {
    setCurrentCombo(combo => combo + 1);
    set({fontSize: '2em'});
    setTimeout(() => set({fontSize: '1em'}), 100);
  }

  const resetCombo = () => {
    setCurrentCombo(0);
  }

  useEffect(() => {
    let interval = setInterval(() => setComboTime(comboTime => comboTime + 1), 1000);

    window.ipcRenderer.on('key-down', (event) => {
      setComboTime(0);
      addCombo();
    });
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    if(comboTime > COMBO_TIMER) resetCombo();
  }, [comboTime])

  return (
    <div className="app">
      <header className="App-header">
        <animated.div style={props}>
          {currentCombo}
        </animated.div>
      </header>
    </div>
  );
}

export default App;
