import React from 'react';
import Main from './components/Main';
import HelpButton from './components/MainPage/HelpButton';
import './styles/app.scss';

const App: React.FC = () => {
  return (
    <div className='app'>
      <header></header>
      <HelpButton />
      <Main></Main>
      <footer></footer>
    </div>
  );
};

export default App;
