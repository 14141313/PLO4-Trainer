import React from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const generateDeck = (): string[] => {
  const deck: string[] = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

const shuffle = (array: string[]): string[] => {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function GameScreen({ position }: { position: string }) {
  const { holeCards, board1, board2 } = React.useMemo(() => {
    const deck = shuffle(generateDeck());
    return {
      holeCards: deck.slice(0, 4),
      board1: deck.slice(4, 9),
      board2: deck.slice(9, 14),
    };
  }, []);

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
