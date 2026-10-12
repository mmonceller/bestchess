/*
 * One short drill per Pattern Trainer focus. Positions are quiet enough that the
 * scripted move is the clear win. Talk steps name the Lichess practice ideas we
 * don't teach as their own lesson (overloaded pieces, x-ray, underpromotion).
 */
const quiz = (question, correct, why, wrongs) => ({
  type: 'quiz',
  question,
  options: [
    { text: correct, correct: true, why },
    ...wrongs.map(([text, w]) => ({ text, why: w })),
  ],
});

export const DRILLS = {
  hanging: {
    habit: 'Ask who defends it before you take it.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/8/8/r7/8/8/3Q4/4K3 w - - 0 1',
        arrows: [['d2', 'a5']],
        text: 'A free piece has nobody guarding it. Count the defenders first. If a piece is doing two jobs at once, it is overloaded — capture one of the things it was holding, or take the piece itself.',
      },
      {
        type: 'move',
        fen: '4k3/8/8/r7/8/8/3Q4/4K3 w - - 0 1',
        prompt: 'The rook on a5 has no defender. Take it.',
        line: ['d2a5'],
        hint: 'Your queen on d2 can reach a5.',
        success: 'Nothing protected that rook. Free pieces come first.',
      },
      quiz(
        'A knight is the only piece defending both a rook and a pawn. What is that knight?',
        'Overloaded — it can\'t save both',
        'One defender with two jobs will lose one of them. That is the overloaded-piece idea.',
        [
          ['Pinned, so it can\'t move', 'A pin is a line through to a bigger piece. Two jobs for one defender is an overload.'],
          ['Safe, because it defends both', 'It can only recapture once. The other piece is then free.'],
        ],
      ),
    ],
  },
  ownLoose: {
    habit: 'Before a clever move, check which of your pieces can be taken for free.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/8/2n5/1p6/3Q4/8/8/4K3 w - - 0 1',
        arrows: [['c6', 'd4']],
        text: 'Puzzles put the loose piece on the other side, ready to take. In a game the loose piece is often yours. Their knight on c6 attacks your queen, and the pawn on b5 defends that knight, so you cannot just grab it. Save your queen before you look for anything else.',
      },
      {
        type: 'move',
        fen: '4k3/8/2n5/1p6/3Q4/8/8/4K3 w - - 0 1',
        prompt: 'Your queen is loose. Step it off the knight\'s attack.',
        line: ['d4d5'],
        hint: 'Move the queen from d4 to d5.',
        success: 'The queen is safe, and it still eyes their knight. A hanging piece of yours comes before any tactic.',
      },
      quiz(
        'You see a fork, and one of your pieces is hanging. What do you play first?',
        'The move that saves your hanging piece',
        'A fork does not help if they take your queen for free on the next move.',
        [
          ['The fork — it wins material', 'Only if your own piece is safe. Check that before you attack.'],
          ['A developing move', 'Development waits. A piece that can be taken for free does not.'],
        ],
      ),
    ],
  },
  fork: {
    habit: 'Name two targets, then look for one move that hits both.',
    steps: [
      {
        type: 'talk',
        fen: '4k1r1/8/8/3N4/8/8/8/4K3 w - - 0 1',
        text: 'A fork is one move with two threats. Before you calculate a long line, name the enemy king and one loose piece. If a knight can touch both, that is the move.',
      },
      {
        type: 'move',
        fen: '4k1r1/8/8/3N4/8/8/8/4K3 w - - 0 1',
        prompt: 'Fork the king on e8 and the rook on g8.',
        line: ['d5f6'],
        hint: 'The knight on d5 can jump to f6.',
        success: 'Check and an attack on the rook. They can only save one.',
      },
      quiz(
        'You see a check and a capture that don\'t work. What do you look for next?',
        'A move that attacks two things at once',
        'If the forcing moves fail one at a time, a fork can threaten both together.',
        [
          ['A quiet pawn move on the other wing', 'Look for two targets first. A quiet wing pawn is the last place to search.'],
          ['Trading your last piece', 'A trade is fine when you are ahead. It doesn\'t find a fork.'],
        ],
      ),
    ],
  },
  pin: {
    habit: 'When a piece can\'t move, attack it again.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/8/2n5/8/B7/8/8/2Q1K3 w - - 0 1',
        arrows: [['a4', 'e8']],
        text: 'The bishop on a4 pins the knight to the king, so the knight can\'t step away. A pinned piece can still be captured. Add another attacker.',
      },
      {
        type: 'move',
        fen: '4k3/8/2n5/8/B7/8/8/2Q1K3 w - - 0 1',
        prompt: 'The knight is pinned to the king. Win it.',
        line: ['c1c6'],
        hint: 'Slide the queen up the c-file.',
        success: 'The pin held the knight in place, and the queen took it.',
      },
      quiz(
        'A piece is pinned. Which move most often wins it?',
        'Attack it with something less valuable, like a pawn',
        'The pinned piece can\'t run. Another attacker, especially a pawn, piles on.',
        [
          ['Ignore it and castle', 'A pin is a target. Use it before it gets a defender.'],
          ['Trade the piece that is doing the pinning', 'If you trade the pinner, the pin is gone and the piece can move again.'],
        ],
      ),
    ],
  },
  skewer: {
    habit: 'Attack the big piece first when a smaller one stands behind it.',
    steps: [
      {
        type: 'talk',
        fen: '3q4/8/8/3k4/8/8/5PK1/7R w - - 0 1',
        text: 'A skewer is a pin turned around. Check the more valuable piece. When it steps off the line, the piece behind it is yours. Only queens, rooks and bishops can do this.',
      },
      {
        type: 'move',
        fen: '3q4/8/8/3k4/8/8/5PK1/7R w - - 0 1',
        prompt: 'The king and queen share the d-file. Skewer them.',
        line: ['h1d1'],
        hint: 'Check along the d-file from h1.',
        success: 'The king has to leave the file, and the queen behind it falls.',
      },
      quiz(
        'How is a skewer different from a pin?',
        'The more valuable piece is in front, so it has to move',
        'A pin freezes the front piece. A skewer forces the front piece to move and uncovers the one behind.',
        [
          ['A skewer only works with a knight', 'Knights jump, so they can\'t line two pieces up. Skewers need a slider.'],
          ['There is no difference', 'Same line, opposite order. That changes who has to move.'],
        ],
      ),
    ],
  },
  discovered: {
    habit: 'Look for your own piece blocking a rook, bishop or queen.',
    steps: [
      {
        type: 'talk',
        fen: '8/2k3q1/8/8/3N4/8/1B6/4K3 w - - 0 1',
        arrows: [['b2', 'g7']],
        text: 'A discovered attack moves one of your pieces off a line so the piece behind it strikes. An x-ray is different: you attack through an enemy piece, and when that piece moves you hit what was behind it. Here the knight is in the bishop\'s way — get it out with check.',
      },
      {
        type: 'move',
        fen: '8/2k3q1/8/8/3N4/8/1B6/4K3 w - - 0 1',
        prompt: 'Move the knight with check so the bishop attacks the queen.',
        line: ['d4e6'],
        hint: 'The knight on d4 can jump to e6, checking the king.',
        success: 'They had to answer the check, so the queen was lost to the bishop.',
      },
      quiz(
        'What is an x-ray, compared with a discovered attack?',
        'An attack through an enemy piece, revealed when they move',
        'Discovery steps off your own piece. An x-ray looks through their piece to the target behind it.',
        [
          ['Two checks at the same time', 'Two checks at once is a double check, a kind of discovery.'],
          ['A knight fork', 'A fork is one piece attacking two targets. An x-ray is a line through a piece.'],
        ],
      ),
    ],
  },
  doubleCheck: {
    habit: 'Against two checks, only a king move is legal.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/8/8/8/q3B3/8/8/4R1K1 w - - 0 1',
        text: 'Double check means the piece you move gives check and uncovers a second check. They cannot block both and they cannot capture both. The king has to move, so you can take whatever you were also attacking.',
      },
      {
        type: 'move',
        fen: '4k3/8/8/8/q3B3/8/8/4R1K1 w - - 0 1',
        prompt: 'Move the bishop so it checks and uncovers the rook. The queen will be loose.',
        line: ['e4c6'],
        hint: 'The bishop on e4 can step to c6.',
        success: 'Two checks. The king must move, and the queen on a4 is lost.',
      },
      quiz(
        'Your opponent plays a double check. What is legal?',
        'Only moving your king',
        'A block or a capture can answer one check. The other check is still there.',
        [
          ['Capture the piece that just moved', 'If you capture it, the uncovered piece is still checking you.'],
          ['Block one of the checks', 'The other check remains. The king has to step out of both.'],
        ],
      ),
    ],
  },
  removeDefender: {
    habit: 'Find the one piece holding the position together, and take it.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/8/5n2/3r2B1/8/8/Q7/4K3 w - - 0 1',
        text: 'The rook on d5 looks safe because the knight on f6 defends it. Take the knight first. That is removing the defender — the same idea as an overloaded piece that was doing one job too many.',
      },
      {
        type: 'move',
        fen: '4k3/8/5n2/3r2B1/8/8/Q7/4K3 w - - 0 1',
        prompt: 'The knight is the only defender of the rook. Remove it.',
        line: ['g5f6'],
        hint: 'Your bishop on g5 can take on f6.',
        success: 'The guard is gone. The rook on d5 is next.',
      },
      quiz(
        'You want a rook, and one knight is its only defender. What is the idea?',
        'Capture the knight, then take the rook',
        'Remove the defender first. Taking the rook while the knight still guards it just loses your piece.',
        [
          ['Take the rook right away', 'The knight recaptures. You gave up a bigger piece for the rook.'],
          ['Wait for them to move the knight away', 'They won\'t, unless you make them. Take the defender yourself.'],
        ],
      ),
    ],
  },
  promotion: {
    habit: 'When a pawn can queen, check whether a queen would stalemate.',
    steps: [
      {
        type: 'talk',
        fen: '4k3/2P5/8/8/8/8/8/4K3 w - - 0 1',
        text: 'A pawn on the last rank is a queen almost every time. Look once before you choose: if a queen would leave the king with no move and not in check, that is stalemate. A rook or a knight can be the move that still mates. That choice is called underpromotion.',
      },
      {
        type: 'move',
        fen: '4k3/2P5/8/8/8/8/8/4K3 w - - 0 1',
        prompt: 'The pawn on c7 can reach the last rank. Promote it.',
        line: ['c7c8q'],
        hint: 'Push the pawn to c8 and make a queen.',
        success: 'The queen is on the board. When a queen would stalemate, you would pick a rook or knight instead.',
      },
      quiz(
        'Promoting to a queen would stalemate the enemy king. What do you do?',
        'Promote to a rook or knight if that still wins',
        'Underpromotion keeps the win when a queen would end the game as a draw.',
        [
          ['Promote to a queen anyway', 'Stalemate is a draw. The queen never gets to move.'],
          ['Leave the pawn where it is', 'The pawn is the win. Change what it becomes, don\'t refuse the move.'],
        ],
      ),
    ],
  },
  checkmate: {
    habit: 'Look at every check before any capture.',
    steps: [
      {
        type: 'talk',
        fen: '6k1/4Q3/6K1/8/8/8/8/8 w - - 0 1',
        text: 'When puzzles keep failing, the miss is often the first look: not every check, only the captures. A check that covers every flight square ends the game. Do that search before you hunt material.',
      },
      {
        type: 'move',
        fen: '6k1/4Q3/6K1/8/8/8/8/8 w - - 0 1',
        prompt: 'White to move. Find the checkmate.',
        line: ['e7g7'],
        hint: 'Your king on g6 already watches the squares around the enemy king. Use the queen.',
        success: 'The queen is protected by your king, and the enemy king has no square.',
      },
      quiz(
        'A puzzle says "find the mate." What do you list first?',
        'Every check',
        'Mate is a check. Captures and quiet moves come after the checks have been tried.',
        [
          ['Every pawn move', 'Pawn moves matter in quiet positions. They are not the first list in a mate puzzle.'],
          ['How to trade queens', 'Trading is for when you are ahead and safe. It doesn\'t find a mate.'],
        ],
      ),
    ],
  },
  backRank: {
    habit: 'If their king is stuck behind its own pawns, look for the back row.',
    steps: [
      {
        type: 'talk',
        fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
        arrows: [['e1', 'e8']],
        text: 'The king on g8 has its own pawns on f7, g7 and h7. It cannot step down. A rook or queen on the back row is mate.',
      },
      {
        type: 'move',
        fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
        prompt: 'The king is boxed in by its own pawns. Mate on the back rank.',
        line: ['e1e8'],
        hint: 'Slide the rook to e8.',
        success: 'Back-rank mate. The pawns were the cage.',
      },
      quiz(
        'What makes a back-rank mate possible?',
        'The king has no flight square off the last row',
        'Its own pawns, or enemy pieces, take away the step forward. Then one heavy piece mates.',
        [
          ['The king is in the center', 'A king in the center has many squares. Back-rank mate needs it stuck on the edge row.'],
          ['You still have all eight pawns', 'Your pawn count doesn\'t matter. Their king\'s cage does.'],
        ],
      ),
    ],
  },
  smothered: {
    habit: 'When the king is buried in its own pieces, look for a knight.',
    steps: [
      {
        type: 'talk',
        fen: '6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1',
        text: 'A smothered mate is a knight check when every square around the king is filled by its own pieces. Nothing else can jump in. Don\'t look for a queen here — the queen can\'t leap the crowd.',
      },
      {
        type: 'move',
        fen: '6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1',
        prompt: 'The king on h8 is boxed in by its own rook and pawns. Mate with the knight.',
        line: ['e5f7'],
        hint: 'Jump the knight to f7.',
        success: 'The knight checks, and the king\'s own pieces take away every escape.',
      },
      quiz(
        'Which piece delivers a smothered mate?',
        'A knight',
        'Only a knight can attack a king that is walled in by its own pieces.',
        [
          ['A queen on the back rank', 'That is a back-rank mate. A smothered king has no room for a sliding piece to land beside it.'],
          ['A pawn', 'A pawn can support a mate. It doesn\'t jump into a crowded corner.'],
        ],
      ),
    ],
  },
  scholar: {
    habit: 'f7 and f2 are weak at the start. Queen and bishop both want that square.',
    steps: [
      {
        type: 'talk',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
        arrows: [['c4', 'f7'], ['h5', 'f7']],
        text: 'Scholar\'s Mate is the picture of queen and bishop on f7 (or f2 for Black). The king is the only defender of that pawn at the start. If both attackers are aimed there, look at the capture.',
      },
      {
        type: 'move',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
        prompt: 'Queen and bishop both attack f7. Finish the mate.',
        line: ['h5f7'],
        hint: 'The queen on h5 takes on f7, and the bishop protects her.',
        success: 'That is Scholar\'s Mate. The bishop on c4 guards the queen.',
      },
      quiz(
        'Why is f7 a target in the opening?',
        'Only the king defends it at the start',
        'Queen and bishop together can overload that one defender.',
        [
          ['It is the only pawn that can move two squares', 'Every pawn can move two squares on its first move. f7 is weak because of who guards it.'],
          ['The queen starts on f7', 'The queen starts on d8 or d1. f7 is a pawn square.'],
        ],
      ),
    ],
  },
};

/* Named mates without their own drill use the general checkmate drill. */
export const drillFor = (id) => DRILLS[id] || DRILLS.checkmate;
