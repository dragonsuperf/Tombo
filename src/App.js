import './App.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import styled, { keyframes } from 'styled-components';

const comboColors = ['#4effa1', '#87CEFA', '#dc143c', '#ffdf00'];
const exclamTexts = [
  'Great!',
  'Impressive!',
  'Nice!',
  'Unstoppable!', 
  'God Like!',
  'Wow!',
  'Nice Job!',
  'Goob Job!',
  'Cool!',
  'Keep Going!',
  'Fantastic!',
  'Good!'
];

const slideToUnder = keyframes`
  0% {
    transform: translateY(-75%);
    opacity: 1;
  }
  99% {
    transform: translateY(-100%);
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: #282c34;
  min-height: 100vh;
  & > header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: white;
    padding: 5px;
    margin-right: 8px;
    font-size: 11px;
  }
`;

const ComboContainer = styled.div`
  display: flex;
  min-height: 70px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(30px + 2vmin);
  color: white;
  flex-grow: 1;
`;

const Exclamation = styled.div`
  position: fixed;
  color: ${(props) => props.color};
  animation: ${slideToUnder} 0.5s 1 linear forwards;
`;

const ComboHolder = styled.div`
  content: '';
  border-bottom: solid 2px white;
  color: ${(props) => props.color};
`;

const MaxComboHolder = styled.div`
  position: fixed;
  color: white;
  bottom: 5px;
  left: 13px;
  font-size: 10px;
`;

const COMBO_TIMER = 10;

function App() {
  const [currentCombo, setCurrentCombo] = useState(0);
  const [comboTime, setComboTime] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [showExcalm, setShowExcalm] = useState(false);
  const [exclamIndex, setExclamIndex] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [props, set] = useSpring(() => ({fontSize: '1em'}));

  const addCombo = () => {
    setCurrentCombo(combo => combo + 1);
    set({fontSize: '1.5em'});
    setTimeout(() => set({fontSize: '1em'}), 100);
  }

  const resetCombo = () => {
    if( currentCombo > maxCombo ) setMaxCombo(currentCombo);
    setCurrentCombo(0);
    setShowExcalm(false);
  }
  
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  }

  const activeExclam = () => {
    setShowExcalm(true);
    setTimeout(() => setShowExcalm(false), 500);
    setExclamIndex(getRandomIntInclusive(0, exclamTexts.length - 1));
  };

  useEffect(() => {
    setColorIndex(currentCombo.toString().length - 1);
    if(currentCombo % 10 === 0 && !showExcalm && currentCombo > 0) activeExclam();
  }, [currentCombo])

  useEffect(() => {
    const interval = setInterval(() => setComboTime(comboTime => comboTime + 1), 1000);

    window.ipcRenderer.on('key-down', (event, key) => {
      const { altKey, ctrlKey, metaKey, shiftKey } = key.key;
      if (altKey || ctrlKey || metaKey || shiftKey) return;
      setComboTime(0);
      addCombo();
    });
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    if(comboTime > COMBO_TIMER) resetCombo();
  }, [comboTime])

  return (
    <Wrapper>
      <header>Tombo</header>
      <ComboContainer>
        {showExcalm && 
          <Exclamation color={comboColors[colorIndex]}>
            {exclamTexts[exclamIndex]}
          </Exclamation>
        }
        <ComboHolder color={comboColors[colorIndex]}>
          <animated.div style={props}>
            {currentCombo}
          </animated.div>
        </ComboHolder>
        {maxCombo > 0 && <MaxComboHolder>Max Tombo: {maxCombo}</MaxComboHolder>}
      </ComboContainer>
    </Wrapper>
  );
}

export default App;
