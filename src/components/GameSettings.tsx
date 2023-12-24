import { memo } from "react"

type gameSettingsProps = {
    onChangeGameDuration: () => void
    duration: number
}

const MemoizedGameSettings = memo(function GameSettings({
    onChangeGameDuration,
    duration,
}: gameSettingsProps) {
    return (
        <div id="game-settings">
            <button className="button button-sm" onClick={onChangeGameDuration}>
                Duration: {duration}s
            </button>
        </div>
    )
})

export default MemoizedGameSettings
