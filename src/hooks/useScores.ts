import { useState, useEffect } from "react"

export type Score = {
    _id: string
    username: string
    wpm: number
    accuracy: number
    correctTypedWords: number
    incorrectTypedWords: number
    correctKeyStrokes: number
    incorrectKeyStrokes: number
    duration: number
    date: Date
}

type ScoresResponse = {
    message: string
    scores: Score[]
}

function useScores(): {
    scores: Score[] | null
    loading: boolean
    error: Error | null
} {
    const [scores, setScores] = useState<Score[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5002/score")
                if (!response.ok) {
                    throw new Error("Network response was not ok.")
                }
                const data: ScoresResponse = await response.json()
                setScores(data.scores)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { scores, loading, error }
}

export default useScores
