import React from 'react';
import { Game } from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Tap Jump Adventure
        </h1>
        <div className="flex justify-center">
          <Game />
        </div>
        <p className="text-gray-400 text-center mt-4">
          Tap the screen to make the square jump!
        </p>
      </div>
    </div>
  );
}

export default App;