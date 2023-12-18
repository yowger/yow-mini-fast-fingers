import { useState, useEffect, ChangeEvent, useRef } from "react"

import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import WordBox from "./components/WordBox"
import resetIcon from "./assets/icons/reset.svg"
import "./App.css"
import Timer from "./components/Timer"
import GameSettings from "./components/GameSettings"

export type correctWordProps = {
    index: number
    correct: boolean
}

export default function App() {
    const wordsUrl = "assets/data/words.json"
    const fetchedWords = useFetchWords(wordsUrl)
    const [words, setWords] = useState<string[]>([])
    const [userInput, setUserInput] = useState("")
    const [activeWordIndex, setActiveWordIndex] = useState(0)
    const [isWordMatch, setIsWordMatch] = useState<boolean | undefined>(
        undefined
    )
    const [correctWords, setCorrectWords] = useState<correctWordProps[]>([])
    const [duration, setDuration] = useState(60)
    const [timer, setTimer] = useState(duration)
    const [startTimer, setStartTimer] = useState(false)
    const [isGameEnd, setIsGameEnd] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (fetchedWords && fetchedWords.length > 0) {
            setWords(shuffleWords(fetchedWords))
        }
    }, [fetchedWords])

    useEffect(() => {
        if (startTimer && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1)
            }, 1000)

            return () => clearInterval(interval)
        } else if (timer === 0) {
            handleGameEnd()
        }
    }, [startTimer, timer])

    function handleGameReset() {
        setWords((prevWords) => shuffleWords(prevWords))
        setActiveWordIndex(0)
        setCorrectWords([])
        setIsWordMatch(undefined)

        setUserInput("")
        inputRef?.current?.focus()

        setTimer(duration)
        setStartTimer(false)

        setIsGameEnd(false)
    }

    function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value

        setIsGameEnd(false)
        setStartTimer(true)

        if (value === " ") return

        const enteredWord = value.trim()
        const currentActiveWord = words[activeWordIndex]
        const isTypedWordMatch = currentActiveWord.startsWith(enteredWord)

        if (isTypedWordMatch) {
            setIsWordMatch(true)
        } else {
            setIsWordMatch(false)
        }

        if (value.endsWith(" ")) {
            handleWordCompletion(enteredWord, currentActiveWord)
        } else {
            setUserInput(value)
        }
    }

    function handleWordCompletion(
        enteredWord: string,
        currentActiveWord: string
    ) {
        setCorrectWords((prevCorrectWords) => [
            ...prevCorrectWords,
            {
                index: activeWordIndex,
                correct: enteredWord === currentActiveWord,
            },
        ])

        setActiveWordIndex((prevIndex) => prevIndex + 1)
        setUserInput("")
    }

    function handleGameDuration() {
        const newDuration = duration === 60 ? 30 : 60
        console.log(
            "🚀 ~ file: App.tsx:107 ~ handleGameDuration ~ changeDuration:",
            newDuration
        )

        setDuration(newDuration)
        setTimer(newDuration)
        // handleGameReset()
    }

    function handleGameEnd() {
        setIsGameEnd(true)

        const correctWordCount = correctWords.filter(
            (word) => word.correct
        ).length
        const incorrectWords = correctWords.filter((word) => !word.correct)

        const wordsPerMinute = Math.round(
            (correctWordCount * 60) / (60 - timer)
        )
    }

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
                <GameSettings
                    duration={duration}
                    onChangeGameDuration={handleGameDuration}
                />
                <WordBox
                    words={words}
                    activeWordIndex={activeWordIndex}
                    isWordMatch={isWordMatch}
                    correctWords={correctWords}
                />
                <div id="input-row">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleUserInput}
                        className="input"
                        ref={inputRef}
                        disabled={isGameEnd}
                    />
                    <Timer time={timer} />
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
