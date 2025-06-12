import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const positions = ['SB', 'BB', 'EP', 'MP', 'HJ', 'CO'];

const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

const generateUniqueCards = (count: number, exclude: Set<string>): string[] => {
  const cards = new Set<string>();
  while (cards.size < count) {
    const card = getRandomCard();
    if (!exclude.has(card)) {
      cards.add(card);
      exclude.add(card);
    }
  }
  return Array.from(cards);
};

interface Player {
  name: string;
  position: string;
  holeCards: string[];
  isUser: boolean;
  inHand: boolean;
}

export default function GameScreen({ position }: { position: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [street, setStreet] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');
  const [showResults, setShowResults] = useState(false);
  const [excludedCards] = useState(new Set<string>());

  useEffect(() => {
    const generatedPlayers: Player[] = positions.map((pos) => {
      const isUser = pos === position;
      const holeCards = generateUniqueCards(4, excludedCards);
      return {
        name: isUser ? 'You' : `Bot (${pos})`,
        position: pos,
        holeCards,
        isUser,
        inHand: true,
      };
    });

    const boardCards1 = generateUniqueCards(5, excludedCards);
    const boardCards2 = generateUniqueCards(5, excludedCards);

    setPlayers(generatedPlayers);
    setBoard1(boardCards1);
    setBoard2(boardCards2);
  }, [position]);

  useEffect(() => {
    if (street === 'river') {
      const timeout = setTimeout(() => {
        setStreet('showdown');
        setShowResults(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [street]);

  const nextStreet = () => {
    if (street === 'flop') setStreet('turn');
    else if (street === 'turn') setStreet('river');
  };

  const visibleCards = (cards: string[], count: number) => cards.slice(0, count);
  const streetCardCount = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Board 1</h2>
        <div className="flex gap-2 text-2xl">
          {visibleCards(board1, streetCardCount).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Board 2</h2>
        <div className="flex gap-2 text-2xl">
          {visibleCards(board2, streetCardCount).map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Players</h2>
        <div className="grid grid-cols-2 gap-4">
          {players.map((p, idx) => (
            <div key={idx} className="p-3 bg-black rounded-lg border border-white">
              <p className="font-bold">{p.name}</p>
              {p.isUser || showResults ? (
                <div className="flex gap-2 mt-1">
                  {p.holeCards.map((card, i) => (
                    <span key={i} className="bg-white text-black px-2 py-1 rounded">{card}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic mt-1">Hidden</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {street !== 'showdown' && (
        <button
          onClick={nextStreet}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded"
        >
          Continue
        </button>
      )}

      {showResults && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-2">Showdown!</h2>
          <p className="italic">(Hand scoring logic will go here)</p>
        </div>
      )}
    </div>
  );
}
