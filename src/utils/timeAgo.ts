export function timeAgo(date: Date) {
    const currentDate = new Date()
    const previousDate = new Date(date)

    const timeDifference = currentDate.getTime() - previousDate.getTime()

    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) {
        return previousDate.toLocaleDateString()
    } else if (days >= 1) {
        return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours >= 1) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes >= 1) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
        return "Just now"
    }
}
