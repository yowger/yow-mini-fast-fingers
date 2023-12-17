import { correctWordProps } from "../App"

type WordDisplayProps = {
    index: number
    word: string
    isActive: boolean
    correctWords: correctWordProps[]
}

export default function WordDisplay({
    index,
    word,
    isActive,
    correctWords,
}: WordDisplayProps) {
    const isWordCorrect = correctWords.find(
        (correctWord) => correctWord.index === index
    )?.correct

    if (isActive) {
        return <span className="activeWord">{word}</span>
    }

    if (isWordCorrect === true) {
        return <span className="correct">{word}</span>
    }

    if (isWordCorrect === false) {
        return <span className="incorrect">{word}</span>
    }

    return <span>{word}</span>
}
