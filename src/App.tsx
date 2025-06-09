import React, { useState } from 'react';
import PositionSelector from './PositionSelector';
import GameScreen from './GameScreen';

export default function App() {
  const [position, setPosition] = useState<string | null>(null);

  return (
    <>
      {!position ? (
        <PositionSelector onSelect={(pos) => setPosition(pos)} />
      ) : (
        <GameScreen position={position} />
      )}
    </>
  );
}
