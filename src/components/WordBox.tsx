import {
    forwardRef,
    memo,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react"

import { type CorrectWordProps } from "../App"
import MemoizedWordDisplay from "./WordDisplay"

export type WordBoxRefProps = {
    getContainerRowRef: () => HTMLDivElement | null
}

type WordBoxProps = {
    words: string[]
    activeWordIndex: number
    isWordMatch: boolean | undefined
    correctWords: CorrectWordProps[]
    onEndOfRowIndices: (indices: number[]) => void
}

const getWidthExcludingPadding = (element: HTMLElement | null): number => {
    if (!element) return 0

    const containerInlinePadding =
        window.getComputedStyle(element).paddingInline
    const paddingValues = parseFloat(containerInlinePadding) * 2

    return element.clientWidth - paddingValues
}

const MemoizedWordBox = memo(
    forwardRef(function WordBox(
        {
            words,
            activeWordIndex,
            isWordMatch,
            correctWords,
            onEndOfRowIndices,
        }: WordBoxProps,
        ref: React.Ref<WordBoxRefProps>
    ) {
        const containerRef = useRef<HTMLDivElement>(null)
        const containerRowRef = useRef<HTMLDivElement>(null)
        const [containerWidth, setContainerWidth] = useState<number | null>(
            null
        )
        const [wordWidths, setWordWidths] = useState<number[]>([])

        useImperativeHandle(ref, () => ({
            getContainerRowRef: () => containerRowRef.current,
        }))

        useLayoutEffect(() => {
            const width = getWidthExcludingPadding(containerRef.current)
            setContainerWidth(width)
        }, [words])

        useLayoutEffect(() => {
            const container = containerRef.current
            if (!container) return

            const wordSpans = container.childNodes[0].childNodes

            const widths = Array.from(wordSpans)
                .filter((node) => node instanceof HTMLElement)
                .map((node) => (node as HTMLElement).clientWidth)

            setWordWidths(widths)
        }, [words])

        useLayoutEffect(() => {
            if (!containerWidth || !wordWidths.length) return

            let accumulatedWidth = 0
            let endOfRowIndex = -1
            const newRowIndices: number[] = []

            for (let i = 0; i < wordWidths.length; i++) {
                accumulatedWidth += wordWidths[i]
                if (accumulatedWidth > containerWidth) {
                    newRowIndices.push(endOfRowIndex)
                    accumulatedWidth = wordWidths[i]
                }
                endOfRowIndex = i
            }

            if (endOfRowIndex !== -1) {
                newRowIndices.push(endOfRowIndex)
            }

            // setEndOfRowIndices(newRowIndices)
            onEndOfRowIndices(newRowIndices)
        }, [containerWidth, wordWidths])

        return (
            <div id="wordBox" ref={containerRef}>
                <div id="wordBoxRow" ref={containerRowRef}>
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
            </div>
        )
    })
)

export default MemoizedWordBox
