import HelpButton from './components/MainPage/HelpButton';
import Main from './components/Main';
import './styles/app.scss';

function App() {
  return (
    <div className='app'>
      <header className='app__header'>
        <HelpButton />
      </header>
      <Main />
    </div>
  );
}

export default App;
