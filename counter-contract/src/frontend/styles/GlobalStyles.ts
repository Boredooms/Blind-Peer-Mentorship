import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    color: ${theme.colors.text};
  }

  h1 {
    font-size: ${theme.fontSizes['5xl']};
    font-weight: 700;
  }

  h2 {
    font-size: ${theme.fontSizes['4xl']};
  }

  h3 {
    font-size: ${theme.fontSizes['3xl']};
  }

  p {
    color: ${theme.colors.textSecondary};
  }

  a {
    color: ${theme.colors.text};
    text-decoration: none;
    transition: opacity ${theme.transitions.fast};
    
    &:hover {
      opacity: 0.8;
    }
  }

  button {
    font-family: ${theme.fonts.primary};
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${theme.transitions.base};
  }

  code {
    font-family: ${theme.fonts.mono};
    background-color: ${theme.colors.surface};
    padding: 0.125rem 0.375rem;
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.9em;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.dark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.medium};
    border-radius: ${theme.borderRadius.base};
    
    &:hover {
      background: ${theme.colors.mediumLight};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
  }
`;
