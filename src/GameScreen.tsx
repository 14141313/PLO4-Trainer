import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const generateCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

const generateUniqueCards = (count: number, used: Set<string>): string[] => {
  const cards: string[] = [];
  while (cards.length < count) {
    const card = generateCard();
    if (!used.has(card)) {
      cards.push(card);
      used.add(card);
    }
  }
  return cards;
};

type Player = {
  name: string;
  holeCards: string[];
  folded: boolean;
};

export default function GameScreen({ position }: { position: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [userIndex, setUserIndex] = useState<number | null>(null);
  const [street, setStreet] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [usedCards, setUsedCards] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const used = new Set<string>();
    const allPositions = ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'];
    const newPlayers: Player[] = allPositions.map((name) => ({
      name,
      holeCards: generateUniqueCards(4, used),
      folded: false,
    }));
    setUsedCards(used);
    setPlayers(newPlayers);
    setBoard1(generateUniqueCards(5, used));
    setBoard2(generateUniqueCards(5, used));
    setUserIndex(allPositions.indexOf(position));
  }, []);

  const isUserTurn = userIndex !== null && currentPlayerIndex === userIndex;
  const userPlayer = userIndex !== null ? players[userIndex] : null;

  const handleAction = (action: 'check' | 'bet') => {
    if (action === 'bet') {
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex].folded = false;
      setPlayers(newPlayers);
    }

    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= players.length) {
      if (street === 'flop') setStreet('turn');
      else if (street === 'turn') setStreet('river');
      else if (street === 'river') {
        setStreet('showdown');
        setShowResult(true);
      }
      setCurrentPlayerIndex(0);
    } else {
      setCurrentPlayerIndex(nextIndex);
    }
  };

  const handleBotAction = () => {
    const action = Math.random() > 0.4 ? 'bet' : 'check';
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].folded = action === 'bet' && Math.random() > 0.5;
    setPlayers(newPlayers);
    handleAction(action === 'bet' ? 'bet' : 'check');
  };

  useEffect(() => {
    if (!isUserTurn && street !== 'showdown') {
      const timeout = setTimeout(() => handleBotAction(), 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayerIndex]);

  const visibleBoard = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-4">
      <h1 className="text-xl font-bold">You are in: {position}</h1>
      <h2 className="text-lg">Current Street: {street.toUpperCase()}</h2>

      <div className="flex flex-col gap-4 items-center">
        <div>
          <h2 className="font-semibold mb-1">Board 1</h2>
          <div className="flex gap-2 text-2xl">
            {board1.slice(0, visibleBoard).map((card, i) => (
              <span key={i} className="bg-white text-black px-2 py-1 rounded-lg">{card}</span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Board 2</h2>
          <div className="flex gap-2 text-2xl">
            {board2.slice(0, visibleBoard).map((card, i) => (
              <span key={i} className="bg-white text-black px-2 py-1 rounded-lg">{card}</span>
            ))}
          </div>
        </div>
      </div>

      {userPlayer && (
        <div className="mt-4 text-center">
          <h2 className="font-semibold mb-1">Your Hand</h2>
          <div className="flex gap-2 text-2xl">
            {userPlayer.holeCards.map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-lg">{card}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Players</h2>
        <div className="grid grid-cols-2 gap-4">
          {players.map((p, i) => (
            <div key={i} className="text-sm text-center">
              <div className="font-bold">{p.name}</div>
              {street === 'showdown' && !p.folded ? (
                <div className="flex gap-1 justify-center mt-1">
                  {p.holeCards.map((c, j) => (
                    <span key={j} className="bg-white text-black px-2 py-1 rounded-md">{c}</span>
                  ))}
                </div>
              ) : (
                <div className="mt-2">{p.folded ? '(Folded)' : ''}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {street !== 'showdown' && isUserTurn && (
        <div className="flex gap-4 mt-6">
          <button onClick={() => handleAction('check')} className="px-4 py-2 bg-blue-500 rounded-md">
            Check
          </button>
          <button onClick={() => handleAction('bet')} className="px-4 py-2 bg-red-500 rounded-md">
            Bet
          </button>
        </div>
      )}

      {showResult && (
        <div className="mt-6 bg-black bg-opacity-50 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Showdown Results</h2>
          <p className="text-sm">(Winner logic will be added soon)</p>
        </div>
      )}
    </div>
  );
}
