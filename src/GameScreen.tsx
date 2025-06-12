import React, { useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

const generateUniqueCards = (count: number): string[] => {
  const cards = new Set<string>();
  while (cards.size < count) {
    cards.add(getRandomCard());
  }
  return Array.from(cards);
};

export default function GameScreen({ position }: { position: string }) {
  const [stage, setStage] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');
  const [actions, setActions] = useState<string[]>([]);

  const holeCards = generateUniqueCards(4);
  const board1 = generateUniqueCards(5);
  const board2 = generateUniqueCards(5);

  const displayedBoard1 =
    stage === 'flop' ? board1.slice(0, 3) : stage === 'turn' ? board1.slice(0, 4) : board1;
  const displayedBoard2 =
    stage === 'flop' ? board2.slice(0, 3) : stage === 'turn' ? board2.slice(0, 4) : board2;

  const nextStage = () => {
    if (stage === 'flop') setStage('turn');
    else if (stage === 'turn') setStage('river');
    else if (stage === 'river') setStage('showdown');
  };

  const handleAction = (action: string) => {
    setActions([...actions, action]);
    nextStage();
  };

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
          {displayedBoard1.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-4 mb-2 font-semibold">Board 2</h2>
        <div className="flex gap-4 text-2xl">
          {displayedBoard2.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      {stage !== 'showdown' && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleAction('check')}
            className="px-6 py-2 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600"
          >
            Check
          </button>
          <button
            onClick={() => handleAction('bet')}
            className="px-6 py-2 bg-yellow-500 rounded-xl text-black font-semibold hover:bg-yellow-600"
          >
            Bet
          </button>
        </div>
      )}

      {stage === 'showdown' && (
        <div className="mt-6 text-lg font-semibold">Showdown reached. Actions taken: {actions.join(', ')}</div>
      )}
    </div>
  );
}
