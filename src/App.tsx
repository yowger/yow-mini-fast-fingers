import { useState, useEffect, ChangeEvent } from "react"

import "./App.css"
import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import resetIcon from "./assets/icons/reset.svg"
import MemoizedWordDisplay from "./components/WordDisplay"

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
        const isEmpty = value === " "

        if (isEmpty) return

        const enteredWord = value.trim()
        const currentActiveWord = words[activeWordIndex]
        const isTypedWordMatch = currentActiveWord.startsWith(enteredWord)

        if (isTypedWordMatch) {
            console.log("right")
            setIsWordMatch(true)
        } else {
            setIsWordMatch(false)
            console.log("wrong")
        }

        if (value.endsWith(" ")) {
            setCorrectWords((prevCorrectWords) => [
                ...prevCorrectWords,
                {
                    index: activeWordIndex,
                    correct: enteredWord === currentActiveWord,
                },
            ])

            setActiveWordIndex((prevIndex) => prevIndex + 1)
            setUserInput("")
        } else {
            setUserInput(value)
        }
    }

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
                <div id="wordBox" className="">
                    {words?.map((word, index) => {
                        const isActive = index === activeWordIndex

                        return (
                            <MemoizedWordDisplay
                                key={index}
                                index={index}
                                word={word}
                                isActive={isActive}
                                isWordMatch={isWordMatch}
                                correctWords={correctWords}
                            />
                        )
                    })}
                </div>
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
