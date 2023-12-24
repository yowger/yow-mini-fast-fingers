import { memo } from "react"

type Scores = {
    wordsPerMinute: number
    accuracy: number
    correctKeyStrokes: number
    incorrectKeyStrokes: number
    correctWordCount: number
    incorrectWordCount: number
}

type GameScoreProps = {
    scores: Scores
    duration: number
    isGameEnd: boolean
}

const MemoizedGameScore = memo(function GameScore({
    scores,
    duration,
    isGameEnd,
}: GameScoreProps) {
    return (
        <div id="game-score-container">
            <div id="game-score">
                <div className="header">
                    <p>
                        <span className="wpm">
                            {isGameEnd ? scores.wordsPerMinute : ""}
                        </span>
                        WPM{" "}
                    </p>
                </div>
                <div>
                    <ul className="result-list">
                        <li>
                            <span>Accuracy </span>
                            <span className="bold">
                                {isGameEnd ? `${scores.accuracy}%` : "-"}
                            </span>
                        </li>
                        <li>
                            <span>Correct words </span>
                            <span
                                className={`${
                                    isGameEnd ? "success bold" : "bold"
                                }`}
                            >
                                {isGameEnd ? scores.correctWordCount : "-"}
                            </span>
                        </li>
                        <li>
                            <span>Incorrect words </span>
                            <span
                                className={`${
                                    isGameEnd ? "danger bold" : "bold"
                                }`}
                            >
                                {isGameEnd ? scores.incorrectWordCount : "-"}
                            </span>
                        </li>
                        <li>
                            <span>Key strokes</span>
                            <span>
                                {isGameEnd ? (
                                    <div className="keystroke">
                                        <span className="text-sm success">
                                            {scores.correctKeyStrokes}
                                        </span>
                                        <span className="slash">/</span>
                                        <span className="text-sm danger">
                                            {scores.incorrectKeyStrokes}
                                        </span>
                                        <span className="bold total">
                                            {scores.correctKeyStrokes +
                                                scores.incorrectKeyStrokes}
                                        </span>
                                    </div>
                                ) : (
                                    "-"
                                )}
                            </span>
                        </li>
                        <li>
                            <span>Duration</span>
                            <span>{duration}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
})

export default MemoizedGameScore
