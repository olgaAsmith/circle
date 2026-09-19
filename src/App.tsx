import React from 'react';
import Main from './components/Main';
import './styles/app.scss';

const App: React.FC = () => {
  return (
    <div className='app'>
      <div className='bg-decor' aria-hidden='true'>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <header></header>
      <Main></Main>
      <footer></footer>
    </div>
  );
};

export default App;
