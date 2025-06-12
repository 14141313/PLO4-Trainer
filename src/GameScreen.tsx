import React, { useEffect, useState } from 'react';

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

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

const evaluateHand = (hole: string[], board: string[]): number => {
  return Math.floor(Math.random() * 100); // placeholder strength
};

export default function GameScreen({ position }: { position: string }) {
  const [holeCards, setHoleCards] = useState<string[]>([]);
  const [board1, setBoard1] = useState<string[]>([]);
  const [board2, setBoard2] = useState<string[]>([]);
  const [bots, setBots] = useState<{ cards: string[]; active: boolean }[]>([]);
  const [street, setStreet] = useState<'flop' | 'turn' | 'river' | 'showdown'>('flop');

  useEffect(() => {
    const used = new Set<string>();
    const playerHole = generateUniqueCards(4, used);
    const flop1 = generateUniqueCards(3, used);
    const flop2 = generateUniqueCards(3, used);
    const botArray = Array.from({ length: 5 }, () => ({
      cards: generateUniqueCards(4, used),
      active: true,
    }));

    setHoleCards(playerHole);
    setBoard1(flop1);
    setBoard2(flop2);
    setBots(botArray);
  }, []);

  useEffect(() => {
    if (street === 'flop') {
      setTimeout(() => {
        const updatedBots = bots.map((bot) => ({
          ...bot,
          active: Math.random() > 0.3,
        }));
        setBots(updatedBots);
        setBoard1((prev) => [...prev, ...generateUniqueCards(1, new Set([...prev, ...holeCards]))]);
        setBoard2((prev) => [...prev, ...generateUniqueCards(1, new Set([...prev, ...holeCards]))]);
        setStreet('turn');
      }, 1500);
    } else if (street === 'turn') {
      setTimeout(() => {
        const updatedBots = bots.map((bot) => ({
          ...bot,
          active: bot.active && Math.random() > 0.3,
        }));
        setBots(updatedBots);
        setBoard1((prev) => [...prev, ...generateUniqueCards(1, new Set([...prev, ...holeCards]))]);
        setBoard2((prev) => [...prev, ...generateUniqueCards(1, new Set([...prev, ...holeCards]))]);
        setStreet('river');
      }, 1500);
    } else if (street === 'river') {
      setTimeout(() => {
        const updatedBots = bots.map((bot) => ({
          ...bot,
          active: bot.active && Math.random() > 0.2,
        }));
        setBots(updatedBots);
        setStreet('showdown');
      }, 1500);
    }
  }, [street]);

  const getWinnerText = () => {
    const player1 = evaluateHand(holeCards, board1);
    const player2 = evaluateHand(holeCards, board2);

    const botScores = bots.map((bot) => {
      if (!bot.active) return { b1: -1, b2: -1 };
      return {
        b1: evaluateHand(bot.cards, board1),
        b2: evaluateHand(bot.cards, board2),
      };
    });

    const allScores1 = [player1, ...botScores.map((s) => s.b1)];
    const allScores2 = [player2, ...botScores.map((s) => s.b2)];

    const max1 = Math.max(...allScores1);
    const max2 = Math.max(...allScores2);

    const winners1 = [0, ...botScores.map((s, i) => s.b1 === max1 ? i + 1 : -1).filter((i) => i > 0)];
    const winners2 = [0, ...botScores.map((s, i) => s.b2 === max2 ? i + 1 : -1).filter((i) => i > 0)];

    const renderNames = (winners: number[]) => {
      return winners.map((i) => (i === 0 ? 'You' : `Bot ${i}`)).join(', ');
    };

    return (
      <>
        <p className="mt-4">Board 1 Winner(s): {renderNames(winners1)}</p>
        <p className="mt-1">Board 2 Winner(s): {renderNames(winners2)}</p>
      </>
    );
  };

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
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-4 mb-2 font-semibold">Board 2</h2>
        <div className="flex gap-4 text-2xl">
          {board2.map((card, i) => (
            <span key={i} className="bg-white text-black px-3 py-1 rounded-xl">{card}</span>
          ))}
        </div>
      </div>

      {street === 'showdown' && (
        <>
          <h2 className="text-xl mt-6 font-bold">Showdown</h2>
          <div className="flex flex-col gap-2 items-center">
            <p className="text-lg font-semibold">Your Hand:</p>
            <div className="flex gap-2 text-2xl">
              {holeCards.map((card, i) => (
                <span key={i} className="bg-white text-black px-2 py-1 rounded-md">{card}</span>
              ))}
            </div>
            {bots.map((bot, i) => (
              <div key={i} className="flex flex-col items-center">
                <p className="mt-2 font-medium">Bot {i + 1}:</p>
                {bot.active ? (
                  <div className="flex gap-2 text-2xl">
                    {bot.cards.map((card, j) => (
                      <span key={j} className="bg-white text-black px-2 py-1 rounded-md">{card}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">(Folded)</p>
                )}
              </div>
            ))}
          </div>
          {getWinnerText()}
        </>
      )}
    </div>
  );
}
