import { memo } from "react"

import { Score } from "../hooks/useGetScores"
import { timeAgo } from "../utils/timeAgo"

type HighScoreProps = {
    scores: Score[] | null
}

const MemoizedHighScore = memo(function HighScore({ scores }: HighScoreProps) {
    return (
        <>
            <div className="score-container">
                <div className="table-header">
                    <h2>Recent scores</h2>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>WPM</th>
                            <th>Accuracy</th>
                            <th>Duration</th>
                            <th>Ago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores?.map((score, index) => (
                            <tr key={index}>
                                <td>{score.username}</td>
                                <td>{score.wpm}</td>
                                <td>{score.accuracy}</td>
                                <td>{score.duration}</td>
                                <td>{timeAgo(score.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
})

export default MemoizedHighScore
