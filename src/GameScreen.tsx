import React from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

// Generate a random card
const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

// Generate unique cards
const generateUniqueCards = (count: number): string[] => {
  const cards = new Set<string>();
  while (cards.size < count) {
    cards.add(getRandomCard());
  }
  return Array.from(cards);
};

export default function GameScreen({ position }: { position: string }) {
  console.log('GameScreen loaded with position:', position); // ✅ Add this line

  const holeCards = generateUniqueCards(4);
  const board1 = generateUniqueCards(5);
  const board2 = generateUniqueCards(5);

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>
      ...

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl mb-2 font-semibold">Your Hand</h2>
        <div className="flex gap-4 text-3xl">
          {holeCards.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-4 mb-2 font-semibold">Board 1</h2>
        <div className="flex gap-4 text-2xl">
          {board1.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-4 mb-2 font-semibold">Board 2</h2>
        <div className="flex gap-4 text-2xl">
          {board2.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
