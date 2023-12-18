import { useState, useEffect, ChangeEvent, useRef } from "react"

import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import WordBox from "./components/WordBox"
import resetIcon from "./assets/icons/reset.svg"
import "./App.css"
import Timer from "./components/Timer"
import GameSettings from "./components/GameSettings"

export type CorrectWordProps = {
    index: number
    correct: boolean
}

export default function App() {
    const defaultTime = 60
    const wordsUrl = "assets/data/words.json"
    const fetchedWords = useFetchWords(wordsUrl)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [gameState, setGameState] = useState({
        words: [] as string[],
        userInput: "",
        activeWordIndex: 0,
        isWordMatch: undefined as boolean | undefined,
        correctWords: [] as CorrectWordProps[],
        duration: defaultTime,
        timer: defaultTime,
        startTimer: false,
        isGameEnd: false,
    })

    useEffect(() => {
        if (fetchedWords && fetchedWords.length > 0) {
            setGameState((prevState) => ({
                ...prevState,
                words: shuffleWords(fetchedWords),
            }))
        }
    }, [fetchedWords])

    useEffect(() => {
        if (gameState.startTimer && gameState.timer > 0) {
            const interval = setInterval(() => {
                setGameState((prevState) => ({
                    ...prevState,
                    timer: prevState.timer - 1,
                }))
            }, 1000)

            return () => clearInterval(interval)
        } else if (gameState.timer === 0) {
            handleGameEnd()
        }
    }, [gameState.startTimer, gameState.timer])

    useEffect(() => {
        handleGameReset()
    }, [gameState.duration])

    function handleGameReset() {
        setGameState((prevState) => ({
            ...prevState,
            words: shuffleWords(prevState.words),
            activeWordIndex: 0,
            correctWords: [],
            isWordMatch: undefined,
            userInput: "",
            timer: prevState.duration,
            startTimer: false,
            isGameEnd: false,
        }))
        inputRef?.current?.focus()
    }

    function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value

        setGameState((prevState) => ({
            ...prevState,
            isGameEnd: false,
            startTimer: true,
            userInput: value === " " ? "" : value,
        }))

        if (value === " ") return

        const enteredWord = value.trim()
        const currentActiveWord = gameState.words[gameState.activeWordIndex]
        const isTypedWordMatch = currentActiveWord.startsWith(enteredWord)

        setGameState((prevState) => ({
            ...prevState,
            isWordMatch: isTypedWordMatch,
        }))

        if (value.endsWith(" ")) {
            handleWordCompletion(enteredWord, currentActiveWord)

            setGameState((prevState) => ({
                ...prevState,
                isWordMatch: undefined,
            }))
        }
    }

    function handleWordCompletion(
        enteredWord: string,
        currentActiveWord: string
    ) {
        setGameState((prevState) => ({
            ...prevState,
            correctWords: [
                ...prevState.correctWords,
                {
                    index: prevState.activeWordIndex,
                    correct: enteredWord === currentActiveWord,
                },
            ],
            activeWordIndex: prevState.activeWordIndex + 1,
            userInput: "",
        }))
    }

    function handleGameDuration() {
        const newDuration = gameState.duration === 60 ? 30 : 60
        setGameState((prevState) => ({
            ...prevState,
            duration: newDuration,
        }))
    }

    function handleGameEnd() {
        setGameState((prevState) => ({
            ...prevState,
            isGameEnd: true,
        }))

        const correctWordCount = gameState.correctWords.filter(
            (word) => word.correct
        ).length
        const totalWordsTyped = gameState.correctWords.length
        const accuracy =
            totalWordsTyped > 0
                ? ((correctWordCount / totalWordsTyped) * 100).toFixed(2)
                : 0

        const wordsPerMinute = Math.round(
            (correctWordCount * 60) / (60 - gameState.timer)
        )

        console.log("Accuracy:", accuracy + "%")
        console.log("Words Per Minute:", wordsPerMinute)
    }

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
                <GameSettings
                    duration={gameState.duration}
                    onChangeGameDuration={handleGameDuration}
                />
                <WordBox
                    words={gameState.words}
                    activeWordIndex={gameState.activeWordIndex}
                    isWordMatch={gameState.isWordMatch}
                    correctWords={gameState.correctWords}
                />
                <div id="input-row">
                    <input
                        type="text"
                        value={gameState.userInput}
                        onChange={handleUserInput}
                        className="input"
                        ref={inputRef}
                        disabled={gameState.isGameEnd}
                    />
                    <Timer time={gameState.timer} />
                    <button className="button" onClick={handleGameReset}>
                        <div className="button-icon">
                            <img src={resetIcon} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
