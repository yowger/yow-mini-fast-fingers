import { useState } from "react"

export type Score = {
    username: string
    wpm: number
    accuracy: number
    correctTypedWords: number
    incorrectTypedWords: number
    correctKeyStrokes: number
    incorrectKeyStrokes: number
    duration: number
}

type PostScoreResponse = {
    message: string
}

function usePostScore(): {
    loading: boolean
    error: Error | null
    postScore: (scoreData: Score) => Promise<void>
} {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const postScore = async (scoreData: Score) => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:5002/score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(scoreData),
            })

            if (!response.ok) {
                throw new Error("Failed to post score")
            }

            const data: PostScoreResponse = await response.json()
            console.log("Score posted:", data)
        } catch (error) {
            if (error instanceof Error) {
                setError(error)
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, postScore }
}

export default usePostScore
