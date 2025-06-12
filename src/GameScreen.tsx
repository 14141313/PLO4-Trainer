import React, { useState, useEffect } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

const generateUniqueCards = (count: number, exclude: Set<string> = new Set()): string[] => {
  const cards = new Set<string>();
  while (cards.size < count) {
    const card = getRandomCard();
    if (!cards.has(card) && !exclude.has(card)) {
      cards.add(card);
    }
  }
  return Array.from(cards);
};

const getMockEquity = () => Math.floor(Math.random() * 100); // placeholder

const getActionFromEquity = (equity: number) => {
  if (equity >= 60) return 'Pot Bet';
  if (equity >= 35) return 'Call';
  return 'Fold';
};

export default function GameScreen({ position }: { position: string }) {
  const [stage, setStage] = useState<'flop' | 'turn' | 'river' | 'done'>('flop');
  const [opponentActions, setOpponentActions] = useState<string[]>([]);

  const usedCards = new Set<string>();
  const holeCards = generateUniqueCards(4, usedCards);
  holeCards.forEach(card => usedCards.add(card));

  const board1 = generateUniqueCards(5, usedCards);
  board1.forEach(card => usedCards.add(card));
  const board2 = generateUniqueCards(5, usedCards);
  board2.forEach(card => usedCards.add(card));

  const opponents = Array.from({ length: 5 }, () =>
    generateUniqueCards(4, usedCards)
  );

  useEffect(() => {
    const actions = opponents.map(() => {
      const equity = getMockEquity();
      return getActionFromEquity(equity);
    });
    setOpponentActions(actions);
  }, []);

  const revealNextStreet = () => {
    if (stage === 'flop') setStage('turn');
    else if (stage === 'turn') setStage('river');
    else setStage('done');
  };

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Hand</h2>
        <div className="flex gap-4 text-3xl">
          {holeCards.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-6 mb-2 font-semibold">Board 1</h2>
        <div className="flex gap-4 text-2xl">
          {board1.slice(0, stage === 'flop' ? 3 : stage === 'turn' ? 4 : 5).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-6 mb-2 font-semibold">Board 2</h2>
        <div className="flex gap-4 text-2xl">
          {board2.slice(0, stage === 'flop' ? 3 : stage === 'turn' ? 4 : 5).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Opponent Actions</h2>
        <ul className="space-y-1">
          {opponentActions.map((action, i) => (
            <li key={i}>Opponent {i + 1}: {action}</li>
          ))}
        </ul>
      </div>

      {stage !== 'done' && (
        <button
          onClick={revealNextStreet}
          className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
        >
          Reveal {stage === 'flop' ? 'Turn' : stage === 'turn' ? 'River' : 'Results'}
        </button>
      )}
    </div>
  );
}
