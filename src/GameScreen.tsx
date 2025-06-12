import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const positions = ['SB', 'BB', 'EP', 'MP', 'HJ', 'CO'];

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

type Street = 'flop' | 'turn' | 'river' | 'showdown';

export default function GameScreen({ position }: { position: string }) {
  const [holeCards] = useState(generateUniqueCards(4));
  const [board1] = useState(generateUniqueCards(5));
  const [board2] = useState(generateUniqueCards(5));

  const [street, setStreet] = useState<Street>('flop');
  const [activePlayers, setActivePlayers] = useState<string[]>(positions.filter((p) => p !== position));
  const [foldedPlayers, setFoldedPlayers] = useState<string[]>([]);
  const [userHasActed, setUserHasActed] = useState(false);

  const handleUserAction = () => {
    setUserHasActed(true);
  };

  const simulateBotActions = () => {
    const remaining = [];
    for (let pos of positions) {
      if (pos === position) continue;
      if (Math.random() < 0.3) {
        setFoldedPlayers((prev) => [...prev, pos]);
      } else {
        remaining.push(pos);
      }
    }
    setActivePlayers(remaining);
  };

  useEffect(() => {
    if (userHasActed && street !== 'showdown') {
      simulateBotActions();
      const delay = 1000;
      setTimeout(() => {
        if (street === 'flop') setStreet('turn');
        else if (street === 'turn') setStreet('river');
        else setStreet('showdown');
        setUserHasActed(false);
      }, delay);
    }
  }, [userHasActed]);

  const renderBoard = () => {
    const boardLength = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;
    return (
      <>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board 1</h2>
          <div className="flex gap-3 text-2xl">
            {board1.slice(0, boardLength).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
                {card}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board 2</h2>
          <div className="flex gap-3 text-2xl">
            {board2.slice(0, boardLength).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
                {card}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Hand</h2>
        <div className="flex gap-3 text-3xl">
          {holeCards.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      {renderBoard()}

      {street !== 'showdown' && !userHasActed && (
        <div className="mt-6">
          <h3 className="text-lg mb-2">Your Action</h3>
          <div className="flex gap-4">
            <button
              onClick={handleUserAction}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
            >
              Check
            </button>
            <button
              onClick={handleUserAction}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white"
            >
              Bet Pot
            </button>
          </div>
        </div>
      )}

      {street !== 'flop' && (
        <div className="mt-6 text-lg">
          <p>Players Remaining: {activePlayers.length + 1}</p>
          <p>Folded: {foldedPlayers.join(', ') || 'None'}</p>
        </div>
      )}

      {street === 'showdown' && (
        <div className="mt-6 text-xl font-bold">
          <p>Showdown! (Mock equity results to be added)</p>
        </div>
      )}
    </div>
  );
}
