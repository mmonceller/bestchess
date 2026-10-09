/* Bonus rounds for Level Up. */
export const advancedBonus = {
  'a-desperado': [
    {
      type: 'talk',
      text: 'Going deeper: desperado ideas often appear in the middle of trades. If pieces are hanging for both sides, the player to move should grab the most valuable thing first. Before recapturing automatically, count what\'s attacked on BOTH sides.',
    },
    {
      type: 'move',
      fen: '3q2k1/5ppp/8/8/8/3B4/5PPP/3R2K1 w - - 0 1',
      prompt: 'Your bishop blocks your own rook. Let it go out with a bang — and uncover an attack on the queen.',
      line: ['d3h7', 'g8h7', 'd1d8'],
      hint: 'The bishop can capture with check. Once it moves, what does the rook on d1 see?',
      success: 'The bishop gave itself up with check, and the rook won the queen. A bishop for a queen!',
    },
    {
      type: 'quiz',
      question: 'Pieces are being traded. Before recapturing, what should you check?',
      options: [
        { text: 'Whether a check or a bigger threat comes first', correct: true, why: 'An in-between move can win more — and the recapture is usually still there afterwards.' },
        { text: 'Nothing — always recapture immediately', why: 'Automatic recaptures miss in-between moves.' },
        { text: 'How much time is left', why: 'Time matters, but the position comes first.' },
      ],
    },
  ],

  'a-lucena': [
    {
      type: 'recap',
      title: 'Lucena, step by step',
      numbered: true,
      text: 'Going deeper: the full winning method in the right order.',
      items: [
        { title: 'Cut the enemy king off', text: 'Put your rook on a column between the enemy king and your pawn.' },
        { title: 'Rook to the 4th row', text: 'Prepare the bridge before the king walks out.' },
        { title: 'King steps out', text: 'Walk out from in front of the pawn, toward the enemy king\'s side or away from it.' },
        { title: 'Block with the rook', text: 'When the checks run out of room, your rook blocks the last check — the bridge.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Why must the enemy king be cut off before you start?',
      options: [
        { text: 'Otherwise it walks over and blocks the pawn', correct: true, why: 'With the defending king in front of the pawn, it\'s usually a draw.' },
        { text: 'So it can\'t give checks', why: 'Kings can\'t give check. The rook gives the checks.' },
        { text: 'It\'s required by the rules', why: 'It\'s strategy, not a rule.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Your pawn is on the 7th row. Which row does your rook go to for the bridge?',
      options: [
        { text: 'The 4th row', correct: true, why: 'From there, the rook can block checks at the right moment once the king steps out.' },
        { text: 'The 8th row', why: 'That\'s where the pawn promotes. The rook needs to block checks lower down.' },
        { text: 'The 1st row', why: 'Too far away to block checks near your king.' },
      ],
    },
  ],

  'a-philidor': [
    {
      type: 'talk',
      text: 'Going deeper: Philidor has two stages. Keep your rook on the third row (the 6th row from White\'s side) to stop the enemy king coming forward. The moment the pawn steps onto that row, drop the rook all the way back and check from behind — the enemy king has no shelter left.',
    },
    {
      type: 'quiz',
      question: 'When do you switch from the third-row wall to checking from behind?',
      options: [
        { text: 'As soon as the pawn moves onto the third row', correct: true, why: 'Once the pawn has advanced, it can no longer shield its king from checks.' },
        { text: 'Right from the first move', why: 'Checking from behind too early lets the enemy king come forward.' },
        { text: 'Never — keep the rook on the third row', why: 'Once the pawn arrives, the wall no longer works. Switch to checks.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Where should the defending king stand in the Philidor position?',
      options: [
        { text: 'On or next to the square in front of the pawn', correct: true, why: 'The king blocks the pawn while the rook does the checking.' },
        { text: 'As far from the pawn as possible', why: 'A distant king can\'t stop the pawn.' },
        { text: 'Behind the pawn', why: 'From behind, the king can\'t block it.' },
      ],
    },
  ],

  'a-chain-base': [
    {
      type: 'talk',
      fen: 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 4',
      arrows: [['c5', 'd4'], ['c6', 'd4']],
      text: 'Going deeper: attack a pawn chain at its base — the pawn at the back that no other pawn protects. In this French Defence, Black hits d4 with ...c5, ...Nc6 and often ...Qb6. If the base falls, the pawn in front of it becomes weak.',
    },
    {
      type: 'quiz',
      question: 'White pawns on d4 and e5 form a chain. Where is its base?',
      options: [
        { text: 'd4', correct: true, why: 'd4 protects e5, but nothing protects d4.' },
        { text: 'e5', why: 'e5 is the head of the chain — it\'s protected by d4.' },
        { text: 'There is no base', why: 'Every chain has a back pawn that isn\'t protected by another pawn.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Which black pawn move hits the base of White\'s d4–e5 chain?',
      options: [
        { text: '...c5', correct: true, why: 'The c-pawn attacks d4 directly.' },
        { text: '...f6', why: 'That attacks the head (e5). It\'s a real plan too, but it doesn\'t hit the base.' },
        { text: '...h6', why: 'That doesn\'t touch the chain at all.' },
      ],
    },
  ],

  'a-practical': [
    {
      type: 'talk',
      text: 'Going deeper: the clock is part of the position. When losing, choose moves that demand precise answers — especially when your opponent is short of time. When winning, do the opposite: pick the simplest safe line, even if it isn\'t the fastest.',
    },
    {
      type: 'quiz',
      question: 'You\'re winning easily but have very little time left. What\'s the best approach?',
      options: [
        { text: 'Play safe, simple moves and trade pieces', correct: true, why: 'Simple positions need less thought, so you\'re less likely to blunder.' },
        { text: 'Look for the most spectacular finish', why: 'Brilliance costs time. Safe and simple wins on the clock too.' },
        { text: 'Offer a draw', why: 'You\'re winning. Simplify instead.' },
      ],
    },
    {
      type: 'quiz',
      question: 'You\'re lost, and your opponent has 30 seconds left. Which kind of move gives you the best chances?',
      options: [
        { text: 'A move that sets a trap or creates a threat they must answer', correct: true, why: 'Under time pressure, people miss traps. Give them problems to solve.' },
        { text: 'The quietest, safest move', why: 'Quiet moves give your opponent an easy time.' },
        { text: 'Resign to save time', why: 'Lost games get saved all the time when the clock is ticking.' },
      ],
    },
  ],
};
