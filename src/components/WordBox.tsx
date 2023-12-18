import { type CorrectWordProps } from "../App"
import MemoizedWordDisplay from "./WordDisplay"

type WordBoxProps = {
    words: string[]
    activeWordIndex: number
    isWordMatch: boolean | undefined
    correctWords: CorrectWordProps[]
}

export default function WordBox({
    words,
    activeWordIndex,
    isWordMatch,
    correctWords,
}: WordBoxProps) {
    return (
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
    )
}
