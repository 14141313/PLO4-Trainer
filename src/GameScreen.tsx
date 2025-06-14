import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const positions = ['SB', 'BB', 'EP', 'MP', 'HJ', 'CO'];

const createDeck = () => {
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

const shuffle = (deck: string[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const dealCards = (deck: string[], count: number): [string[], string[]] => {
  const dealt = deck.slice(0, count);
  const remaining = deck.slice(count);
  return [dealt, remaining];
};

type Street = 'flop' | 'turn' | 'river' | 'showdown';

export default function GameScreen({ position }: { position: string }) {
  const [deck, setDeck] = useState(shuffle(createDeck()));
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [street, setStreet] = useState<Street>('flop');
  const [activePlayers, setActivePlayers] = useState<string[]>(positions.filter((p) => p !== position));
  const [foldedPlayers, setFoldedPlayers] = useState<string[]>([]);
  const [userHasActed, setUserHasActed] = useState(false);
  const [lastActionWasBet, setLastActionWasBet] = useState(false);

  useEffect(() => {
    // Deal cards on load
    let d = [...deck];
    let cards: string[];
    [cards, d] = dealCards(d, 4);
    setHoleCards(cards);

    [cards, d] = dealCards(d, 5);
    setBoard1(cards);

    [cards, d] = dealCards(d, 5);
    setBoard2(cards);

    setDeck(d);
  }, []);

  const handleUserAction = (action: 'check' | 'bet') => {
    setUserHasActed(true);
    setLastActionWasBet(action === 'bet');
  };

  const simulateBotActions = () => {
    if (!lastActionWasBet) return;

    setActivePlayers((prevActive) => {
      const remaining = [];
      const newFolded = [...foldedPlayers];

      for (let pos of prevActive) {
        if (Math.random() < 0.3) {
          newFolded.push(pos);
        } else {
          remaining.push(pos);
        }
      }

      setFoldedPlayers(newFolded);
      return remaining;
    });
  };

  useEffect(() => {
    if (userHasActed && street !== 'showdown') {
      if (lastActionWasBet) simulateBotActions();

      const delay = 1000;
      setTimeout(() => {
        if (street === 'flop') setStreet('turn');
        else if (street === 'turn') setStreet('river');
        else if (street === 'river') setStreet('showdown');
        setUserHasActed(false);
        setLastActionWasBet(false);
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
