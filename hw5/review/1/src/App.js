import { useState } from 'react'
import './App.css'
import { guess, startGame, restart } from './axios'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [number, setNumber] = useState('')
  const [status, setStatus] = useState('')
  const [range, setRange] = useState({'lower': 1, 'upper': 100})

  const startMenu = (
    <div>
      <button
        onClick={async () => {
          const msg = await startGame()
          if(msg === 'The game has started.'){
            setHasStarted(true)
          }
        }}
      >
        start game
      </button>
    </div>
  )

  const winningMode = (
    <>
      <p>you won! the number was {number}.</p>
      <button
        onClick={async () => {
          await restart()
          setHasWon(false)
          setStatus('')
          setNumber('')
          setRange({'lower': 1, 'upper': 100})
        }}
      >
        restart
      </button>
    </>
  )

  // TODO:
  // 1. use async/await to call guess(number) in Axios
  // 2. Process the response from server to set the proper state values
  const handleGuess = async () => {
    
    const result = await guess(number);
    console.log(result);
    if (result === 'Equal') {
      setHasWon(true)
      setStatus('Equal')
    }
    else if (result === 'Bigger') {
      setHasWon(false)
      setStatus('Bigger')
      setRange({...range, 'lower': number})
    }
    else if (result === 'Smaller'){
      setHasWon(false)
      setStatus('Smaller')
      setRange({...range, 'upper': number})
    }
    else if (result === 'server down'){
      setStatus('The server is disconnected. Waiting server to be reconnected!')
    }
    else if (result === 'Not a legal number.'){
      setStatus(`Error: ${number} is not a valid number (${range['lower']} - ${range['upper']})`)
    }
  }

  const gameMode = (
    <>
      <p>Guess a number between {range["lower"]} to {range["upper"]}</p>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      ></input>
      <button
        onClick={handleGuess}
        disabled={!number}
      >
        guess!
      </button>
      <p>{status}</p>
    </>
  )

  const game = (
    <div>
      {hasWon ? winningMode : gameMode}
    </div>
  )

  return <div className="App">{hasStarted ? game : startMenu}</div>
}

export default App
