import formatTime from "../utils/formatTime"

export default function Timer({ time }: { time: number }) {
    const formattedTime = formatTime(time)

    return (
        <div id="timer">
            <span>{formattedTime}</span>
        </div>
    )
}
