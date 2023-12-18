import { useState, useEffect, ChangeEvent } from "react"

import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import WordBox from "./components/WordBox"
import resetIcon from "./assets/icons/reset.svg"
import "./App.css"

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

    useEffect(() => {
        if (fetchedWords && fetchedWords.length > 0) {
            setWords(shuffleWords(fetchedWords))
        }
    }, [fetchedWords])

    function handleGameReset() {
        setWords((prevWords) => shuffleWords(prevWords))
        setActiveWordIndex(0)
        setCorrectWords([])
    }

    function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value

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

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
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
                    />
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
