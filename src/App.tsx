import React, { useState } from 'react';
import { initialAppState } from './data';
import { AppState } from './types';
import SplashScreen from './components/SplashScreen';
import InputScreen from './components/InputScreen';
import ResultsScreen from './components/ResultsScreen';

export default function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [screen, setScreen] = useState<'splash' | 'input' | 'results'>('splash');

  return (
    <>
      {screen === 'splash' && (
        <SplashScreen onComplete={() => setScreen('input')} />
      )}
      {screen === 'input' && (
        <InputScreen 
          appState={appState} 
          setAppState={setAppState} 
          onNext={() => setScreen('results')} 
        />
      )}
      {screen === 'results' && (
        <ResultsScreen 
          appState={appState} 
          onBack={() => setScreen('input')}
        />
      )}
    </>
  );
}
