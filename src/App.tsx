import './App.css';
import test from './contentScripts/test';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    alert('Quick Command extensions has be initialized!')
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={test}>
          Change color
        </button>
      </header>
    </div>
  );
}

export default App;