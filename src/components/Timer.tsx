export default function Timer({ time }: { time: number }) {
    const formattedTime = `${Math.floor(time / 60)
        .toString()
        .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`

    return (
        <div id="timer">
            <span>{formattedTime}</span>
        </div>
    )
}
