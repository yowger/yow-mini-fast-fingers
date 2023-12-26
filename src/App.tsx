import {
    type ChangeEvent,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
} from "react"

import debounce from "./utils/debounce"
import { shuffleWords } from "./utils/shuffleWords"
import useFetchWords from "./hooks/useFetchWords"
import MemoizedWordBox, { type WordBoxRefProps } from "./components/WordBox"
import MemoizedGameSettings from "./components/GameSettings"
import Timer from "./components/Timer"
import "./App.css"
import resetIcon from "./assets/icons/reset.svg"
import MemoizedGameScore from "./components/GameScore"
import MemoizedHighScore from "./components/HighScore"
import useGetScores from "./hooks/useGetScores"
import { randomUsername } from "./utils/randomUsername"
import usePostScore, { type Score } from "./hooks/usePostScore"

export type CorrectWordProps = {
    index: number
    correct: boolean
}

export default function App() {
    const defaultTime = 60
    const wordsUrl = "assets/data/words.json"
    const fetchedWords = useFetchWords(wordsUrl)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const containerRef = useRef<WordBoxRefProps>(null)
    const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0)
    const [incorrectKeyStrokes, setIncorrectKeyStrokes] = useState(0)
    const [username, setUsername] = useState("")

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
        endOfRowIndices: [] as number[],
        scores: {
            correctWordCount: 0,
            incorrectWordCount: 0,
            correctKeyStrokes: 0,
            incorrectKeyStrokes: 0,
            accuracy: 0,
            wordsPerMinute: 0,
        },
    })

    const { scores: getScores, loading } = useGetScores()
    const { postScore } = usePostScore()

    useEffect(() => {
        const storedUsername = localStorage.getItem("username")

        if (storedUsername) {
            setUsername(storedUsername)
        } else if (!username) {
            const newUsername = randomUsername()
            setUsername(newUsername)
            localStorage.setItem("username", newUsername)
        }
    }, [])

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.startTimer, gameState.timer])

    useEffect(() => {
        handleGameReset()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.duration])

    useEffect(() => {
        if (gameState.endOfRowIndices.includes(gameState.activeWordIndex - 1)) {
            const containerRowNode = containerRef?.current?.getContainerRowRef()
            if (containerRowNode) {
                const endOfRowIndex =
                    gameState.endOfRowIndices.indexOf(
                        gameState.activeWordIndex - 1
                    ) + 1

                const rowHeight = 55

                const topPosition = `${-rowHeight * endOfRowIndex}px`
                containerRowNode.style.top = topPosition
            }
        }
    }, [gameState.activeWordIndex, gameState.endOfRowIndices])

    useEffect(() => {
        function handleResize() {
            if (gameState.startTimer) {
                handleGameReset()
            }
        }

        const debouncedResize = debounce(handleResize, 300)

        window.addEventListener("resize", debouncedResize)

        return () => {
            window.removeEventListener("resize", debouncedResize)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.startTimer])

    const handleOnChangeUsername = () => {
        let username = window.prompt(
            "Please choose a username (maximum 18 characters)"
        )

        if (username === "") return

        if (username !== null) {
            username = username.trim()

            if (username.length > 18) {
                username = username.slice(0, 18)
            }

            setUsername(username)

            localStorage.setItem("username", username)
        }
    }

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
            scores: {
                correctWordCount: 0,
                incorrectWordCount: 0,
                correctKeyStrokes: 0,
                incorrectKeyStrokes: 0,
                accuracy: 0,
                wordsPerMinute: 0,
            },
        }))

        resetContainerTopPosition()

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

        if (!isTypedWordMatch && !value.includes(" ")) {
            setIncorrectKeyStrokes((prevCount) => prevCount + 1)
        }

        setGameState((prevState) => ({
            ...prevState,
            isWordMatch: isTypedWordMatch,
        }))

        if (value.endsWith(" ")) {
            handleWordCompletion(enteredWord, currentActiveWord)

            setGameState((prevState) => ({
                ...prevState,
                isWordMatch: undefined,
                scores: {
                    ...prevState.scores,
                    correctKeyStrokes:
                        prevState.scores.correctKeyStrokes + correctKeyStrokes,
                },
            }))

            const correctKeyStrokes = isTypedWordMatch ? enteredWord.length : 0
            setCorrectKeyStrokes((prevCount) => prevCount + correctKeyStrokes)
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

    const handleChangeGameDuration = useCallback(() => {
        const newDuration = gameState.duration === 60 ? 30 : 60
        setGameState((prevState) => ({
            ...prevState,
            duration: newDuration,
        }))
    }, [gameState.duration])

    function handleEndOfRowIndices(indices: number[]) {
        setGameState((prevState) => ({
            ...prevState,
            endOfRowIndices: indices,
        }))
    }

    const scores = useMemo(
        () => gameState.scores,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [gameState.duration, gameState.isGameEnd]
    )

    function resetContainerTopPosition() {
        const containerRowNode = containerRef?.current?.getContainerRowRef()
        if (containerRowNode) {
            containerRowNode.style.top = "0"
        }
    }

    function handleGameEnd() {
        const correctWordCount = gameState.correctWords.filter(
            (word) => word.correct
        ).length
        const totalWordsTyped = gameState.correctWords.length
        const incorrectWordCount = totalWordsTyped - correctWordCount
        const accuracy: number =
            totalWordsTyped > 0
                ? +((correctWordCount / totalWordsTyped) * 100).toFixed(2)
                : 0

        const totalKeystrokes = correctKeyStrokes + incorrectKeyStrokes
        const totalKeystrokeTyped = Math.round(totalKeystrokes / 5)
        const wordsPerMinute = Math.round(
            (totalKeystrokeTyped * 60) / (60 - gameState.timer)
        )

        // old formula
        // const wordsPerMinute = Math.round(
        //     (correctWordCount * 60) / (60 - gameState.timer)
        // )
        /*
        username: string
    wpm: number
    accuracy: number
    correctTypedWords: number
    incorrectTypedWords: number
    correctKeyStrokes: number
    incorrectKeyStrokes: number
    duration: number
    */

        const scoreData: Score = {
            username,
            wpm: wordsPerMinute,
            accuracy: accuracy,
            correctTypedWords: correctWordCount,
            incorrectTypedWords: incorrectWordCount,
            correctKeyStrokes: correctKeyStrokes,
            incorrectKeyStrokes: incorrectKeyStrokes,
            duration: gameState.duration,
        }

        postScore(scoreData)
            .then(() => {
                console.log("Score posted successfully!")
            })
            .catch((error) => {
                console.error("Failed to post score:", error)
            })

        setGameState((prevState) => ({
            ...prevState,
            isGameEnd: true,
            scores: {
                ...prevState.scores,
                correctWordCount,
                incorrectWordCount,
                correctKeyStrokes,
                incorrectKeyStrokes,
                accuracy,
                wordsPerMinute,
            },
        }))
    }

    return (
        <div id="root">
            <div className="container">
                <div id="header">
                    <h1>Fast Fingers</h1>
                </div>
                <MemoizedGameSettings
                    duration={gameState.duration}
                    onChangeGameDuration={handleChangeGameDuration}
                    username={username}
                    onChangeUsername={handleOnChangeUsername}
                />
                <MemoizedWordBox
                    words={gameState.words}
                    activeWordIndex={gameState.activeWordIndex}
                    isWordMatch={gameState.isWordMatch}
                    correctWords={gameState.correctWords}
                    onEndOfRowIndices={handleEndOfRowIndices}
                    ref={containerRef}
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
                <MemoizedGameScore
                    scores={scores}
                    duration={gameState.duration}
                    isGameEnd={gameState.isGameEnd}
                />
                {loading ? "..." : <MemoizedHighScore scores={getScores} />}
                {/* all time high */}
            </div>
        </div>
    )
}
