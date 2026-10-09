export const woodpeckerWay = {
  id: 't-woodpecker-way',
  track: 'tactics',
  title: 'How to Solve a Woodpecker Puzzle',
  coach: 'rook',
  summary: 'A step-by-step way to look at a puzzle, including the quiet moves that are easy to miss.',
  minutes: 5,
  steps: [
    {
      type: 'recap',
      numbered: true,
      title: 'Before you touch a piece',
      items: [
        { title: 'Find the targets', text: 'Look for loose pieces, an unsafe king, and pieces lined up on the same row, file or diagonal.' },
        { title: 'List the forcing moves', text: 'Every check, every capture, every threat — for both sides.' },
        { title: 'Look for a pattern', text: 'Fork, pin, skewer, discovered attack, remove the defender, decoy, back rank, smothered mate.' },
        { title: 'Calculate to the end', text: 'Follow the line until the position is quiet, and check your opponent\'s best reply each time.' },
      ],
    },
    {
      type: 'talk',
      text: 'Not every solution starts with a check or a capture. About a third of the Woodpecker puzzles start with a QUIET move: it threatens something so strong that your opponent can\'t stop it. If none of the forcing moves work, ask: "Which move creates a threat they can\'t answer?"',
    },
    {
      type: 'move',
      fen: 'rr4k1/pp3p1p/5Bp1/8/8/8/3Q1PPP/6K1 w - - 0 1',
      prompt: 'No check works yet. Find the quiet move that threatens mate — Black can\'t stop it.',
      line: ['d2h6', 'a7a6', 'h6g7'],
      hint: 'Your bishop on f6 already guards g7. Bring the queen next to it.',
      success: 'A quiet move, then checkmate. Black had no way to cover g7.',
    },
    {
      type: 'quiz',
      question: 'The Woodpecker Method asks you to solve the same puzzles again and again, faster each time. Why?',
      options: [
        { text: 'So the patterns become automatic and you spot them in your own games', correct: true, why: 'Repetition moves patterns from "I have to work it out" to "I just see it" — which is exactly what you need with the clock running.' },
        { text: 'To memorise the exact positions for tournaments', why: 'The same positions almost never appear again. It\'s the patterns that repeat.' },
        { text: 'Because speed matters more than being right', why: 'Accuracy comes first. Speed comes naturally once the patterns stick.' },
      ],
    },
    {
      type: 'quiz',
      question: 'You see a sacrifice that looks great, but you\'re not sure. What now?',
      options: [
        { text: 'Check each forced reply until the position is calm, then decide', correct: true, why: 'Calculation means following the line to the end. If every reply loses for them, play it.' },
        { text: 'Play it fast — sacrifices always work in puzzles', why: 'Puzzles reward the right idea, and the right idea has to survive the best defence.' },
        { text: 'Skip it and play a safe move', why: 'Safe moves miss the point of the puzzle. Calculate first, then decide.' },
      ],
    },
  ],
};
