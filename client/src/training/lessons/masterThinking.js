/*
 * More Master Class lessons on how strong players think: the tree of analysis,
 * candidate moves, blunder-proofing and planning. Concepts follow Alexander Kotov's
 * Think Like a Grandmaster; text and positions are original.
 */
export const masterThinkingLessons = [
  {
    id: 'm-tree',
    track: 'master',
    title: 'The Tree of Analysis',
    coach: 'lin',
    summary: 'List every candidate move first, then examine each branch once.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'Picture your calculation as a tree. The trunk is the current position; each candidate move is a branch, and the replies are smaller branches. Many players climb the first branch they see, jump to another, then back again — wasting time and missing moves.',
      },
      {
        type: 'recap',
        title: 'Calculating like a grandmaster',
        numbered: true,
        text: 'A disciplined method:',
        items: [
          { title: 'List all candidates first', text: 'Before analysing anything, name every reasonable move — checks, captures and threats first.' },
          { title: 'One branch at a time', text: 'Work through each candidate fully, then move on. Don\'t hop back and forth.' },
          { title: 'Examine each branch once', text: 'Trust your analysis. Re-checking the same line again and again eats your clock.' },
          { title: 'Compare and choose', text: 'Judge the final positions of each branch and pick the best.' },
        ],
      },
      {
        type: 'move',
        fen: 'r3k3/7p/8/8/8/8/2Q4P/4K3 w - - 0 1',
        prompt: 'List your checks first: there are several. Which one also attacks something else?',
        line: ['c2e4', 'e8d8', 'e4a8'],
        accept: { 0: ['c2e4', 'c2c6'] },
        wrong: { c2c8: 'Check — but the rook on a8 simply takes your queen. That branch ends badly.' },
        hint: 'The black rook on a8 is undefended. Find a check on a square that also eyes a8.',
        success: 'By listing every check first, you found the one that forks king and rook.',
      },
      {
        type: 'quiz',
        question: 'What\'s the most common mistake when choosing candidate moves?',
        options: [
          { text: 'Missing a candidate altogether — often the one that wins or saves the game', correct: true, why: 'You can\'t analyse a move you never considered. That\'s why the list comes first.' },
          { text: 'Considering too many checks', why: 'Checks are quick to look at and often decisive. Always include them.' },
          { text: 'Writing the move down', why: 'Writing it down before playing is actually a good habit.' },
        ],
      },
      {
        type: 'move',
        fen: '3r2k1/5ppp/8/8/8/8/3Q1PPP/3R2K1 w - - 0 1',
        prompt: 'Captures are candidates too. Which capture ends the game?',
        line: ['d2d8'],
        hint: 'Your queen and rook line up on the d-file. What happens if you capture on d8?',
        success: 'Checkmate! The rook backs up the queen, and the king is trapped behind its own pawns.',
      },
      {
        type: 'quiz',
        question: 'Some lines have just one forced move after another — a "bare trunk". Others branch everywhere. How should you treat them?',
        options: [
          { text: 'Follow forced lines deeply; in branching lines, look less deep and use judgement', correct: true, why: 'Forcing lines are cheap to calculate. Wide trees need positional judgement to prune them.' },
          { text: 'Calculate every line to the same depth', why: 'Impossible in branching positions — you\'d run out of time.' },
          { text: 'Never calculate more than two moves', why: 'Forced lines can and should be followed to the end.' },
        ],
      },
    ],
  },
  {
    id: 'm-blunders',
    track: 'master',
    title: 'Why Good Players Blunder',
    coach: 'elena',
    summary: 'Overconfidence, autopilot and blind spots — and the rule that stops them.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'Even grandmasters drop pieces. The causes are surprisingly human. Knowing them is the first step to beating them.',
      },
      {
        type: 'recap',
        title: 'Three causes of blunders',
        items: [
          { label: '1', title: 'Dizzy with success', text: 'When a win seems near, attention relaxes — and a simple counter-threat gets missed.' },
          { label: '2', title: 'Autopilot reflexes', text: 'We assume something "can\'t happen" because it rarely does, like a piece checking from an unusual square.' },
          { label: '3', title: 'Blind spots', text: 'Long backward moves, and pieces that just moved, are easy to overlook.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You\'re completely winning. When is the danger of blundering highest?',
        options: [
          { text: 'Right now — when you feel the game is already won', correct: true, why: 'Overconfidence switches off your sense of danger. Stay alert until the very end.' },
          { text: 'Only when the position is complicated', why: 'Blunders happen in easy positions too, because we stop paying attention.' },
          { text: 'Never — winning positions are safe', why: 'Many winning positions have been thrown away by relaxing too early.' },
        ],
      },
      {
        type: 'talk',
        text: 'A famous antidote is Blumenfeld\'s rule. After you\'ve finished calculating, write your move down (or decide it firmly). Then look at the board one more time through the eyes of a beginner: Is anything of mine hanging? Can they give a check? Is there a simple threat I\'ve missed?',
      },
      {
        type: 'quiz',
        question: 'Why look at the position "through the eyes of a beginner" before moving?',
        options: [
          { text: 'Deep calculation can hide simple one-move threats right in front of you', correct: true, why: 'After looking far ahead, the mind forgets the here-and-now. A quick simple check fixes that.' },
          { text: 'Beginners play better moves', why: 'No — but they notice obvious threats because they don\'t look too far ahead.' },
          { text: 'To save time', why: 'It costs a little time, but it saves games.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your opponent\'s piece just moved. Which squares are you most likely to overlook?',
        options: [
          { text: 'Squares it can reach by moving backwards', correct: true, why: 'Our eyes naturally look forwards. Backward moves are a classic blind spot.' },
          { text: 'Squares right in front of it', why: 'Those are the ones we usually see.' },
          { text: 'Squares on the edge', why: 'Possible, but backward moves are the more common blind spot.' },
        ],
      },
    ],
  },
  {
    id: 'm-creeping',
    track: 'master',
    title: 'Quiet Moves That Kill',
    coach: 'viktor',
    summary: 'Creeping moves, when not to calculate, and handling the clock.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Not every winning move is a sacrifice. Sometimes the strongest move is a tiny one — a queen sliding one square, a king stepping aside — that quietly takes away the opponent\'s last good options. These "creeping moves" are hard to find precisely because they look so modest.',
      },
      {
        type: 'quiz',
        question: 'Your opponent is defending well and there\'s no combination. What kind of move should you look for?',
        options: [
          { text: 'A quiet improving move that leaves them with no useful moves', correct: true, why: 'When forcing moves don\'t work, squeeze. Opponents often collapse when they run out of good moves.' },
          { text: 'A sacrifice anyway — fortune favours the brave', why: 'An unsound sacrifice gives away your advantage.' },
          { text: 'Offer a draw', why: 'You\'re better. Keep improving.' },
        ],
      },
      {
        type: 'talk',
        text: 'Should you always calculate everything? No. If a position is calm, judgement is often enough — save your clock for the sharp moments. And sometimes a good practical player avoids a complicated win if a simple, safe move keeps a clear advantage.',
      },
      {
        type: 'quiz',
        question: 'You have a safe move that keeps a clear advantage, or a complicated line that might win faster. You\'re short of time. What\'s wise?',
        options: [
          { text: 'Play the safe move', correct: true, why: 'Avoiding unnecessary risk in time trouble is a grandmaster skill, not cowardice.' },
          { text: 'Go for the complications — they\'re more fun', why: 'Complications plus time pressure is how advantages get thrown away.' },
          { text: 'Spend all your remaining time deciding', why: 'Then you\'ll lose on time. Decide efficiently.' },
        ],
      },
      {
        type: 'quiz',
        question: 'What\'s the best way to avoid time trouble?',
        options: [
          { text: 'Make quick decisions in calm positions and don\'t re-analyse lines you\'ve already checked', correct: true, why: 'Most wasted time comes from indecision and going over the same lines again.' },
          { text: 'Play the opening as slowly as possible', why: 'Spending too long early is a common route into time trouble.' },
          { text: 'Never think for more than 10 seconds', why: 'Critical positions deserve real thought. Budget time for them.' },
        ],
      },
    ],
  },
  {
    id: 'm-plans',
    track: 'master',
    title: 'Judge the Position, Then Plan',
    coach: 'mira',
    summary: 'The elements that decide a position, and how the centre shapes your plan.',
    minutes: 6,
    steps: [
      {
        type: 'recap',
        title: 'What decides a position',
        text: 'To judge a position, check these elements for both sides:',
        items: [
          { label: 'Lines', title: 'Open files and diagonals', text: 'Who can use them, and who will control them?' },
          { label: 'Pawns', title: 'Pawn structure', text: 'Weak squares, passed pawns, pawn islands and weak colour complexes.' },
          { label: 'Pieces', title: 'Piece placement', text: 'Active or passive? Is any piece out of play?' },
          { label: 'Centre', title: 'Space and the centre', text: 'Who controls it, and what kind of centre is it?' },
        ],
      },
      {
        type: 'quiz',
        question: 'Fewer pawn islands are usually better. Why?',
        options: [
          { text: 'Each island has its own weak edges — fewer islands means fewer pawns that need defending', correct: true, why: 'Pawns in one connected group protect each other.' },
          { text: 'Islands can\'t be attacked', why: 'Isolated islands are often the easiest targets.' },
          { text: 'It doesn\'t matter', why: 'It matters a lot, especially in endgames.' },
        ],
      },
      {
        type: 'talk',
        text: 'The centre shapes your plan. Closed centre (pawns locked): play on the wings with pawn advances. Open centre: piece activity and tactics rule. Mobile centre: the side with the pawns tries to advance them. Fixed centre: fight for the key squares around it. Tension in the centre: timing decides who releases it.',
      },
      {
        type: 'quiz',
        question: 'The centre is completely locked by pawns. Where should play happen?',
        options: [
          { text: 'On the wings — usually pawn advances toward the side where your pawns point', correct: true, why: 'With the centre blocked, kings are safer and flank pawn storms become possible.' },
          { text: 'In the centre, with piece sacrifices', why: 'A locked centre is hard to break. Play goes elsewhere.' },
          { text: 'Nowhere — it\'s a draw', why: 'Locked centres often lead to sharp play on the wings.' },
        ],
      },
      {
        type: 'quiz',
        question: 'The centre is wide open. What matters most?',
        options: [
          { text: 'Piece activity, development and king safety', correct: true, why: 'With open lines, active pieces and tactics decide quickly.' },
          { text: 'Slow pawn storms on the wing', why: 'Too slow — open centres reward quick piece play.' },
          { text: 'Keeping the king in the centre', why: 'An open centre is dangerous for an uncastled king.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You\'ve made a plan, but your opponent\'s last move changed the position. What now?',
        options: [
          { text: 'Re-judge the position and adapt the plan if needed', correct: true, why: 'Follow one clear plan, but stay flexible when the position changes.' },
          { text: 'Stick to the original plan no matter what', why: 'A plan that no longer fits the position is worse than no plan.' },
          { text: 'Switch to a completely new plan every move', why: 'Planless chopping and changing is punished too.' },
        ],
      },
    ],
  },
];
