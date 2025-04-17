/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

const WORDS = ['banana', 'orange', 'grapes', 'lemon', 'peach', 'cherry', 'mango', 'plum', 'kiwi', 'melon'];
const MAX_STRIKES = 3;
const MAX_PASSES = 3;

const Game = () => {
  const [sWords, setSwords] = useState([]);
  const [cTask, setCTask] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [pass, setPass] = useState(MAX_PASSES);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Load saved game or initialize new game
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('scramble'));
    if (saved) {
      setSwords(saved.sWords);
      setCTask(saved.cTask);
      setScore(saved.score);
      setStrikes(saved.strikes);
      setPass(saved.pass);
    } else {
      const newWords = shuffle(WORDS);
      setSwords(newWords);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = { sWords, cTask, score, strikes, pass };
    localStorage.setItem('scramble', JSON.stringify(data));
  }, [sWords, cTask, score, strikes, pass]);

  const currentWord = sWords[cTask];
  const scrambled = currentWord ? shuffle(currentWord) : '';

  const handleGuess = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (input.toLowerCase() === currentWord) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setInput('');
      nextWord();
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setMessage('❌ Incorrect!');
      setInput('');
      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true);
        setMessage('Game Over! Try again.');
      }
    }
  };

  const nextWord = () => {
    if (cTask + 1 >= sWords.length) {
      setGameOver(true);
      setMessage('🎉 You completed all words!');
    } else {
      setCTask(cTask + 1);
    }
  };

  const handlePass = () => {
    if (pass > 0) {
      setPass(pass - 1);
      setMessage('🔁 Word passed!');
      nextWord();
    } else {
      setMessage('🚫 No more passes left!');
    }
  };

  const restartGame = () => {
    const newWords = shuffle(WORDS);
    setSwords(newWords);
    setCTask(0);
    setScore(0);
    setStrikes(0);
    setPass(MAX_PASSES);
    setMessage('');
    setGameOver(false);
    localStorage.removeItem('scramble');
  };

  return (
    <div className="row justify-content-center mt-4">
      {gameOver ? (
        <div className="col-12 text-center">
          <h2>🛑 Game Over</h2>
          <p>Score: {score}</p>
          <button className="btn btn-primary" onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div className="col-md-6">
          <h2 className="text-center mb-3">The Task: <span className="text-info">{scrambled}</span></h2>

          <form onSubmit={handleGuess} className="text-center mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your guess"
              className="form-control mb-2"
              autoFocus
            />
            <button type="submit" className="btn btn-danger col-6">Guess</button>
          </form>

          <h3 className="text-center">{message}</h3>

          <div className="d-flex justify-content-around flex-wrap mt-3">
            <h4 className="btn btn-secondary col-12 my-1">Score: {score}</h4>
            <h4 className="btn btn-success col-6 my-1">Strikes: {strikes} / {MAX_STRIKES}</h4>
            <h4 className="btn btn-warning col-6 my-1">Passes: {pass} / {MAX_PASSES}</h4>
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-primary col-6" onClick={handlePass}>Pass</button>
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-primary col-6" onClick={restartGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Game />);