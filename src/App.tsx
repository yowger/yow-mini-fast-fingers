import { useState, useEffect, ChangeEvent } from "react"

import "./App.css"
import useFetchWords from "./hooks/useFetchWords"
import { shuffleWords } from "./utils/shuffleWords"

export default function App() {
    const wordsUrl = "assets/data/words.json"
    const fetchedWords = useFetchWords(wordsUrl)
    const [randomizedWords, setRandomizedWords] = useState<string[]>([])
    const [userInput, setUserInput] = useState("")

    useEffect(() => {
        if (fetchedWords && fetchedWords.length > 0) {
            setRandomizedWords(shuffleWords(fetchedWords))
        }
    }, [fetchedWords])

    function handleUserInput(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        setUserInput(value)
    }

    return (
        <>
            <div>
                <ul>
                    {randomizedWords.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
            </div>
            <input type="text" value={userInput} onChange={handleUserInput} />
            <p>{userInput}</p>
        </>
    )
}
