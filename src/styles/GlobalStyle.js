import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'RetroGaming';
    font-weight: 400;
    src: url('./Retro Gaming.ttf') format('truetype');
  }

  body {
    font-family: 'RetroGaming', sans-serif;
  };
`;

export default GlobalStyle;
