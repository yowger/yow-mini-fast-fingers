import { memo } from "react"
import { CorrectWordProps } from "../App"

type WordDisplayProps = {
    index: number
    word: string
    isActive: boolean
    isWordMatch: boolean | undefined
    correctWords: CorrectWordProps[]
}

const MemoizedWordDisplay = memo(function WordDisplay({
    index,
    word,
    isActive,
    isWordMatch,
    correctWords,
}: WordDisplayProps) {
    const isWordCorrect = correctWords.find(
        (correctWord) => correctWord.index === index
    )?.correct

    if (isActive) {
        return (
            <span
                className={`activeWord ${isWordMatch === false && "unmatched"}`}
            >
                {word}
            </span>
        )
    }

    if (isWordCorrect === true) {
        return <span className="correct">{word}</span>
    }

    if (isWordCorrect === false) {
        return <span className="incorrect">{word}</span>
    }

    return <span>{word}</span>
})

export default MemoizedWordDisplay
