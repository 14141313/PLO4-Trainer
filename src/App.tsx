import React from 'react';

const positions = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB'];

export default function PositionSelector({ onSelect }: { onSelect: (pos: string) => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Choose Your Seat</h1>
      <div className="grid grid-cols-3 gap-4">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => onSelect(pos)}
            className="bg-gray-700 hover:bg-gray-500 px-4 py-2 rounded"
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
