type gameSettingsProps = {
    onChangeGameDuration: () => void
    duration: number
}

export default function GameSettings({
    onChangeGameDuration,
    duration,
}: gameSettingsProps) {
    return (
        <div id="game-settings">
            <button className="button button-sm" onClick={onChangeGameDuration}>
                Duration: {duration}
            </button>
        </div>
    )
}
