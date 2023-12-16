import { useEffect, useState } from "react"

function useFetchWords(url: string): string[] | null {
    const [words, setWords] = useState<string[] | null>(null)

    useEffect(() => {
        let isMounted = true

        async function fetchData() {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error("Failed to fetch")
                }
                const data = await response.json()
                if (isMounted) {
                    setWords(data)
                }
            } catch (error) {
                console.error("Error fetching words:", error)
                setWords(null)
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [url])

    return words
}

export default useFetchWords
