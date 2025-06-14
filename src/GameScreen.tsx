import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const positions = ['SB', 'BB', 'EP', 'MP', 'HJ', 'CO'];

type Street = 'flop' | 'turn' | 'river' | 'showdown';

const createDeck = (): string[] => {
  const deck: string[] = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck.sort(() => Math.random() - 0.5); // Shuffle
};

export default function GameScreen({ position }: { position: string }) {
  const [deck] = useState(createDeck());
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [street, setStreet] = useState<Street>('flop');
  const [activePlayers, setActivePlayers] = useState<string[]>(positions.filter(p => p !== position));
  const [foldedPlayers, setFoldedPlayers] = useState<string[]>([]);
  const [userHasActed, setUserHasActed] = useState(false);
  const [mockResults, setMockResults] = useState<{ board1: string; board2: string }>({ board1: '', board2: '' });

  // Deal cards from deck without duplicates
  useEffect(() => {
    const deckCopy = [...deck];
    const hand = deckCopy.splice(0, 4);
    const b1 = deckCopy.splice(0, 5);
    const b2 = deckCopy.splice(0, 5);
    setHoleCards(hand);
    setBoard1(b1);
    setBoard2(b2);
  }, [deck]);

  const handleUserAction = () => setUserHasActed(true);

  const simulateBotActions = () => {
    const remaining: string[] = [];
    for (let pos of positions) {
      if (pos === position) continue;
      if (Math.random() < 0.3) {
        setFoldedPlayers(prev => [...prev, pos]);
      } else {
        remaining.push(pos);
      }
    }
    setActivePlayers(remaining);
  };

  useEffect(() => {
    if (userHasActed && street !== 'showdown') {
      simulateBotActions();
      setTimeout(() => {
        setStreet(prev => {
          if (prev === 'flop') return 'turn';
          if (prev === 'turn') return 'river';
          return 'showdown';
        });
        setUserHasActed(false);
      }, 1000);
    }
  }, [userHasActed]);

  useEffect(() => {
    if (street === 'showdown') {
      const allIn = [position, ...activePlayers];
      const winner1 = allIn[Math.floor(Math.random() * allIn.length)];
      const winner2 = allIn[Math.floor(Math.random() * allIn.length)];
      setMockResults({
        board1: `Winner Board 1: ${winner1} with a Flush`,
        board2: `Winner Board 2: ${winner2} with a Full House`,
      });
    }
  }, [street]);

  const renderBoard = () => {
    const boardLength = street === 'flop' ? 3 : street === 'turn' ? 4 : 5;
    return (
      <>
        <div>
          <h2 className="text-xl font-semibold mb-2">Board 1</h2>
          <div className="flex gap-3 text-2xl">
            {board1.slice(0, boardLength).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board 2</h2>
          <div className="flex gap-3 text-2xl">
            {board2.slice(0, boardLength).map((card, i) => (
              <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderPlayers = () => {
    const allPlayers = [position, ...activePlayers, ...foldedPlayers.filter(p => p !== position && !activePlayers.includes(p))];
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Players</h3>
        <ul className="space-y-1">
          {allPlayers.map(pos => (
            <li key={pos}>
              {pos} – {pos === position ? (
                <>
                  You <span className="ml-2 text-gray-300">[{holeCards.join(', ')}]</span>
                </>
              ) : foldedPlayers.includes(pos) ? (
                'Folded'
              ) : (
                <span className="ml-2 text-gray-300">[??, ??, ??, ??]</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-900 text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">You are in: {position}</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Hand</h2>
        <div className="flex gap-3 text-3xl">
          {holeCards.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      {renderBoard()}
      {renderPlayers()}

      {street !== 'showdown' && !userHasActed && (
        <div className="mt-6">
          <h3 className="text-lg mb-2">Your Action</h3>
          <div className="flex gap-4">
            <button onClick={handleUserAction} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white">Check</button>
            <button onClick={handleUserAction} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white">Bet Pot</button>
          </div>
        </div>
      )}

      {street === 'showdown' && (
        <div className="mt-6 text-lg text-center space-y-2">
          <p className="font-bold text-xl">🏁 Showdown!</p>
          <p>{mockResults.board1}</p>
          <p>{mockResults.board2}</p>
        </div>
      )}
    </div>
  );
}
