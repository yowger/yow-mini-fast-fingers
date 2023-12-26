import { memo } from "react"

type gameSettingsProps = {
    duration: number
    onChangeGameDuration: () => void
    username: string
    onChangeUsername: () => void
}

const MemoizedGameSettings = memo(function GameSettings({
    duration,
    onChangeGameDuration,
    username,
    onChangeUsername,
}: gameSettingsProps) {
    return (
        <div id="game-settings">
            <button className="button button-sm" onClick={onChangeGameDuration}>
                Duration: {duration}s
            </button>
            {username && (
                <button className="button button-sm" onClick={onChangeUsername}>
                    {username}
                </button>
            )}
        </div>
    )
})

export default MemoizedGameSettings
