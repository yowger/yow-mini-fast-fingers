import { useState, useEffect, ChangeEvent } from "react"

import "./App.css"
import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"
import resetIcon from "./assets/icons/reset.svg"

export default function App() {
    const wordsUrl = "assets/data/words.json"
    const fetchedWords = useFetchWords(wordsUrl)
    const [words, setWords] = useState<string[]>([])
    const [userInput, setUserInput] = useState("")

    useEffect(() => {
        if (fetchedWords && fetchedWords.length > 0) {
            setWords(shuffleWords(fetchedWords))
        }
    }, [fetchedWords])

    function handleGameReset() {
        console.log("reset")
        setWords((prevWords) => shuffleWords(prevWords))
    }

    function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        setUserInput(value)
    }

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
                <div id="wordBox" className="">
                    {words?.map((word, index) => (
                        <span key={index}>{word}</span>
                    ))}
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
