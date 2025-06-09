import React from 'react';

const positions = ['BTN', 'CO', 'HJ', 'MP', 'EP', 'SB', 'BB'];

export default function PositionSelector({ onSelect }: { onSelect: (position: string) => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Choose Your Seat</h1>
      <div className="grid grid-cols-3 gap-4">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => onSelect(pos)}
            className="px-6 py-3 rounded-xl text-lg font-semibold border border-white hover:bg-white hover:text-black transition"
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
