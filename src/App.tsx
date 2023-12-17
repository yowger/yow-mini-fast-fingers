import { useState, useEffect, ChangeEvent } from "react"

import "./App.css"
import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import resetIcon from "./assets/icons/reset.svg"
import WordDisplay from "./components/WordDisplay"

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

        if (value.endsWith(" ")) {
            const enteredWord = value.trim()
            const currentActiveWord = words[activeWordIndex]

            setCorrectWords((prevCorrectWords) => [
                ...prevCorrectWords,
                {
                    index: activeWordIndex,
                    correct: enteredWord === currentActiveWord,
                },
            ])

            console.log("correct words: ", correctWords)

            setActiveWordIndex((prevIndex) => prevIndex + 1)
            setUserInput("")

            console.log("")
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
                            <WordDisplay
                                key={index}
                                index={index}
                                word={word}
                                isActive={isActive}
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
