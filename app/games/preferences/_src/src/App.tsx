import './App.css';
import PreferencesGame from './components/PreferencesGame';
import { GameProvider } from './context/GameProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <GameProvider>
        <PreferencesGame />
      </GameProvider>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
