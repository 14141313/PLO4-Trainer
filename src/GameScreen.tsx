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

type Player = {
  position: string;
  cards: string[];
  folded: boolean;
};

type Street = 'flop' | 'turn' | 'river' | 'showdown';

export default function GameScreen({ position }: { position: string }) {
  const [userCards] = useState(generateUniqueCards(4));
  const [board1] = useState(generateUniqueCards(5));
  const [board2] = useState(generateUniqueCards(5));
  const [street, setStreet] = useState<Street>('flop');
  const [players, setPlayers] = useState<Player[]>([]);
  const [userHasActed, setUserHasActed] = useState(false);

  // Init players (user + bots)
  useEffect(() => {
    const takenCards = new Set(userCards);
    const genCards = () => {
      const cards: string[] = [];
      while (cards.length < 4) {
        const c = getRandomCard();
        if (!takenCards.has(c)) {
          takenCards.add(c);
          cards.push(c);
        }
      }
      return cards;
    };

    const bots = positions.filter(p => p !== position).map(pos => ({
      position: pos,
      cards: genCards(),
      folded: false,
    }));

    setPlayers([
      { position, cards: userCards, folded: false },
      ...bots,
    ]);
  }, [position, userCards]);

  // Bot actions after user acts
  useEffect(() => {
    if (userHasActed && street !== 'showdown') {
      const timeout = setTimeout(() => {
        setPlayers(prev =>
          prev.map(p =>
            p.position !== position
              ? { ...p, folded: Math.random() < 0.3 }
              : p
          )
        );

        setStreet(prev =>
          prev === 'flop' ? 'turn' : prev === 'turn' ? 'river' : 'showdown'
        );
        setUserHasActed(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [userHasActed, street, position]);

  const handleUserAction = () => {
    setUserHasActed(true);
  };

  const renderBoard = () => {
    const count = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;
    return (
      <>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board 1</h2>
          <div className="flex gap-3 text-2xl">
            {board1.slice(0, count).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
                {card}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board 2</h2>
          <div className="flex gap-3 text-2xl">
            {board2.slice(0, count).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
                {card}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderShowdown = () => {
    const remaining = players.filter(p => !p.folded);
    return (
      <>
        <h2 className="text-xl font-bold mt-6">Showdown</h2>
        <div className="mt-4 grid grid-cols-2 gap-6">
          {remaining.map(p => (
            <div key={p.position} className="bg-gray-800 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">{p.position}</h3>
              <div className="flex gap-2 text-xl">
                {p.cards.map((card, i) => (
                  <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-yellow-300 font-bold text-lg">
          (Hand scoring logic will go here)
        </div>
      </>
    );
  };

  const remainingPlayers = players.filter(p => !p.folded && p.position !== position).length;
  const folded = players.filter(p => p.folded && p.position !== position).map(p => p.position);

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Hand</h2>
        <div className="flex gap-3 text-3xl">
          {userCards.map((card, i) => (
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
        <div className="mt-4 text-lg">
          <p>Players Remaining: {remainingPlayers + 1}</p>
          <p>Folded: {folded.join(', ') || 'None'}</p>
        </div>
      )}

      {street === 'showdown' && renderShowdown()}
    </div>
  );
}
