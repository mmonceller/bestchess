# BestChess

BestChess is a browser-based chess app for players of every level. You can play a friend online with a shareable game code, play against a bot at seven difficulty levels, or learn chess through game-like lessons and an adaptive puzzle trainer. The chess engine runs entirely in your browser, so bot games and move hints work without loading the server.

## Features

### Play with an Online Friend
- Create a game and share a short code or link; your friend joins instantly.
- Time controls from 1 to 30 minutes, or untimed games.
- In-game chat, draw offers, resignation and rematches.
- Reconnects you to your seat if your connection drops.
- Extra visitors can watch as spectators.
- No account needed: guests can play under a temporary name.

### Play with a Bot
- Seven difficulty levels, from Pawn Pusher (about 400 rating) to Master (2100+).
- Choose to play as white, black or a random color.
- Undo moves and flip the board.
- AI hint assistant that suggests a move and explains why it works in plain language.
- Hints use the same advice and wording as the lessons (rooks behind passed pawns, the opposition, blockades, outposts, "fix your worst piece", "trade when ahead", and so on).
- For logged-in players, hints link back to a completed lesson that covers the same idea, in that lesson coach's voice. If they haven't taken it yet, the hint suggests a lesson that fits their skill level instead. Coach feedback on a mistake works the same way.
- **Skill badge**: after 5 finished games, each logged-in player gets a tier (Bronze, Silver, Gold, Platinum or Diamond) from the average performance of their last 20 games. A win counts as the opponent's strength + 400, a draw as the opponent's strength, and a loss as opponent − 400 (never more than the player's own wins and draws). The tier colours the ring around their emblem at the top of the page.
- The bot setup pre-selects the level closest to the player's skill and marks it **Recommended**; any other level can still be picked.
- An unfinished game is saved so you can pick it up later.

### Learn Chess
- Open to guests and logged-in players. Guests are told that their progress will not be saved when they leave, and their progress carries over if they log in during the visit.
- Pick a starting point: brand new, knows how the pieces move, or wants to level up.
- Four lesson tracks shown as a lesson map:
  - **First Steps**: the board, how each piece moves and captures, check and checkmate, castling and en passant, reading moves like Nf3, and the top 5 rules for winning games.
  - **Foundations**: simple habits that stop mistakes and win free pieces.
  - **Club Player**: plans, thinking routines and clean technique.
  - **Level Up**: endgames, pawn structures and match psychology.
  - **Strategy Lab**: reading a position through its imbalances, bishops against knights, open files for rooks, weak pawns and holes, space, long-term against short-term advantages, and passed pawns.
  - **Endgame School**: king races and Réti's trick, zugzwang and triangulation, fortresses (wrong bishop, opposite-coloured bishops), queen against a pawn, rook endgame rules, and the big endgame ideas.
- **Master Class**, a final track that appears once every other lesson is finished and unlocks when the player has a Pattern Trainer rating of 1150 or more, has solved 30 puzzles and has won 3 games against the Club Player bot or stronger (or online). Its lessons cover calculation, in-between moves, prophylaxis, endgame technique, tournament play, the tree of variations, why strong players blunder, quiet moves and time trouble, and building a plan.
- The Strategy Lab and the later Master Class lessons draw on ideas from Jeremy Silman's *How to Reassess Your Chess* and Alexander Kotov's *Think Like a Grandmaster*, and the Endgame School on Mark Dvoretsky's *Endgame Manual*, all explained in our own words.
- `npm run check:endgames` checks every endgame exercise (7 pieces or fewer) against the online Lichess tablebase, so the "only move" puzzles are exactly right.
- Revisiting a finished lesson never replaces it. The player can review every step with the answers they gave (picks, wrong tries, moves and routes), try any step again without affecting their score, and then play a bonus round with extra knowledge and harder questions. Bonus rounds have their own stars and XP.
- Interactive lesson steps: collect-the-stars piece games, a square-naming game, quizzes, find-the-move challenges and short practice rounds.
- Seven coaches with different teaching styles, from Pip for first-timers to Professor Lin for step-by-step technique.
- Tappable glossary: chess terms in lessons can be tapped to show a short definition.
- Progress feels like a game: XP, levels, daily streaks and up to three stars per lesson.

### Pattern Trainer
- Puzzles matched to your puzzle rating, which goes up and down as you solve or miss them.
- Nine patterns that unlock as you improve: free pieces, checkmate in 1, promotion, forks, back-rank mates, pins, skewers, checkmate in 2 and discovered attacks.
- Focuses on the patterns you miss most, and tracks your mastery of each one.
- Two-level hints, any correct alternative move accepted, and the solution shown after a miss.

### Game Review
- A "Game review" button after every bot and online game.
- The coach grades each of your moves (Best, Excellent, Good, Inaccuracy, Mistake, Blunder) and explains it in plain language.
- For slips, it shows the better move with an arrow on the board, the line that follows, and the reply your opponent could punish you with.
- A summary with your accuracy, a count of each kind of move, and a chart of how the game went. One tap jumps to your next slip.
- Links to completed lessons that cover the idea you missed.
- Reviews are saved to your game history when you are logged in; guests can still review but are told it will not be kept.

### Accounts and Profile
- Sign up with a username and password.
- Profile with rating, win/loss record, puzzle rating, level and best streak.
- Game history with saved reviews and accuracy for each reviewed game.

### Design
- App-style layout with a floating menu instead of a traditional website header.
- Custom flat SVG icons and coach mascots throughout.
- Several board themes, optional move sounds and board coordinates.
- Works on desktop and mobile.

## Tech Stack

| Part | Technology |
|---|---|
| Frontend | React 18, Vite, chess.js |
| Chess engine | Custom JavaScript engine running in a Web Worker |
| Backend | Node.js, Express, `ws` (WebSockets) |
| Storage | MongoDB when `MONGODB_URI` is set, otherwise a local JSON file (`server/data/db.json`) |

## Getting Started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app opens at http://localhost:5173, and the API server runs on port 3001.

To run a production build, where the server also serves the built frontend:

```bash
npm run build
npm start
```

## Deploying to Render (free tier)

The app runs as a single Render web service: the server hosts the API, the WebSocket connection for online games, and the built frontend. Render's free disk is wiped on every restart, so data is stored in a free MongoDB Atlas cluster.

1. **Create the database.** Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free M0 cluster on AWS in Singapore (`ap-southeast-1`), the same region as the Render service in `render.yaml`. Under Database Access, add a database user. Under Network Access, allow access from anywhere (`0.0.0.0/0`), because Render's free tier has no fixed IP address. Copy the connection string (Connect, then Drivers).
2. **Push the project to GitHub** (or GitLab).
3. **Create the service.** In the [Render dashboard](https://dashboard.render.com), choose New, then Blueprint, and pick the repository. Render reads `render.yaml` and sets up the build and start commands.
4. **Add the connection string.** When asked, paste the Atlas connection string as `MONGODB_URI`, with your database user's password filled in.
5. Open the `onrender.com` address Render gives you.

Notes:
- Free services sleep after about 15 minutes without visitors. The first visit after that takes 30 to 60 seconds to wake the server up.
- Online games in progress live in server memory, so a restart or redeploy ends them. Accounts, finished games and progress are kept in the database.
- See `.env.example` for all settings.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the client and server in development mode |
| `npm run build` | Builds the client into `client/dist` |
| `npm start` | Starts the server (serves the built client if present) |
| `npm run test:engine` | Checks the chess engine's move generation |
| `npm run test:lessons` | Validates every lesson step and position |
| `npm run test:puzzles` | Validates every puzzle solution with the engine |

## Project Structure

```
client/          React frontend
  src/api/         HTTP and WebSocket clients
  src/components/  Board, icons, layout and shared UI
  src/engine/      Chess engine and bot difficulty levels
  src/pages/       Home, online play, bot play, training, game review, profile, auth
  src/review/      Move grading, commentary and the game review runner
  src/training/    Lessons, coaches, puzzles, trainer logic and hint-to-lesson links
server/          Express and WebSocket backend
  src/auth/        Password hashing and sessions
  src/db/          In-memory store with MongoDB and JSON file backends
  src/online/      Game rooms and the socket server
  src/routes/      REST API routes
scripts/         Engine, lesson and puzzle validators
```
