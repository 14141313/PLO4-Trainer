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
  const [pot, setPot] = useState(30); // 6 x $5 antes
  const [playerHasActed, setPlayerHasActed] = useState(false);
  const [playerHand] = useState(generateUniqueCards(4));
  const [opponentHands] = useState(
    Array.from({ length: 5 }, () => generateUniqueCards(4))
  );
  const [board1] = useState(generateUniqueCards(5));
  const [board2] = useState(generateUniqueCards(5));
  const [opponentActions, setOpponentActions] = useState<string[]>([]);

  const handlePlayerAction = (action: 'check' | 'bet') => {
    let newPot = pot;

    if (action === 'bet') {
      newPot += 30; // you bet the pot
      const actions = opponentHands.map(() => {
        const rand = Math.random();
        if (rand < 0.4) return 'fold';
        else return 'call';
      });

      const calls = actions.filter(a => a === 'call').length;
      newPot += calls * 30;
      setOpponentActions(actions);
    } else {
      setOpponentActions(Array(5).fill('check'));
    }

    setPot(newPot);
    setPlayerHasActed(true);
  };

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>
      <div className="text-xl">💰 Pot: ${pot}</div>

      <div>
        <h2 className="text-xl mb-2 font-semibold">Your Hand</h2>
        <div className="flex gap-4 text-3xl">
          {playerHand.map((card, i) => (
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

      {!playerHasActed ? (
        <div className="flex gap-4 mt-6">
          <button onClick={() => handlePlayerAction('check')} className="px-4 py-2 bg-blue-600 rounded">
            Check
          </button>
          <button onClick={() => handlePlayerAction('bet')} className="px-4 py-2 bg-red-600 rounded">
            Bet Pot
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Opponent Reactions:</h2>
          <ul className="space-y-1">
            {opponentActions.map((action, i) => (
              <li key={i}>Opponent {i + 1}: {action.toUpperCase()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
