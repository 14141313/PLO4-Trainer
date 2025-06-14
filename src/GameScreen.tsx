import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const positions = ['SB', 'BB', 'EP', 'MP', 'HJ', 'CO'];

const generateDeck = (): string[] => {
  const deck: string[] = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

const drawCards = (deck: string[], count: number): [string[], string[]] => {
  const hand: string[] = [];
  while (hand.length < count && deck.length > 0) {
    const index = Math.floor(Math.random() * deck.length);
    hand.push(deck[index]);
    deck.splice(index, 1);
  }
  return [hand, deck];
};

type Street = 'flop' | 'turn' | 'river' | 'showdown';

type Player = {
  position: string;
  cards: string[];
  hasFolded: boolean;
};

export default function GameScreen({ position }: { position: string }) {
  const [deck, setDeck] = useState(generateDeck());
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [street, setStreet] = useState<Street>('flop');
  const [players, setPlayers] = useState<Player[]>([]);
  const [userHasActed, setUserHasActed] = useState(false);

  useEffect(() => {
    let newDeck = generateDeck();
    const [userCards, d1] = drawCards([...newDeck], 4);
    newDeck = d1;

    const bots: Player[] = positions.filter((p) => p !== position).map((pos) => {
      const [cards, d] = drawCards(newDeck, 4);
      newDeck = d;
      return { position: pos, cards, hasFolded: false };
    });

    const [b1, d2] = drawCards(newDeck, 5);
    const [b2, d3] = drawCards(d2, 5);

    setHoleCards(userCards);
    setDeck(d3);
    setBoard1(b1);
    setBoard2(b2);
    setPlayers(bots);
  }, []);

  const handleUserAction = (action: 'check' | 'bet') => {
    setUserHasActed(true);
    if (action === 'bet') {
      const updatedPlayers = players.map((p) => {
        if (Math.random() < 0.3) {
          return { ...p, hasFolded: true };
        }
        return p;
      });
      setPlayers(updatedPlayers);
    }
  };

  useEffect(() => {
    if (userHasActed && street !== 'showdown') {
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
              onClick={() => handleUserAction('check')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
            >
              Check
            </button>
            <button
              onClick={() => handleUserAction('bet')}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white"
            >
              Bet Pot
            </button>
          </div>
        </div>
      )}

      {street !== 'flop' && (
        <div className="mt-6 text-lg">
          <p>Players Remaining: {players.filter((p) => !p.hasFolded).length + 1}</p>
          <p>Folded: {players.filter((p) => p.hasFolded).map((p) => p.position).join(', ') || 'None'}</p>
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
