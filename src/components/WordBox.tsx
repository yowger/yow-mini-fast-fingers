import { memo, useRef } from "react"
import { type CorrectWordProps } from "../App"
import MemoizedWordDisplay from "./WordDisplay"

type WordBoxProps = {
    words: string[]
    activeWordIndex: number
    isWordMatch: boolean | undefined
    correctWords: CorrectWordProps[]
}

const MemoizedWordBox = memo(function WordBox({
    words,
    activeWordIndex,
    isWordMatch,
    correctWords,
}: WordBoxProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    console.log("render")
    return (
        <div id="wordBox" ref={containerRef}>
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
})

export default MemoizedWordBox
