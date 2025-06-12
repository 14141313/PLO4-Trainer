import React, { useEffect, useState } from 'react';
import { generateUniqueCards, evaluatePLOHand } from './utils';

const positions = ['BTN', 'CO', 'HJ', 'MP', 'EP', 'SB', 'BB'];

const getNextStreet = (street: string) => {
  if (street === 'flop') return 'turn';
  if (street === 'turn') return 'river';
  return 'showdown';
};

export default function GameScreen({ position }: { position: string }) {
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [board, setBoard] = useState<string[]>([]);
  const [street, setStreet] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');
  const [players, setPlayers] = useState<any[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [showEquity, setShowEquity] = useState(false);

  useEffect(() => {
    const allCards = generateUniqueCards(4 + 5 + (5 * 5));
    const hero = { name: 'You', cards: allCards.slice(0, 4), folded: false };
    const bots = Array.from({ length: 5 }, (_, i) => ({
      name: `Bot ${i + 1}`,
      cards: allCards.slice(4 + i * 4, 8 + i * 4),
      folded: false,
    }));
    setHoleCards(hero.cards);
    setPlayers([hero, ...bots]);
    setBoard(allCards.slice(4 + 5 * 4, 4 + 5 * 4 + 5));
  }, []);

  const handleAction = (action: string) => {
    setActions((prev) => [...prev, action]);

    if (street === 'river') {
      setStreet('showdown');
      setShowEquity(true);
    } else {
      setStreet(getNextStreet(street));
    }
  };

  const visibleBoard =
    street === 'flop' ? board.slice(0, 3) : street === 'turn' ? board.slice(0, 4) : board;

  const getEquity = () => {
    return {
      flop: '33%',
      turn: '45%',
      river: '60%',
    };
  };

  const equity = getEquity();

  const determineWinners = () => {
    // Placeholder logic: randomly choose winner(s) among non-folded players
    const inHand = players.filter((p) => !p.folded);
    const winners = [inHand[Math.floor(Math.random() * inHand.length)]];
    return winners;
  };

  const winners = determineWinners();

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Hand</h2>
        <div className="flex gap-4 text-2xl">
          {holeCards.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Community Cards ({street})</h2>
        <div className="flex gap-4 text-2xl">
          {visibleBoard.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">
              {card}
            </span>
          ))}
        </div>
      </div>

      {street !== 'showdown' && (
        <div className="mt-6 space-x-4">
          <button
            onClick={() => handleAction('check')}
            className="px-6 py-2 bg-blue-500 rounded-xl font-semibold"
          >
            Check
          </button>
          <button
            onClick={() => handleAction('bet')}
            className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-semibold"
          >
            Bet
          </button>
        </div>
      )}

      {street === 'showdown' && (
        <div className="mt-8 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Showdown</h2>

          <div className="space-y-4">
            {players.map((player, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-lg font-semibold">{player.name}</span>
                {player.folded ? (
                  <span className="italic text-gray-400">Folded</span>
                ) : (
                  <div className="flex gap-2">
                    {player.cards.map((card: string, i: number) => (
                      <span
                        key={i}
                        className="bg-white text-black px-2 py-1 rounded"
                      >
                        {card}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Winner(s):</h3>
            <ul className="list-disc pl-6">
              {winners.map((winner, i) => (
                <li key={i}>{winner.name}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Equity</h3>
            <p>Flop: {equity.flop}</p>
            <p>Turn: {equity.turn}</p>
            <p>River: {equity.river}</p>
          </div>
        </div>
      )}
    </div>
  );
}
