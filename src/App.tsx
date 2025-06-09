import React, { useState } from 'react';

const positions = ['BTN', 'CO', 'HJ', 'MP', 'EP', 'SB', 'BB'];

export default function PositionSelector({ onSelect }: { onSelect: (position: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (pos: string) => {
    setSelected(pos);
    onSelect(pos);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Choose Your Seat</h1>
      <div className="grid grid-cols-3 gap-4">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => handleClick(pos)}
            className={`px-6 py-3 rounded-xl text-lg font-semibold border transition-all duration-200
              ${selected === pos ? 'bg-green-500 text-black' : 'border-white hover:bg-white hover:text-black'}`}
          >
            {pos}
          </button>
        ))}
      </div>
      {selected && <p className="mt-6 text-lg">Selected: <span className="font-mono">{selected}</span></p>}
    </div>
  );
}
