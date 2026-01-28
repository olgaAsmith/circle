import React from 'react';
import Main from './components/Main';
import './styles/app.scss';

const App: React.FC = () => {
  return (
    <div className='app'>
      <header></header>
      <Main></Main>
      <footer></footer>
    </div>
  );
};

export default App;
