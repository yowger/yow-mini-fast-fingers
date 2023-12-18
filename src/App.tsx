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
        console.log(
            "🚀 ~ file: App.tsx:138 ~ handleGameEnd ~ correctWordCount:",
            correctWordCount
        )
        const InCorrectWordCount = gameState.correctWords.filter(
            (word) => !word.correct
        ).length
        console.log(
            "🚀 ~ file: App.tsx:141 ~ handleGameEnd ~ InCorrectWordCount:",
            InCorrectWordCount
        )
        const wordsPerMinute = Math.round(
            (correctWordCount * 60) / (60 - gameState.timer)
        )
        console.log(
            "🚀 ~ file: App.tsx:145 ~ handleGameEnd ~ wordsPerMinute:",
            wordsPerMinute
        )
    }

    // function handleGameEnd() {
    //     setIsGameEnd(true)

    //     const correctWordCount = correctWords.filter(
    //         (word) => word.correct
    //     ).length
    //     const incorrectWords = correctWords.filter((word) => !word.correct)

    //     const wordsPerMinute = Math.round(
    //         (correctWordCount * 60) / (60 - timer)
    //     )
    // }

    // function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
    //     const value = event.target.value

    //     setIsGameEnd(false)
    //     setStartTimer(true)

    //     if (value === " ") return

    //     const enteredWord = value.trim()
    //     const currentActiveWord = words[activeWordIndex]
    //     const isTypedWordMatch = currentActiveWord.startsWith(enteredWord)

    //     if (isTypedWordMatch) {
    //         setIsWordMatch(true)
    //     } else {
    //         setIsWordMatch(false)
    //     }

    //     if (value.endsWith(" ")) {
    //         handleWordCompletion(enteredWord, currentActiveWord)
    //     } else {
    //         setUserInput(value)
    //     }
    // }

    // function handleWordCompletion(
    //     enteredWord: string,
    //     currentActiveWord: string
    // ) {
    //     setCorrectWords((prevCorrectWords) => [
    //         ...prevCorrectWords,
    //         {
    //             index: activeWordIndex,
    //             correct: enteredWord === currentActiveWord,
    //         },
    //     ])

    //     setActiveWordIndex((prevIndex) => prevIndex + 1)
    //     setUserInput("")
    // }

    // function handleGameReset() {
    //     setWords((prevWords) => shuffleWords(prevWords))
    //     setActiveWordIndex(0)
    //     setCorrectWords([])
    //     setIsWordMatch(undefined)

    //     setUserInput("")
    //     inputRef?.current?.focus()

    //     setTimer(duration)
    //     setStartTimer(false)

    //     setIsGameEnd(false)
    // }

    // function handleGameDuration() {
    //     const newDuration = duration === 60 ? 30 : 60

    //     setDuration(newDuration)
    // }

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
