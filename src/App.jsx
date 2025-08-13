import { useState } from "react"
import clsx from "clsx"
import ReactConfetti from "react-confetti"
import { languages } from "./languages"
import { getFarewellText } from "./farewellMsgs"
import { words } from './words'

export default function App() {

    /* 
        to be determined:
            - add remaining tries UI
            - add animation like confetti but when losing
            - set a timer that makes player losse if over
    */

    const [currentWord, setCurrentWord] = useState(() => getRandomWord(words))
    const [guess, setGuess] = useState([])

    const wrongGuessCount = guess.filter(el => !currentWord.split('').includes(el)).length

    const isGameLost = wrongGuessCount >= languages.length
    const isGameWon = currentWord.split('').every(el => guess.includes(el))
    const isGameOver = isGameLost || isGameWon

    const statusClassname = clsx({
        'status': true,
        'won': isGameWon,
        'lost': isGameLost,
        'farewell': !isGameOver && wrongGuessCount > 0 && !currentWord.split('').includes(guess[guess.length - 1])
    })

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

    const wordLetters = currentWord.split('').map((el, index) => {

        const isMissed = !guess.includes(el)
        const classname = clsx({ 'missed': isGameLost && isMissed })

        return (
            <span key={index} className={classname}>
                { guess.includes(el) || (isGameOver && isMissed) ? el : '' }
            </span>
        )
    })

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const keyboard = alphabet.split('').map(el => {

        const classname = clsx({
            'disabled': guess.includes(el) || isGameOver,
            'correct': guess.includes(el) && currentWord.split('').includes(el),
            'incorrect': guess.includes(el) && !currentWord.split('').includes(el)
        })

        return (
            <button 
                key={el} 
                className={classname}
                onClick={() => handleGuess(el)}
                disabled={isGameOver}
                aria-disabled={guess.includes(el)}
                aria-label={`letter ${el}`}
            >
                {el}
            </button>
        )
    })

    function generateStatusText() {
        if (!isGameOver) {
            if (wrongGuessCount > 0 && !currentWord.split('').includes(guess[guess.length - 1])) {
                return (
                    <p>
                        { getFarewellText(languages[wrongGuessCount - 1].name) }
                    </p>
                )
            }
        } else if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } else if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        } else return null
    }

    function handleGuess(value) {
        setGuess(prev => prev.includes(value) ? prev : [...prev, value])
    }

    function playNewGame() {
        setGuess([])
        setCurrentWord(() => getRandomWord(words))
    }

    function getRandomWord(wordsArr) {
        return wordsArr[Math.floor(Math.random() * wordsArr.length)]
    }

    return (
        <main className="container">
            
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <section 
                className={statusClassname} 
                aria-live="polite"
                role="status"
            >
                { generateStatusText() }
            </section>

            <section className="languages">{ languageEl }</section>

            <section className="letters">{ wordLetters }</section>

            <section className="sr-only" aria-live="polite" role="status">
                <p>
                    {
                        currentWord.split('').includes(guess[guess.length - 1]) ?
                        `Great! the letter ${guess[guess.length - 1]} is in the word` :
                        `Unfortunately, the letter ${guess[guess.length - 1]} is not in the word`
                    }
                    You have {languages.length - wrongGuessCount} attempts left.
                </p>
                <p>
                    {
                        `current word is ${currentWord.split('')
                            .map(el => guess.includes(el) ? el + '.' : 'blank.')
                            .join(' ')}`
                    }
                </p>
            </section>

            <section className="keyboard">{ keyboard }</section>

            {
                isGameWon ? <ReactConfetti /> : null
            }

            {
                isGameOver ? 
                <button className="new-game" onClick={playNewGame}>New Game</button> : 
                null 
            }
        </main>
    )
}