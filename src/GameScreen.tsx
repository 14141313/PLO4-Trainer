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
  const [userIndex, setUserIndex] = useState<number | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [street, setStreet] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [usedCards, setUsedCards] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const used = new Set<string>();
    const allPositions = ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'];
    const userIdx = allPositions.indexOf(position);

    const newPlayers: Player[] = allPositions.map((name) => ({
      name,
      holeCards: generateUniqueCards(4, used),
      folded: false,
    }));

    setPlayers(newPlayers);
    setUserIndex(userIdx);
    setUsedCards(used);
    setBoard1(generateUniqueCards(5, used));
    setBoard2(generateUniqueCards(5, used));
  }, [position]);

  const isUserTurn = userIndex !== null && currentPlayerIndex === userIndex;

  const handleAction = (action: 'check' | 'bet') => {
    const updatedPlayers = [...players];
    if (action === 'bet' && currentPlayerIndex !== userIndex) {
      updatedPlayers[currentPlayerIndex].folded = true;
    }
    setPlayers(updatedPlayers);

    const nextIndex = currentPlayerIndex + 1;
    const endOfRound = nextIndex >= players.length;

    if (endOfRound) {
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
    const random = Math.random();
    const action = random < 0.4 ? 'check' : 'bet';
    handleAction(action);
  };

  useEffect(() => {
    if (!isUserTurn && street !== 'showdown') {
      const timeout = setTimeout(() => handleBotAction(), 800);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayerIndex, isUserTurn, street]);

  const visibleBoard = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-4">
      <h1 className="text-xl font-bold">You are in: {position}</h1>
      <h2 className="text-lg">Current Street: {street.toUpperCase()}</h2>

      <div>
        <h3 className="mt-4 font-semibold">Board 1</h3>
        <div className="flex gap-2 text-2xl">
          {board1.slice(0, visibleBoard).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-lg">{card}</span>
          ))}
        </div>
        <h3 className="mt-4 font-semibold">Board 2</h3>
        <div className="flex gap-2 text-2xl">
          {board2.slice(0, visibleBoard).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-lg">{card}</span>
          ))}
        </div>
      </div>

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

      {userIndex !== null && players[userIndex] && (
        <div className="mt-4 text-center">
          <h2 className="font-semibold mb-1">Your Hand</h2>
          <div className="flex gap-2 text-2xl">
            {players[userIndex].holeCards.map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-lg">{card}</span>
            ))}
          </div>
        </div>
      )}

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
        <div className="mt-6 bg-black bg-opacity-40 p-4 rounded-xl">
          <h2 className="text-lg font-bold">Showdown Results</h2>
          <p className="text-sm italic text-gray-300">(Scoring logic to be added)</p>
        </div>
      )}
    </div>
  );
}
