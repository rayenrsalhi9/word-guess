import { useState } from "react"
import clsx from "clsx"
import ReactConfetti from "react-confetti"
import { languages } from "./languages"

export default function App() {

    const [currentWord, _] = useState('react')
    const [guess, setGuess] = useState([])

    const wrongGuessCount = guess.filter(el => !currentWord.split('').includes(el)).length

    const isGameOver = wrongGuessCount >= languages.length

    const isGameWon = currentWord.split('').every(el => guess.includes(el))

    const languageEl = languages.map((el, index) => {

        const styles = {
            backgroundColor: el.backgroundColor,
            color: el.color
        }

        const classname = clsx({
            'language': true,
            'lost': index < wrongGuessCount
        })

        return (
            <span 
                key={index} 
                style={styles}
                className={classname}
            >
                {el.name}
            </span>
        )
    })

    const wordLetters = currentWord.split('').map((el, index) => (
        <span key={index}>
            { guess.includes(el) ? el : '' }
        </span>
    ))

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const keyboard = alphabet.split('').map(el => {

        const classname = clsx({
            'disabled': guess.includes(el),
            'correct': guess.includes(el) && currentWord.split('').includes(el),
            'incorrect': guess.includes(el) && !currentWord.split('').includes(el)
        })

        return (
            <button 
                key={el} 
                className={classname}
                onClick={!classname ? () => handleGuess(el) : null}
            >
                {el}
            </button>
        )
    })

    function handleGuess(value) {
        setGuess(prev => prev.includes(value) ? prev : [...prev, value])
    }

    return (
        <main className="container">
            
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <section className="status">
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </section>

            <section className="languages">{ languageEl }</section>

            <section className="letters">{ wordLetters }</section>

            <section className="keyboard">{ keyboard }</section>

            {
                isGameWon ? <ReactConfetti /> : null
            }

            {
                isGameOver || isGameWon ? 
                <button className="new-game">New Game</button> : 
                null 
            }
        </main>
    )
}
